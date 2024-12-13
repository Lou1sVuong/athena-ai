import clientPromise from "@/lib/mongodb";
import { sendMessage } from "@/services/llm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, maxTokens, userAddress } = body;

    console.log(body);

    // Kiểm tra các trường bắt buộc
    if (!messages || !maxTokens) {
      return NextResponse.json(
        { error: "messages and maxTokens are required." },
        { status: 400 }
      );
    }

    const response = await sendMessage({ messages, maxTokens });

    // Kết nối đến MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Lưu tin nhắn của người dùng
    const userMessage = {
      content: messages[messages.length - 1].content,
      role: "user",
      timestamp: new Date(),
      userAddress: userAddress,
    };
    await db.collection("messages").insertOne(userMessage);

    // Lưu câu trả lời của AI
    const aiMessage = {
      content: response.explanation,
      role: "assistant",
      timestamp: new Date(),
    };
    await db.collection("messages").insertOne(aiMessage);

    // Trả về phản hồi thành công
    return NextResponse.json(response);
  } catch (error) {
    // Xử lý lỗi và trả về phản hồi lỗi
    console.error("Error saving message:", error);
    return NextResponse.json(
      { error: "An error occurred while saving the message." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Kết nối đến MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    // Lấy tất cả tin nhắn từ collection "messages"
    const messages = await db.collection("messages").find({}).toArray();

    // Trả về phản hồi thành công với danh sách tin nhắn
    return NextResponse.json({ messages });
  } catch (error) {
    // Xử lý lỗi và trả về phản hồi lỗi
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching messages." },
      { status: 500 }
    );
  }
}
