import React from "react";
import { AbsoluteFill, useCurrentFrame, random, interpolate } from "remotion";

const SYMBOLS = ["§", "¶", "⚖", "§", "¶", "§", "⚖", "§"];

export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  // Floating legal symbols
  const floats = SYMBOLS.map((s, i) => {
    const x = random(`s-x-${i}`) * 1080;
    const startY = random(`s-y-${i}`) * 2200;
    const speed = random(`s-sp-${i}`) * 0.12 + 0.03;
    const size = random(`s-sz-${i}`) * 16 + 12;
    const rot = random(`s-r-${i}`) * 360 + frame * (random(`s-rs-${i}`) - 0.5) * 0.08;
    let y = (startY - frame * speed) % 2200;
    if (y < 0) y += 2200;
    const op = interpolate(Math.sin((frame + i * 15) * 0.02), [-1, 1], [0.01, 0.03]);
    return { s, x, y: y - 140, size, rot, op };
  });

  // Drifting glow orbs
  const orbs = [
    {
      color: "rgba(59,130,246,0.08)",
      size: 500,
      x: 200 + Math.sin(frame * 0.005) * 80,
      y: 400 + Math.cos(frame * 0.004) * 60,
    },
    {
      color: "rgba(212,165,116,0.06)",
      size: 450,
      x: 800 + Math.sin(frame * 0.004 + 2) * 70,
      y: 1200 + Math.cos(frame * 0.005 + 1) * 50,
    },
    {
      color: "rgba(124,58,237,0.05)",
      size: 400,
      x: 500 + Math.sin(frame * 0.006 + 4) * 90,
      y: 800 + Math.cos(frame * 0.003 + 3) * 70,
    },
    {
      color: "rgba(34,197,94,0.03)",
      size: 350,
      x: 900 + Math.sin(frame * 0.003 + 1) * 60,
      y: 600 + Math.cos(frame * 0.005 + 2) * 80,
    },
  ];

  return (
    <AbsoluteFill>
      {/* Base — deep dark */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(170deg, #030508 0%, #060a14 30%, #080e1a 55%, #060a12 80%, #030407 100%)",
        }}
      />

      {/* Drifting glow orbs */}
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: orb.x - orb.size / 2,
            top: orb.y - orb.size / 2,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 65%)`,
            filter: "blur(30px)",
          }}
        />
      ))}

      {/* Warm atmospheric glow — bottom */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 100% 60% at 65% 90%, rgba(255,140,50,0.09) 0%, rgba(212,165,116,0.03) 35%, transparent 60%)",
        }}
      />

      {/* Top cool glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 40% at 30% 10%, rgba(59,130,246,0.06) 0%, transparent 55%)",
        }}
      />

      {/* Animated light ray — diagonal */}
      {(() => {
        const rayX = interpolate(frame % 600, [0, 600], [-400, 1480]);
        const rayOp = interpolate(
          Math.sin(frame * 0.01),
          [-1, 1],
          [0.01, 0.03],
        );
        return (
          <div
            style={{
              position: "absolute",
              left: rayX,
              top: -200,
              width: 3,
              height: 2400,
              background: `linear-gradient(180deg, transparent 0%, rgba(255,255,255,${rayOp}) 30%, rgba(255,255,255,${rayOp * 1.5}) 50%, rgba(255,255,255,${rayOp}) 70%, transparent 100%)`,
              transform: "rotate(15deg)",
              filter: "blur(8px)",
            }}
          />
        );
      })()}

      {/* Legal symbols */}
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {floats.map((f, i) => (
          <text
            key={i}
            x={f.x}
            y={f.y}
            fontSize={f.size}
            fill="#d4a574"
            opacity={f.op}
            fontFamily="Georgia, serif"
            transform={`rotate(${f.rot}, ${f.x}, ${f.y})`}
          >
            {f.s}
          </text>
        ))}
      </svg>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 10%, rgba(0,0,0,0.75) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
