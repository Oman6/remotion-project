import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

interface AnimatedTextProps {
  text: string;
  fontSize?: number;
  color?: string;
  highlightWords?: string[];
  highlightColor?: string;
  delay?: number;
  staggerFrames?: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  fontSize = 64,
  color = "#ffffff",
  highlightWords = [],
  highlightColor = "#22c55e",
  delay = 0,
  staggerFrames = 5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: `${fontSize * 0.25}px`,
        padding: "0 60px",
      }}
    >
      {words.map((word, i) => {
        const wordFrame = frame - delay - i * staggerFrames;
        const progress = spring({
          frame: wordFrame,
          fps,
          config: { damping: 15, mass: 0.8 },
        });

        const cleanWord = word.replace(/[.,!?]/g, "");
        const isHighlight = highlightWords.includes(cleanWord);
        const wordColor = isHighlight ? highlightColor : color;

        return (
          <span
            key={i}
            style={{
              fontSize,
              fontWeight: 700,
              color: wordColor,
              opacity: Math.min(1, progress),
              transform: `translateY(${(1 - progress) * 40}px)`,
              display: "inline-block",
              fontFamily: "Sora, sans-serif",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
