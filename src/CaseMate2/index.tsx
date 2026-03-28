import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { loadFont as loadSerif } from "@remotion/google-fonts/DMSerifDisplay";
import { Background2 } from "./Background";

const { fontFamily: sans } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});
const { fontFamily: serif } = loadSerif("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

const SNAP = { damping: 28, stiffness: 220 };
const POP = { damping: 14, stiffness: 180 };
const BOUNCY = { damping: 10, stiffness: 150 };

const C = {
  white: "#f1f5f9",
  warm: "#fdfcfc",
  offWhite: "#cbd5e1",
  slate: "#64748b",
  blue: "#3b82f6",
  blueLight: "#93c5fd",
  gold: "#d4a574",
  goldLight: "#e8c9a0",
  green: "#22c55e",
  greenLight: "#86efac",
  red: "#ef4444",
  redLight: "#fca5a5",
  purple: "#7c3aed",
};

const bloom = (color: string, intensity = 1) =>
  `0 0 ${15 * intensity}px ${color}, 0 0 ${40 * intensity}px ${color}, 0 0 ${80 * intensity}px ${color}40`;

const textGlow = (color: string) =>
  `0 0 10px ${color}, 0 0 30px ${color}80, 0 0 60px ${color}40, 0 2px 8px rgba(0,0,0,0.6)`;

const glowCard = (
  color: string,
  glowAmount: number,
  bg = 0.04,
): React.CSSProperties => ({
  backgroundColor: `rgba(255,255,255,${bg})`,
  border: `1px solid ${color}30`,
  borderRadius: 22,
  boxShadow: `
    inset 0 1px 0 rgba(255,255,255,0.06),
    0 0 ${20 * glowAmount}px ${color}15,
    0 0 ${50 * glowAmount}px ${color}08,
    0 12px 40px rgba(0,0,0,0.35)`,
});

// ════════════════════════════════════════════
// SCENE 1 — HOOK: "You just got served." (0–2s)
// ════════════════════════════════════════════
const ServedScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [48, 59], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Envelope slams in instantly
  const envIn = spring({ frame, fps, config: { damping: 22, stiffness: 300 } });
  const envY = interpolate(envIn, [0, 1], [-300, 0]);
  const envRot = interpolate(envIn, [0, 1], [-10, 2]);

  // Text slams in right after — only 4 frame delay
  const textIn = spring({ frame: frame - 4, fps, config: { damping: 24, stiffness: 280 } });
  const textScale = interpolate(textIn, [0, 0.5, 1], [1.6, 0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Screen shake on impact — starts at frame 2
  const shakeX = frame > 2 && frame < 14 ? Math.sin(frame * 2.5) * Math.exp(-(frame - 2) * 0.2) * 8 : 0;
  const shakeY = frame > 2 && frame < 14 ? Math.cos(frame * 3) * Math.exp(-(frame - 2) * 0.2) * 5 : 0;

  // Red flash — immediate
  const flash = interpolate(frame, [0, 8], [0.2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity: fadeOut,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* Red flash overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: `rgba(239,68,68,${flash})`,
          pointerEvents: "none",
        }}
      />

      {/* Envelope icon */}
      <div
        style={{
          position: "absolute",
          top: 500,
          left: 0,
          right: 0,
          textAlign: "center",
          transform: `translateY(${envY}px) rotate(${envRot}deg)`,
          opacity: Math.min(1, envIn),
        }}
      >
        <div
          style={{
            display: "inline-block",
            width: 200,
            height: 140,
            borderRadius: 16,
            background: "linear-gradient(145deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.05) 100%)",
            border: "2px solid rgba(239,68,68,0.25)",
            position: "relative",
            boxShadow: `0 0 40px rgba(239,68,68,0.1), 0 20px 60px rgba(0,0,0,0.4)`,
          }}
        >
          {/* Envelope flap */}
          <div
            style={{
              position: "absolute",
              top: -1,
              left: -1,
              right: -1,
              height: 70,
              borderRadius: "16px 16px 0 0",
              background: "linear-gradient(180deg, rgba(239,68,68,0.2) 0%, rgba(239,68,68,0.08) 100%)",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            }}
          />
          {/* Legal document peek */}
          <div
            style={{
              position: "absolute",
              top: 30,
              left: 30,
              right: 30,
              height: 60,
              borderRadius: 4,
              backgroundColor: "rgba(255,255,255,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              padding: "8px 12px",
            }}
          >
            <div style={{ width: "80%", height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.12)" }} />
            <div style={{ width: "60%", height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.08)" }} />
            <div style={{ width: "70%", height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.06)" }} />
          </div>
        </div>
      </div>

      {/* "You just got served." */}
      <div
        style={{
          position: "absolute",
          top: 720,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: Math.min(1, textIn),
          transform: `scale(${textScale})`,
        }}
      >
        <div
          style={{
            fontSize: 68,
            fontFamily: serif,
            color: C.warm,
            textShadow: textGlow("rgba(239,68,68,0.15)"),
            lineHeight: 1.1,
          }}
        >
          You just got
        </div>
        <div
          style={{
            fontSize: 80,
            fontFamily: serif,
            color: C.red,
            textShadow: textGlow("rgba(239,68,68,0.3)"),
            marginTop: 8,
            letterSpacing: 2,
          }}
        >
          served.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 2 — PANIC MESSAGES (2–4s)
// ════════════════════════════════════════════
const PanicScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [48, 59], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const messages = [
    { text: "Is this real??", delay: 0, x: 80, y: 340, rot: -3 },
    { text: "I can't afford a lawyer", delay: 6, x: 500, y: 480, rot: 4 },
    { text: "What do I do?!", delay: 10, x: 120, y: 620, rot: -2 },
    { text: "This isn't fair", delay: 14, x: 480, y: 760, rot: 3 },
    { text: "I need help NOW", delay: 18, x: 160, y: 900, rot: -4 },
    { text: "😰", delay: 8, x: 700, y: 360, rot: 6 },
    { text: "💸", delay: 16, x: 750, y: 680, rot: -5 },
  ];

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Stress pulse background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, rgba(239,68,68,${
            0.03 * Math.sin(frame * 0.2) + 0.03
          }) 0%, transparent 50%)`,
        }}
      />

      {/* Header */}
      {(() => {
        const hIn = spring({ frame, fps, config: SNAP });
        return (
          <div
            style={{
              position: "absolute",
              top: 180,
              left: 0,
              right: 0,
              textAlign: "center",
              opacity: Math.min(1, hIn),
              transform: `translateY(${(1 - hIn) * 15}px)`,
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontFamily: sans,
                fontWeight: 700,
                color: C.red,
                letterSpacing: 4,
                textTransform: "uppercase" as const,
                textShadow: "0 0 20px rgba(239,68,68,0.2)",
              }}
            >
              Your first thoughts
            </div>
          </div>
        );
      })()}

      {/* Panic message bubbles */}
      {messages.map((msg, i) => {
        const msgIn = spring({ frame: frame - msg.delay, fps, config: BOUNCY });
        const isEmoji = msg.text.length <= 2;
        const float = Math.sin((frame + i * 20) * 0.04) * 4;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: msg.x,
              top: msg.y + float,
              opacity: Math.min(1, msgIn),
              transform: `scale(${msgIn}) rotate(${msg.rot * msgIn}deg)`,
            }}
          >
            <div
              style={{
                ...glowCard(C.red, msgIn * 0.5, 0.06),
                padding: isEmoji ? "14px 18px" : "16px 28px",
                borderRadius: isEmoji ? 50 : 18,
                fontSize: isEmoji ? 40 : 26,
                fontFamily: sans,
                fontWeight: 600,
                color: C.redLight,
                whiteSpace: "nowrap" as const,
                textShadow: "0 0 10px rgba(239,68,68,0.1)",
              }}
            >
              {msg.text}
            </div>
          </div>
        );
      })}

      {/* Typing dots at bottom */}
      {frame > 22 && (
        <div
          style={{
            position: "absolute",
            bottom: 500,
            left: 0,
            right: 0,
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {[0, 1, 2].map((d) => (
            <div
              key={d}
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: C.red,
                opacity: Math.sin(frame * 0.4 + d * 1.2) * 0.3 + 0.5,
                boxShadow: `0 0 10px ${C.red}40`,
              }}
            />
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 3 — SOLUTION REVEAL (4–5.5s)
// ════════════════════════════════════════════
const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [35, 44], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoIn = spring({ frame, fps, config: POP });
  const textIn = spring({ frame: frame - 8, fps, config: SNAP });
  const subIn = spring({ frame: frame - 14, fps, config: SNAP });

  const glowPulse = Math.sin(frame * 0.12) * 0.1 + 0.2;

  // Color shift — red to blue
  const colorShift = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: fadeOut }}>
      {/* Transition glow — warm to cool */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle,
            rgba(59,130,246,${glowPulse * colorShift}) 0%,
            rgba(212,165,116,${glowPulse * (1 - colorShift) * 0.5}) 30%,
            transparent 60%)`,
          filter: "blur(20px)",
        }}
      />

      {/* Logo */}
      <Img
        src={staticFile("casemate_instagram_logo.png")}
        style={{
          width: 280,
          height: 280,
          borderRadius: 28,
          opacity: Math.min(1, logoIn),
          transform: `scale(${logoIn})`,
          boxShadow: `
            0 0 40px rgba(59,130,246,${glowPulse}),
            0 0 80px rgba(59,130,246,${glowPulse * 0.5}),
            0 25px 50px rgba(0,0,0,0.5)`,
        }}
      />

      {/* "Meet CaseMate" */}
      <div
        style={{
          marginTop: 30,
          opacity: Math.min(1, textIn),
          transform: `translateY(${(1 - textIn) * 15}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontFamily: serif,
            color: C.warm,
            textShadow: "0 0 30px rgba(255,255,255,0.1), 0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          Meet CaseMate.
        </div>
      </div>

      {/* Subtitle */}
      <div
        style={{
          marginTop: 12,
          opacity: Math.min(1, subIn),
          transform: `translateY(${(1 - subIn) * 10}px)`,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontFamily: sans,
            fontWeight: 600,
            color: C.blueLight,
            letterSpacing: 2,
            textShadow: textGlow("rgba(59,130,246,0.12)"),
          }}
        >
          Your AI legal team.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 4 — USE CASES CAROUSEL (5.5–9.5s)
// ════════════════════════════════════════════
const UseCasesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [105, 119], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cases = [
    {
      icon: "🏠",
      category: "Tenant Rights",
      question: "My landlord won't fix the mold. What are my options?",
      answer: "Under your state's Warranty of Habitability, your landlord must maintain livable conditions.",
      citation: "M.G.L. c.239 §8A",
      color: C.blue,
      startFrame: 0,
    },
    {
      icon: "💼",
      category: "Employment",
      question: "I was fired after reporting safety issues.",
      answer: "This may constitute illegal retaliation. Federal whistleblower protections apply.",
      citation: "29 U.S.C. §1514A",
      color: C.gold,
      startFrame: 38,
    },
    {
      icon: "📄",
      category: "Contracts",
      question: "Can they enforce this non-compete?",
      answer: "Non-competes must be reasonable in scope, duration, and geography.",
      citation: "State-specific analysis",
      color: C.green,
      startFrame: 76,
    },
  ];

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Header */}
      {(() => {
        const hIn = spring({ frame, fps, config: SNAP });
        return (
          <div
            style={{
              position: "absolute",
              top: 180,
              left: 0,
              right: 0,
              textAlign: "center",
              opacity: Math.min(1, hIn),
              transform: `translateY(${(1 - hIn) * 12}px)`,
            }}
          >
            <div
              style={{
                fontSize: 42,
                fontFamily: serif,
                color: C.warm,
                textShadow: "0 0 25px rgba(255,255,255,0.08), 0 3px 15px rgba(0,0,0,0.5)",
              }}
            >
              Ask anything legal.
            </div>
          </div>
        );
      })()}

      {/* Use case cards — stacked vertically */}
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 60,
          right: 60,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
      {cases.map((c, i) => {
        const cardIn = spring({ frame: frame - c.startFrame, fps, config: POP });
        const cardGlow = Math.sin((frame + i * 10) * 0.08) * 0.3 + 0.5;

        // Only show once its startFrame is reached
        if (frame < c.startFrame) return null;

        const cardOpacity = Math.min(1, cardIn);

        // Answer typewriter
        const answerProgress = interpolate(frame - c.startFrame, [10, 30], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const visibleChars = Math.floor(answerProgress * c.answer.length);

        // Citation pop
        const citIn = spring({ frame: frame - c.startFrame - 25, fps, config: POP });

        return (
          <div
            key={i}
            style={{
              opacity: cardOpacity,
              transform: `scale(${Math.min(1, cardIn)}) translateY(${(1 - Math.min(1, cardIn)) * 30}px)`,
            }}
          >
            <div
              style={{
                ...glowCard(c.color, cardGlow, 0.05),
                padding: "28px 32px",
                borderRadius: 24,
              }}
            >
              {/* Category header */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 32 }}>{c.icon}</span>
                <span
                  style={{
                    fontSize: 16,
                    fontFamily: sans,
                    fontWeight: 700,
                    color: c.color,
                    letterSpacing: 2,
                    textTransform: "uppercase" as const,
                    textShadow: `0 0 12px ${c.color}30`,
                  }}
                >
                  {c.category}
                </span>
              </div>

              {/* Question */}
              <div
                style={{
                  fontSize: 24,
                  fontFamily: sans,
                  fontWeight: 600,
                  color: C.warm,
                  lineHeight: 1.35,
                  marginBottom: 18,
                }}
              >
                "{c.question}"
              </div>

              {/* AI Answer */}
              <div
                style={{
                  fontSize: 18,
                  fontFamily: sans,
                  fontWeight: 400,
                  color: C.offWhite,
                  lineHeight: 1.5,
                  minHeight: 54,
                }}
              >
                {c.answer.slice(0, visibleChars)}
                {visibleChars < c.answer.length && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 2,
                      height: 18,
                      backgroundColor: c.color,
                      marginLeft: 2,
                      opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
                      boxShadow: `0 0 6px ${c.color}`,
                    }}
                  />
                )}
              </div>

              {/* Citation badge */}
              {frame >= c.startFrame + 25 && (
                <div
                  style={{
                    marginTop: 14,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 14px",
                    borderRadius: 10,
                    backgroundColor: `${c.color}10`,
                    border: `1px solid ${c.color}25`,
                    opacity: Math.min(1, citIn),
                    transform: `scale(${citIn})`,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="9" stroke={c.color} strokeWidth="1.5" />
                  </svg>
                  <span
                    style={{
                      fontSize: 14,
                      fontFamily: sans,
                      fontWeight: 700,
                      color: c.color,
                      textShadow: `0 0 8px ${c.color}20`,
                    }}
                  >
                    {c.citation}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 5 — STATS (9.5–12s)
// ════════════════════════════════════════════
const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [60, 74], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const headerIn = spring({ frame, fps, config: SNAP });

  const stats = [
    { value: "50", label: "States\nCovered", suffix: "", color: C.blue, delay: 4 },
    { value: "10", label: "Legal\nDomains", suffix: "+", color: C.gold, delay: 8 },
    { value: "24", label: "Hour\nAccess", suffix: "/7", color: C.green, delay: 12 },
    { value: "0", label: "Dollars\nUpfront", suffix: "$", color: C.purple, delay: 16 },
  ];

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: Math.min(1, headerIn),
          transform: `translateY(${(1 - headerIn) * 12}px)`,
        }}
      >
        <div
          style={{
            fontSize: 44,
            fontFamily: serif,
            color: C.warm,
            textShadow: "0 0 25px rgba(255,255,255,0.08), 0 3px 15px rgba(0,0,0,0.5)",
          }}
        >
          Justice at Scale
        </div>
      </div>

      {/* Stats grid */}
      <div
        style={{
          position: "absolute",
          top: 440,
          left: 60,
          right: 60,
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          justifyContent: "center",
        }}
      >
        {stats.map((s, i) => {
          const cardIn = spring({ frame: frame - s.delay, fps, config: BOUNCY });
          const countUp = interpolate(
            cardIn,
            [0, 1],
            [0, parseInt(s.value)],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const hover = Math.sin((frame + i * 15) * 0.05) * 3;
          const cardGlow = Math.sin((frame + i * 12) * 0.07) * 0.4 + 0.5;

          return (
            <div
              key={i}
              style={{
                width: 440,
                height: 280,
                ...glowCard(s.color, cardGlow * Math.min(1, cardIn)),
                padding: "30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                opacity: Math.min(1, cardIn),
                transform: `scale(${interpolate(cardIn, [0, 0.6, 1], [0.7, 1.04, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })}) translateY(${(1 - cardIn) * 30 + hover}px)`,
              }}
            >
              <div
                style={{
                  fontSize: 72,
                  fontFamily: sans,
                  fontWeight: 900,
                  color: s.color,
                  textShadow: textGlow(`${s.color}30`),
                  lineHeight: 1,
                }}
              >
                {s.suffix === "$" ? "$" : ""}
                {Math.round(countUp)}
                {s.suffix !== "$" ? s.suffix : ""}
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontFamily: sans,
                  fontWeight: 600,
                  color: C.offWhite,
                  textAlign: "center",
                  lineHeight: 1.3,
                  marginTop: 10,
                  whiteSpace: "pre-line",
                }}
              >
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 6 — CTA (12–15s)
// ════════════════════════════════════════════
const CTAScene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: POP });
  const tagIn = spring({ frame: frame - 6, fps, config: SNAP });
  const lineIn = spring({ frame: frame - 10, fps, config: SNAP });
  const btnIn = spring({ frame: frame - 16, fps, config: POP });
  const badgesIn = spring({ frame: frame - 24, fps, config: SNAP });

  const btnScale = interpolate(btnIn, [0, 0.7, 1], [0.8, 1.06, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = Math.sin((frame - 22) * 0.12) * 0.012 * Math.min(1, btnIn);
  const ctaGlow = Math.sin(frame * 0.06) * 0.06 + 0.14;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20 }}>
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(59,130,246,${ctaGlow}) 0%, transparent 55%)`,
          filter: "blur(25px)",
        }}
      />

      {/* Logo */}
      <Img
        src={staticFile("casemate_instagram_logo.png")}
        style={{
          width: 140,
          height: 140,
          borderRadius: 20,
          opacity: Math.min(1, logoIn),
          transform: `scale(${logoIn})`,
          boxShadow: `
            0 0 40px rgba(59,130,246,0.25),
            0 0 80px rgba(59,130,246,0.12),
            0 20px 50px rgba(0,0,0,0.5)`,
        }}
      />

      {/* Tagline */}
      <div
        style={{
          fontSize: 44,
          fontFamily: serif,
          color: C.warm,
          opacity: Math.min(1, tagIn),
          transform: `translateY(${(1 - tagIn) * 12}px)`,
          textAlign: "center",
          lineHeight: 1.2,
          textShadow: "0 0 25px rgba(255,255,255,0.1), 0 4px 20px rgba(0,0,0,0.6)",
          maxWidth: 800,
          padding: "0 40px",
        }}
      >
        Justice shouldn&apos;t
        <br />
        have a price tag.
      </div>

      {/* Line */}
      <div
        style={{
          width: interpolate(Math.min(1, lineIn), [0, 1], [0, 200]),
          height: 2,
          background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
          opacity: Math.min(1, lineIn),
          boxShadow: `0 0 12px ${C.gold}40`,
        }}
      />

      {/* CTA Button */}
      <div
        style={{
          marginTop: 8,
          fontSize: 28,
          fontWeight: 700,
          color: "#fff",
          background: "linear-gradient(135deg, #2563eb, #4338ca)",
          padding: "18px 56px",
          borderRadius: 50,
          fontFamily: sans,
          opacity: Math.min(1, btnIn),
          transform: `scale(${btnScale + pulse})`,
          boxShadow: bloom(C.blue, 0.4) + `, 0 8px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)`,
          letterSpacing: 1,
        }}
      >
        Get Started Free
      </div>

      {/* Trust row */}
      <div
        style={{
          display: "flex",
          gap: 14,
          marginTop: 8,
          opacity: Math.min(1, badgesIn),
          transform: `translateY(${(1 - badgesIn) * 8}px)`,
        }}
      >
        {["No credit card", "Real citations", "50 states"].map((b) => (
          <div
            key={b}
            style={{
              fontSize: 13,
              color: C.blueLight,
              fontFamily: sans,
              fontWeight: 600,
              padding: "6px 14px",
              backgroundColor: "rgba(59,130,246,0.06)",
              border: "1px solid rgba(59,130,246,0.12)",
              borderRadius: 10,
              letterSpacing: 0.5,
              boxShadow: "0 0 12px rgba(59,130,246,0.06)",
              textShadow: "0 0 8px rgba(59,130,246,0.15)",
            }}
          >
            {b}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════
export const CaseMatePromo2: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: sans }}>
      <Background2 />
      <Sequence from={0} durationInFrames={60}><ServedScene /></Sequence>
      <Sequence from={60} durationInFrames={60} premountFor={15}><PanicScene /></Sequence>
      <Sequence from={120} durationInFrames={45} premountFor={15}><SolutionScene /></Sequence>
      <Sequence from={165} durationInFrames={120} premountFor={15}><UseCasesScene /></Sequence>
      <Sequence from={285} durationInFrames={75} premountFor={15}><StatsScene /></Sequence>
      <Sequence from={360} durationInFrames={90} premountFor={15}><CTAScene2 /></Sequence>
    </AbsoluteFill>
  );
};
