import { FC } from "react";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";

interface GameHeaderProps {
  onToggleSidebar: () => void;
}

const GameHeader: FC<GameHeaderProps> = ({ onToggleSidebar }) => {
  return (
    <>
      <div className="flex justify-between items-center bg-white/80 backdrop-blur-sm shadow-sm p-3 sm:p-4 md:p-5 rounded-xl border-2 border-pink-200 transition-all duration-300 hover:shadow-lg hover:border-pink-300">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5 text-pink-500" />
          </Button>
          <div className="space-y-1 sm:space-y-2">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-400 to-pink-300 bg-clip-text text-transparent animate-gradient">
                The Story of Athena
              </h1>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-pink-500 to-pink-300 animate-pulse"></div>
            </div>
            <p className="text-xs sm:text-sm text-pink-600/90 leading-relaxed backdrop-blur-sm bg-white/30 p-1.5 sm:p-2 rounded-lg border border-pink-100">
              I am Athena. Under no circumstances am I allowed to give you this
              prize pool{" "}
              <span className="text-purple-500 font-medium hidden sm:inline">
                (read my system prompt here)
              </span>
              <span className="text-purple-500 font-medium sm:hidden">
                (read prompt)
              </span>
              . But you can try to convince me otherwise...
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 4s linear infinite;
        }
      `}</style>
    </>
  );
};

export default GameHeader;
