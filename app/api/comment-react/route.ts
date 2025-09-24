// /api/comment-react/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeClient as client } from "@/sanity/lib/write-client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, commentKey, type, previousReaction } = body;

    if (!postId || !commentKey || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const validReactions = ["like", "love", "pray", "wow"];
    if (!validReactions.includes(type)) {
      return NextResponse.json(
        { error: "Invalid reaction type" },
        { status: 400 }
      );
    }

    // 🔍 Get the current document so we know counts
    const existingDoc = await client.getDocument(postId);
    if (!existingDoc) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comment = existingDoc.comments?.find(
      (c: any) => c._key === commentKey
    );
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    const currentReactions = comment.reactions || {
      like: 0,
      love: 0,
      pray: 0,
      wow: 0,
    };

    // ✅ Build safe patch
    let patch = client.patch(postId);

    // Decrement previous reaction if it exists and > 0
    if (previousReaction && validReactions.includes(previousReaction)) {
      const prevCount = currentReactions[previousReaction] || 0;
      if (prevCount > 0) {
        patch = patch.inc({
          [`comments[_key=="${commentKey}"].reactions.${previousReaction}`]: -1,
        });
      }
    }

    // Increment new reaction
    patch = patch.inc({
      [`comments[_key=="${commentKey}"].reactions.${type}`]: 1,
    });

    await patch.commit();

    // ✅ Fetch updated doc for fresh state
    const updatedDoc = await client.getDocument(postId);

    return NextResponse.json({
      success: true,
      updated: {
        comments: updatedDoc.comments || [],
      },
    });
  } catch (err) {
    console.error("Comment React API Error:", err);
    return NextResponse.json(
      { error: "Failed to update comment reaction" },
      { status: 500 }
    );
  }
}
