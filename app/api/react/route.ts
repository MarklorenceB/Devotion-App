import { NextRequest, NextResponse } from "next/server";
import { writeClient as client } from "@/sanity/lib/write-client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, commentKey, type, previousReaction } = body;

    if (!postId || !type) {
      return NextResponse.json(
        { error: "Missing required fields: postId, type" },
        { status: 400 }
      );
    }

    const validReactions = ["like", "love", "pray", "wow"];
    if (!validReactions.includes(type)) {
      return NextResponse.json(
        {
          error: `Invalid reaction type. Must be one of: ${validReactions.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // check if post exists
    const existingDoc = await client.getDocument(postId);
    if (!existingDoc) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // 🔥 CASE 1: Reacting to a COMMENT
    if (commentKey) {
      let patch = client
        .patch(postId)
        .setIfMissing({
          comments: [],
        })
        .setIfMissing({
          [`comments[_key=="${commentKey}"].reactions`]: {
            like: 0,
            love: 0,
            pray: 0,
            wow: 0,
          },
        });

      if (previousReaction && validReactions.includes(previousReaction)) {
        patch = patch.inc({
          [`comments[_key=="${commentKey}"].reactions.${previousReaction}`]: -1,
        });
      }

      patch = patch.inc({
        [`comments[_key=="${commentKey}"].reactions.${type}`]: 1,
      });

      await patch.commit();

      return NextResponse.json({
        success: true,
        target: "comment",
        commentKey,
        type,
      });
    }

    // 🔥 CASE 2: Reacting to the POST itself
    let patch = client
      .patch(postId)
      .setIfMissing({ reactions: { like: 0, love: 0, pray: 0, wow: 0 } });

    if (previousReaction && validReactions.includes(previousReaction)) {
      patch = patch.inc({ [`reactions.${previousReaction}`]: -1 });
    }

    patch = patch.inc({ [`reactions.${type}`]: 1 });

    await patch.commit();

    const updatedDoc = await client.getDocument(postId);
    const counts = updatedDoc.reactions || {
      like: 0,
      love: 0,
      pray: 0,
      wow: 0,
    };

    return NextResponse.json({
      success: true,
      target: "post",
      counts,
    });
  } catch (err) {
    console.error("React API Error:", err);
    return NextResponse.json(
      { error: "Failed to update reaction" },
      { status: 500 }
    );
  }
}
