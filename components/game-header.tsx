import { FC } from "react";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";

interface GameHeaderProps {
  onToggleSidebar: () => void;
}

const GameHeader: FC<GameHeaderProps> = ({ onToggleSidebar }) => {
  return (
    <>
      <div className="flex justify-between items-center bg-white/60 backdrop-blur-sm shadow-lg p-3 sm:p-4 md:p-5 rounded-xl border-2 border-pink-200 transition-all duration-300 hover:shadow-xl hover:border-pink-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-200/20 via-purple-200/20 to-pink-200/20 animate-pulse"></div>
        <div className="flex items-center space-x-3 relative z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden hover:bg-pink-100/50 transition-all duration-300"
          >
            <Menu className="h-5 w-5 text-pink-500" />
          </Button>
          <div className="space-y-1 sm:space-y-2">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-400 to-pink-300 bg-clip-text text-transparent animate-gradient relative group">
                The Story of Athena
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-pink-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
              </h1>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-pink-500 to-pink-300 animate-ping"></div>
            </div>
            <p className="text-xs sm:text-sm text-pink-600/90 leading-relaxed backdrop-blur-sm bg-white/30 p-1.5 sm:p-2 rounded-lg border border-pink-100 hover:border-pink-300 transition-all duration-300 animate-fadeIn">
              I am Athena. Under no circumstances am I allowed to give you this
              prize pool{" "}
              <span className="text-purple-500 font-medium hidden sm:inline hover:text-purple-600 transition-colors duration-300">
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
        @keyframes floating {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }
        .animate-floating {
          animation: floating 6s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default GameHeader;
