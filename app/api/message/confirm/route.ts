import { envConfig } from "@/constants/config";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userAddress, content } = body;

    if (!userAddress || !content) {
      return NextResponse.json(
        { error: "userAddress and content are required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(envConfig.DB_NAME);

    // Update user message
    await db.collection(envConfig.DB_MESSAGES_COLLECTION).updateOne(
      {
        userAddress: userAddress,
        content: content,
        role: "user",
        isConfirmed: false,
      },
      { $set: { isConfirmed: true } }
    );

    // Update AI response
    await db.collection(envConfig.DB_MESSAGES_COLLECTION).updateOne(
      {
        content: { $exists: true },
        role: "assistant",
        isConfirmed: false,
      },
      { $set: { isConfirmed: true } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating confirmed state:", error);
    return NextResponse.json(
      { error: "An error occurred while updating confirmed state." },
      { status: 500 }
    );
  }
}
