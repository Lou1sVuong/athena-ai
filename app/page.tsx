"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2, Send } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TypingAnimation from "@/components/ui/typing-animation";
import ConnectWalletBtn from "@/components/connect-wallet-btn";
import { useAccount } from "wagmi";
import { useBuyIn } from "@/lib/buy-in";
import { hashPrompt } from "@/lib/hash-prompt";
// import AddressCardHover from "@/components/address-card-hover";

interface Message {
  sender: "user" | "ai";
  content: string;
  isTyping?: boolean;
  userAddress?: string;
}

export default function AthenaChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const { isConnected, address } = useAccount();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { BuyIn, isPending, isLoading, isSuccess } = useBuyIn();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const callApiOnSuccess = async () => {
      if (isSuccess) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL}/api/message`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                messages: [
                  {
                    role: "user",
                    content: inputMessage,
                  },
                ],
                maxTokens: 200,
                userAddress: address,
              }),
            }
          );

          setInputMessage("");

          if (!response.ok) {
            throw new Error("API call failed");
          }

          const data = await response.json();

          setMessages((prev) => [
            ...prev.slice(0, -1),
            { sender: "ai", content: data.explanation, isTyping: false },
          ]);
        } catch (error) {
          console.error("Error:", error);
          setMessages((prev) => [
            ...prev,
            {
              sender: "ai",
              content: "Sorry, an error occurred.",
              isTyping: false,
            },
          ]);
        }
      }
    };

    callApiOnSuccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/message`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedMessages = data.messages.map((msg: any) => ({
          sender: msg.role === "user" ? "user" : "ai",
          content: msg.content,
          userAddress: msg.userAddress,
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    if (isConnected && inputMessage.trim()) {
      const newUserMessage: Message = {
        sender: "user",
        content: inputMessage,
        userAddress: address,
      };

      setInputMessage(inputMessage);

      setMessages((prev) => [...prev, newUserMessage]);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", content: "", isTyping: true },
      ]);
      BuyIn(hashPrompt(inputMessage));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 px-4 lg:px-32 xl:px-40">
      <main className="flex-1 flex flex-col">
        <header className="flex justify-between bg-white shadow-sm p-4">
          <h1 className="text-2xl font-bold">The Story of Athena</h1>
          {isConnected ? <ConnectWalletBtn /> : ""}
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
                  className={`flex items-start mb-4 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "ai" && (
                    <Avatar className="mr-2">
                      <AvatarImage src="/ai-avatar.png" alt="AI" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`flex flex-col ${
                      message.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <span
                      className={`inline-block p-2 rounded-lg ${
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
                  {message.sender === "user" && (
                    <div className=" flex flex-col">
                      {/* <AddressCardHover
                        address={message.userAddress as string}
                      /> */}
                      <Avatar className="ml-2">
                        <AvatarImage
                          src={`https://robohash.org/${message.userAddress}`}
                          alt="User"
                        />
                        <AvatarFallback>
                          {message.userAddress?.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-center space-x-2">
              <Input
                disabled={isPending || isLoading}
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              {isConnected ? (
                <Button
                  disabled={isPending || isLoading}
                  onClick={handleSendMessage}
                >
                  {isPending || isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              ) : (
                <ConnectWalletBtn />
              )}
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
