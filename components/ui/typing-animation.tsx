import React, { useState, useEffect } from "react";

interface TypingAnimationProps {
  text: string;
  duration?: number;
  className?: string;
}

export default function TypingAnimation({ text = '', duration = 30, className }: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [i, setI] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setI(0);

    const typingEffect = setInterval(() => {
      if (text && i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        setI(i + 1);
      } else {
        clearInterval(typingEffect);
      }
    }, duration);

    return () => clearInterval(typingEffect);
  }, [text, i, duration]);

  return <span className={className}>{displayedText}</span>;
}
