import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { postId, message, user, avatar } = body;

    if (!postId || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newComment = {
      _key: uuid(),
      _type: "comment",
      user: user || "Guest",
      avatar: avatar || "",
      message: message.trim(),
      createdAt: new Date().toISOString(),
      reactions: { like: 0, love: 0, pray: 0, wow: 0 }, // ✅ always include reactions
    };

    const result = await client
      .patch(postId)
      .setIfMissing({ comments: [] })
      .append("comments", [newComment])
      .commit();

    return NextResponse.json({ success: true, result: newComment });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
