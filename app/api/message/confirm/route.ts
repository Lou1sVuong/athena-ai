import { envConfig } from "@/constants/config";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { txHash } = body;

    if (!txHash) {
      return NextResponse.json(
        { error: "txHash is required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(envConfig.DB_NAME);

    // Update all messages with matching txHash
    await db.collection(envConfig.DB_MESSAGES_COLLECTION).updateMany(
      {
        txHash: txHash,
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
