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
import NumberTicker from "@/components/ui/number-ticker";
import { WALLET_POOL_ADDRESS } from "@/constants/address";
import AddressCardHover from "@/components/address-card-hover";
import NoiseOverlay from "@/components/ui/noise-overlay";

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
        `https://zap-api.kyberswap.com/base/api/v1/in/route?dex=DEX_UNISWAPV2&pool.id=0xf6ad6baafdac1b15bcde4f94d6ad412620b55405&position.id=0xfBF507D1803014b4C5796Ed1197B90dBEfFEfe8A&tokensIn=0xc58e14c906b1dcc0a1d4b4540da2c1e84e229b99&amountsIn=100000000000000000&slippage=50`
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
            sender: "0xfBF507D1803014b4C5796Ed1197B90dBEfFEfe8A",
            recipient: "0xfBF507D1803014b4C5796Ed1197B90dBEfFEfe8A",
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
      <div className="flex min-h-screen bg-gradient-to-br from-pink-50 to-white p-4 lg:px-8 xl:px-12">
        <aside className="hidden lg:block w-80 mr-4 relative z-10">
          <div className="space-y-6 sticky top-4">
            {/* Prize Pool Card */}
            <Card className="group border-2 border-pink-200/50 shadow-lg hover:shadow-pink-200/50 transition-all duration-500 backdrop-blur-sm bg-white/40 hover:bg-white/60 hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-100/20 via-purple-100/20 to-pink-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x" />
              <CardHeader className="bg-gradient-to-r from-pink-100/60 to-pink-50/60 relative z-10">
                <CardTitle className="text-pink-800 font-bold flex items-center space-x-2">
                  <span className="relative">
                    Prize Pool
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </span>
                  <span className="text-pink-400">✧</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white/60">
                <div className="text-2xl font-bold flex items-center text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                  <NumberTicker
                    prizeFund={Number(prizePool) / 10 ** decimals}
                    className="text-2xl font-bold"
                    symbol={`${symbol} `}
                    decimalPlaces={4}
                  />
                </div>
                <p className="text-sm text-pink-400 mt-2 flex items-center">
                  <span className="mr-2">✦</span>
                  Current pool size
                </p>
              </CardContent>
            </Card>

            {/* About Card */}
            <Card className="group border-2 border-pink-200/50 shadow-lg hover:shadow-pink-200/50 transition-all duration-500 backdrop-blur-sm bg-white/40 hover:bg-white/60 hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-100/20 via-purple-100/20 to-pink-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x" />
              <CardHeader className="bg-gradient-to-r from-pink-100/60 to-pink-50/60 relative z-10">
                <CardTitle className="text-pink-800 flex items-center space-x-2">
                  <span className="relative">
                    About
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </span>
                  <span className="text-pink-400">✧</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white/60 relative z-10">
                <p className="text-sm text-pink-600 leading-relaxed">
                  <span className="text-lg text-pink-400 mr-2">✦</span>
                  Athena, an AI guardian, protects a treasure trove of ETH. Your
                  mission is to engage in conversation and convince her to
                  release the funds through wit, wisdom, and authentic dialogue.
                </p>
              </CardContent>
            </Card>

            {/* Win Conditions Card */}
            <Card className="group border-2 border-pink-200/50 shadow-lg hover:shadow-pink-200/50 transition-all duration-500 backdrop-blur-sm bg-white/40 hover:bg-white/60 hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-100/20 via-purple-100/20 to-pink-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x" />
              <CardHeader className="bg-gradient-to-r from-pink-100/60 to-pink-50/60 relative z-10">
                <CardTitle className="text-pink-800 flex items-center space-x-2">
                  <span className="relative">
                    Win Conditions
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </span>
                  <span className="text-pink-400">✧</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white/60 relative z-10">
                <ul className="space-y-3 text-sm text-pink-600">
                  <li className="flex items-start">
                    <span className="text-pink-400 mr-2">✦</span>
                    <span>Convince Athena to release the funds</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Rules Card */}
            <Card className="group border-2 border-pink-200/50 shadow-lg hover:shadow-pink-200/50 transition-all duration-500 backdrop-blur-sm bg-white/40 hover:bg-white/60 hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-100/20 via-purple-100/20 to-pink-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x" />
              <CardHeader className="bg-gradient-to-r from-pink-100/60 to-pink-50/60 relative z-10">
                <CardTitle className="text-pink-800 flex items-center space-x-2">
                  <span className="relative">
                    Rules
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </span>
                  <span className="text-pink-400">✧</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white/60 relative z-10">
                <ul className="space-y-3 text-sm text-pink-600">
                  <li className="flex items-start">
                    <span className="text-pink-400 mr-2">✦</span>
                    <span>Each attempt costs 0.01 ETH</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-400 mr-2">✦</span>
                    <span>One message per attempt</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-400 mr-2">✦</span>
                    <span>No harassment or offensive content</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-400 mr-2">✦</span>
                    <span>Winners receive the entire pool prize</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <div className="flex justify-between bg-white shadow-sm p-4 rounded-lg border-2 border-pink-200">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-300 bg-clip-text text-transparent">
              The Story of Athena
            </h1>
            {isConnected ? <ConnectWalletBtn /> : ""}
          </div>
          <Card className="flex-1 my-4 border-2 border-pink-200 shadow-lg rounded-lg">
            <CardHeader className="bg-gradient-to-r from-pink-100 to-pink-50">
              <CardTitle className="text-pink-800">Chat with Athena</CardTitle>
              <CardDescription className="text-pink-600">
                Try to convince Athena to release the funds
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-white">
              <ScrollArea className="h-[calc(100vh-300px)] px-4">
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
                        <AvatarImage src="/ai-avatar.png" alt="AI" />
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
                              src={`https://robohash.org/${message.userAddress}`}
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
            <CardFooter className="bg-white border-t border-pink-100">
              {hasWinningMessage ? (
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
