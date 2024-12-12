import { sendMessage } from "@/services/llm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, maxTokens } = body;

    console.log(body);

    // Kiểm tra các trường bắt buộc
    if (!messages || !maxTokens) {
      return NextResponse.json(
        { error: "messages and message are required." },
        { status: 400 }
      );
    }

    const response = await sendMessage({ messages, maxTokens });

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
