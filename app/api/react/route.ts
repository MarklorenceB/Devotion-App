import { writeClient } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { postId, type, previousReaction } = await req.json();

    if (!postId || !type) {
      return NextResponse.json(
        { error: "Missing postId or reaction type" },
        { status: 400 }
      );
    }

    // Build mutation
    const patch = writeClient
      .patch(postId)
      .setIfMissing({
        reactions: { like: 0, love: 0, pray: 0, wow: 0 },
      })
      .inc({ [`reactions.${type}`]: 1 });

    // If user is switching reactions, decrement the old one
    if (previousReaction && previousReaction !== type) {
      patch.dec({ [`reactions.${previousReaction}`]: 1 });
    }

    const result = await patch.commit({ autoGenerateArrayKeys: true });

    return NextResponse.json({
      success: true,
      message: "Reaction updated",
      counts: result.reactions,
    });
  } catch (err: any) {
    console.error("Reaction API Error:", err.message);
    return NextResponse.json(
      { error: "Failed to update reaction" },
      { status: 500 }
    );
  }
}
