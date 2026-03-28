import React from "react";
import { AbsoluteFill, useCurrentFrame, random } from "remotion";

const PARTICLE_COUNT = 30;
const ACCENT = "rgba(34, 197, 94,";

export const GridBackground: React.FC = () => {
  const frame = useCurrentFrame();

  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const x = random(`x-${i}`) * 1080;
    const startY = random(`y-${i}`) * 1920;
    const speed = random(`speed-${i}`) * 0.5 + 0.2;
    const size = random(`size-${i}`) * 3 + 1;
    const baseOpacity = random(`opacity-${i}`) * 0.3 + 0.05;

    let y = (startY - frame * speed) % 1920;
    if (y < 0) y += 1920;

    const pulse = Math.sin((frame + i * 10) * 0.08) * 0.5 + 0.5;
    const opacity = baseOpacity * (0.5 + pulse * 0.5);

    return { x, y, size, opacity };
  });

  return (
    <AbsoluteFill>
      {/* Grid lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${ACCENT} 0.04) 1px, transparent 1px),
            linear-gradient(90deg, ${ACCENT} 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating particles */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {particles.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.size}
            fill="#22c55e"
            opacity={p.opacity}
          />
        ))}
      </svg>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
