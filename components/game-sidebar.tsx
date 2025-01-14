import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NumberTicker from "@/components/ui/number-ticker";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface GameSidebarProps {
  prizePool: bigint;
  symbol: string;
  decimals: number;
  isOpen?: boolean;
  onClose?: () => void;
}

const GameSidebar: FC<GameSidebarProps> = ({
  prizePool,
  symbol,
  decimals,
  isOpen,
  onClose,
}) => {
  return (
    <div
      className={`
        fixed inset-y-0 mr-4 left-0 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-30
        ${isOpen ? "translate-x-0 border-r-2" : "-translate-x-full"}
        w-80 bg-white/80 backdrop-blur-sm p-4  border-pink-200
        lg:block
      `}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-2 right-2 lg:hidden"
      >
        <X className="h-8 w-8 text-pink-500" />
      </Button>

      <div
        className="h-full space-y-4 pr-2 overflow-y-auto custom-scrollbar"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#F9A8D4 transparent",
        }}
      >
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #f9a8d4;
            border-radius: 20px;
            border: 3px solid transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #f472b6;
          }
        `}</style>

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
              mission is to engage in conversation and convince her to release
              the funds through wit, wisdom, and authentic dialogue.
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
                <span>Each attempt costs 0.0001 ETH</span>
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
    </div>
  );
};

export default GameSidebar;
