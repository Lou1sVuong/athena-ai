import { envConfig } from "@/constants/config";
import clientPromise from "@/lib/mongodb";
import { sendMessage } from "@/services/llm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, maxTokens, userAddress, txHash } = body;

    if (!messages || !maxTokens) {
      return NextResponse.json(
        { error: "messages and maxTokens are required." },
        { status: 400 }
      );
    }

    const response = await sendMessage({ messages, maxTokens });

    const client = await clientPromise;
    const db = client.db(envConfig.DB_NAME);

    const userMessage = {
      content: messages[messages.length - 1].content,
      role: "user",
      timestamp: new Date(),
      userAddress: userAddress,
      isWin: response.decision === true,
      isConfirmed: false,
      txHash: txHash,
    };
    await db
      .collection(envConfig.DB_MESSAGES_COLLECTION)
      .insertOne(userMessage);

    const aiMessage = {
      content: response.explanation,
      role: "assistant",
      timestamp: new Date(),
      isConfirmed: false,
      txHash: txHash,
    };
    await db.collection(envConfig.DB_MESSAGES_COLLECTION).insertOne(aiMessage);

    console.log("res", response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { error: "An error occurred while saving the message." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(envConfig.DB_NAME);

    const messages = await db
      .collection(envConfig.DB_MESSAGES_COLLECTION)
      .find({ isConfirmed: true })
      .toArray();

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching messages." },
      { status: 500 }
    );
  }
}
