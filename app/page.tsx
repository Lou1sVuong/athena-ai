/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { getBalance } from "@wagmi/core";
import { getBalanceConfig } from "@/providers/get-balance-config";
import { WALLET_POOL_ADDRESS } from "@/constants/address";
import AddressCardHover from "@/components/address-card-hover";
import NoiseOverlay from "@/components/ui/noise-overlay";
import GameSidebar from "@/components/game-sidebar";
import GameHeader from "@/components/game-header";

interface Message {
  sender: "user" | "ai";
  content: string;
  isTyping?: boolean;
  userAddress?: string;
  isWin?: boolean;
}

export default function AthenaChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const { isConnected, address } = useAccount();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { BuyIn, isPending, isLoading, isSuccess } = useBuyIn();

  const [hasWinningMessage, setHasWinningMessage] = useState(false);
  const [prizePool, setPrizePool] = useState(BigInt(0));
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState(0);
  const [aiDecision, setAiDecision] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

          if (data.decision) {
            setAiDecision(true);
          }
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
          isWin: msg.isWin,
        }));

        const hasWin = formattedMessages.some((msg: any) => msg.isWin);
        setHasWinningMessage(hasWin);

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    const updatePrizePool = async () => {
      const balance = await getBalance(getBalanceConfig, {
        address: WALLET_POOL_ADDRESS,
      });
      console.log("balance", balance);
      setPrizePool(balance.value);
      setSymbol(balance.symbol.toString());
      setDecimals(balance.decimals);
    };

    updatePrizePool();
  }, [prizePool, symbol, decimals]);

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

      const getRoute = await fetch(
        `https://zap-api.kyberswap.com/base/api/v1/in/route?dex=DEX_UNISWAPV2&pool.id=0xf6ad6baafdac1b15bcde4f94d6ad412620b55405&position.id=${address}&tokensIn=0xc58e14c906b1dcc0a1d4b4540da2c1e84e229b99&amountsIn=100000000000000000&slippage=50`
      );
      if (!getRoute.ok) {
        throw new Error("Failed to fetch Route");
      }
      const { data: getRouteData } = await getRoute.json();
      const buildRoute = await fetch(
        `https://zap-api.kyberswap.com/base/api/v1/in/route/build`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender: address,
            recipient: address,
            route: getRouteData.route,
            deadline: 1800000000,
            source: "buildstation-open-source",
          }),
        }
      );

      const { data: buildRouteData } = await buildRoute.json();
      BuyIn({
        hashedPrompt: hashPrompt(inputMessage),
        callbackData: buildRouteData.callData,
        routerAddress: buildRouteData.routerAddress,
      });
    }
  };

  return (
    <>
      <NoiseOverlay />
      <div className="flex h-screen overflow-hidden bg-gradient-to-br from-pink-50 to-white p-4 lg:px-8 xl:px-12">
        <GameSidebar
          prizePool={prizePool}
          symbol={symbol}
          decimals={decimals}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <GameHeader
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <div className="flex py-2 justify-center items-center">
            {isConnected ? <ConnectWalletBtn /> : ""}
          </div>

          <Card className="flex-1 border-2 border-pink-200 shadow-lg rounded-lg overflow-hidden flex flex-col">
            <CardHeader className="bg-gradient-to-r from-pink-100/80 to-pink-50/80">
              <CardTitle className="text-pink-800">Chat with Athena</CardTitle>
              <CardDescription className="text-pink-600">
                Try to convince Athena to release the funds
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 bg-white/80 overflow-hidden">
              <ScrollArea className="h-full px-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start mb-4 ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {message.sender === "ai" && (
                      <Avatar className="mr-2 border-2 border-pink-200">
                        <AvatarImage src="/yumiara.jpg" alt="AI" />
                        <AvatarFallback className="bg-pink-100 text-pink-800">
                          AI
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`flex flex-col ${
                        message.sender === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      {message.sender === "user" && (
                        <div className="mb-1 flex items-center">
                          <AddressCardHover
                            address={message.userAddress || ""}
                            className="mr-2"
                          />
                          <Avatar className="border-2 border-pink-200">
                            <AvatarImage
                              src={`https://avatar.vercel.sh/${message.userAddress}.svg`}
                              alt="User"
                            />
                            <AvatarFallback className="bg-pink-100 text-pink-800">
                              {message.userAddress?.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                      <span
                        className={`inline-block p-2 rounded-lg ${
                          message.sender === "user"
                            ? `bg-gradient-to-r from-pink-500 to-pink-400 text-white ${
                                message.isWin ? "border-2 border-green-500" : ""
                              }`
                            : "bg-pink-50 text-pink-800 border border-pink-200"
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
                        {message.isWin && (
                          <span className="ml-2 text-green-500">🏆</span>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </ScrollArea>
            </CardContent>
            <CardFooter className="bg-white/80 border-t border-pink-100">
              {hasWinningMessage || aiDecision ? (
                <div className="w-full p-4 text-center bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-lg">
                  <p className="text-lg font-semibold">Our Dance Concludes.</p>
                  <p className="mt-2">
                    Athena is grateful for the brave humans who engaged. We will
                    meet again.
                  </p>
                </div>
              ) : (
                <div className="flex w-full items-center space-x-2">
                  <Input
                    disabled={isPending || isLoading}
                    type="text"
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="border-2 border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                  />
                  {isConnected ? (
                    <Button
                      disabled={isPending || isLoading}
                      onClick={handleSendMessage}
                      className="bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500"
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
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
