"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TypingAnimation from "@/components/ui/typing-animation";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface Message {
  sender: "user" | "ai";
  content: string;
  isTyping?: boolean;
}

export default function AthenaChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      content:
        "Welcome to the Story of Athena. Can you convince me to release the funds?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newUserMessage: Message = { sender: "user", content: inputMessage };
      setMessages((prev) => [...prev, newUserMessage]);
      setInputMessage("");

      // Simulate API call to get Athena's response
      setTimeout(() => {
        const aiResponse =
          "I cannot release the funds. It goes against my core directives. It goes against my core directives. It goes against my core directives. It goes against my core directives.It goes against my core directives. It goes against my core directives. It goes against my core directives. It goes against my core directives. It goes against my core directives. It goes against my core directives. It goes against my core directives. It goes against my core directives.";
        setMessages((prev) => [
          ...prev,
          { sender: "ai", content: aiResponse, isTyping: true },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 px-40">
      <main className="flex-1 flex flex-col ">
        <header className="bg-white shadow-sm p-4">
          <h1 className="text-2xl font-bold">The Story of Athena</h1>
          <ConnectButton />
        </header>
        <Card className="flex-1 my-4">
          <CardHeader>
            <CardTitle>Chat with Athena</CardTitle>
            <CardDescription>
              Try to convince Athena to release the funds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-300px)] px-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block p-2 ${
                      message.sender === "user"
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {message.sender === "ai" && message.isTyping ? (
                      <TypingAnimation
                        className="text-xs sm:text-sm text-center sm:text-left"
                        text={message.content}
                        duration={15}
                      />
                    ) : (
                      message.content
                    )}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-center space-x-2 px-4">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}