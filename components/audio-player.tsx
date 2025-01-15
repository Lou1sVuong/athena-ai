"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/bgm.mp3");
    audioRef.current.loop = true;

    const savedState = localStorage.getItem("bgm-playing");
    const shouldPlay = savedState === null ? true : savedState === "true";
    setIsPlaying(shouldPlay);

    if (shouldPlay && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.log("Autoplay prevented:", error);
        setIsPlaying(false);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("bgm-playing", isPlaying.toString());
  }, [isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Button
      onClick={togglePlay}
      variant="ghost"
      size="icon"
      className="ml-2 bg-pink-100 hover:bg-pink-200 text-pink-800 rounded-lg"
    >
      {isPlaying ? (
        <Volume2 className="h-5 w-5" />
      ) : (
        <VolumeX className="h-5 w-5" />
      )}
    </Button>
  );
}
