import React from "react";
import { useCurrentFrame } from "remotion";

export const Background2: React.FC = () => {
  const frame = useCurrentFrame();

  // Slow drifting orbs
  const orbs = [
    { x: 200, y: 400, size: 500, color: "rgba(239,68,68,0.06)", speed: 0.003, phase: 0 },
    { x: 800, y: 1200, size: 600, color: "rgba(59,130,246,0.05)", speed: 0.004, phase: 1.5 },
    { x: 500, y: 900, size: 450, color: "rgba(212,165,116,0.04)", speed: 0.005, phase: 3 },
    { x: 300, y: 1600, size: 400, color: "rgba(124,58,237,0.04)", speed: 0.003, phase: 4.5 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(165deg, #020408 0%, #060a14 30%, #0a0e1e 60%, #050810 100%)",
        overflow: "hidden",
      }}
    >
      {/* Drifting glow orbs */}
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: orb.x + Math.sin(frame * orb.speed + orb.phase) * 60,
            top: orb.y + Math.cos(frame * orb.speed + orb.phase + 1) * 40,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 65%)`,
            filter: "blur(40px)",
          }}
        />
      ))}

      {/* Urgent red pulse in first 2 seconds */}
      {frame < 70 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at center, rgba(239,68,68,${
              0.04 * Math.sin(frame * 0.15) + 0.04
            }) 0%, transparent 60%)`,
          }}
        />
      )}

      {/* Warm shift after solution reveal */}
      {frame >= 120 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 60% 50%, rgba(59,130,246,${
              Math.min(1, (frame - 120) / 30) * 0.06
            }) 0%, transparent 55%)`,
          }}
        />
      )}

      {/* Subtle scan line texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.008) 0px, rgba(255,255,255,0.008) 1px, transparent 1px, transparent 4px)",
          pointerEvents: "none",
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </div>
  );
};
