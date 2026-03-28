import React from "react";
import {
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

interface StatCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  delay?: number;
  decimals?: number;
}

export const StatCounter: React.FC<StatCounterProps> = ({
  value,
  suffix = "",
  prefix = "",
  label,
  delay = 0,
  decimals = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, mass: 0.8 },
  });

  const currentValue = interpolate(progress, [0, 1], [0, value]);

  const scale = interpolate(progress, [0, 0.7, 1], [0.8, 1.06, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Pulse glow that peaks as counter completes
  const glowOpacity = interpolate(progress, [0.6, 0.85, 1], [0, 0.25, 0.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Expanding ring pulse
  const ringScale = interpolate(progress, [0.7, 1], [0.9, 1.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringOpacity = interpolate(progress, [0.7, 0.85, 1], [0, 0.15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity: Math.min(1, progress * 2),
        transform: `scale(${scale})`,
        textAlign: "center",
        position: "relative",
        padding: "24px 50px",
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          inset: -30,
          borderRadius: 30,
          background: `radial-gradient(ellipse, rgba(34, 197, 94, ${glowOpacity}) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Expanding ring */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 20,
          border: `2px solid rgba(34, 197, 94, ${ringOpacity})`,
          transform: `scale(${ringScale})`,
          pointerEvents: "none",
        }}
      />

      {/* Value */}
      <div
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: "#22c55e",
          fontFamily: "Sora, sans-serif",
          position: "relative",
        }}
      >
        {prefix}
        {currentValue.toFixed(decimals)}
        {suffix}
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: 26,
          color: "#888888",
          fontFamily: "Sora, sans-serif",
          marginTop: 6,
          fontWeight: 500,
          position: "relative",
        }}
      >
        {label}
      </div>
    </div>
  );
};
