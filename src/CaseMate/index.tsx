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
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/google-fonts/Inter";
import { loadFont as loadSerif } from "@remotion/google-fonts/DMSerifDisplay";
import { Background } from "./Background";

const { fontFamily: sans } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
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
  orange: "#f97316",
  purple: "#7c3aed",
};

// Glow shadow helper — stacks multiple colored shadows for bloom
const bloom = (color: string, intensity = 1) =>
  `0 0 ${15 * intensity}px ${color}, 0 0 ${40 * intensity}px ${color}, 0 0 ${80 * intensity}px ${color}40`;

const textGlow = (color: string) =>
  `0 0 10px ${color}, 0 0 30px ${color}80, 0 0 60px ${color}40, 0 2px 8px rgba(0,0,0,0.6)`;

// Glowing border card
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
// SCENE 1 — HOOK (0–2s)
// ════════════════════════════════════════════
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [48, 59], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const priceIn = spring({ frame, fps, config: BOUNCY });
  const priceScale = interpolate(priceIn, [0, 0.6, 1], [1.4, 0.95, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const hrIn = spring({ frame: frame - 6, fps, config: SNAP });
  const qIn = spring({ frame: frame - 12, fps, config: SNAP });

  // Pulsing red glow
  const redPulse = Math.sin(frame * 0.15) * 0.3 + 0.7;
  const glowSize = Math.sin(frame * 0.12) * 20 + 80;

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Red glow burst behind $300 */}
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 140,
          width: 800,
          height: 500,
          background: `radial-gradient(ellipse, rgba(239,68,68,${0.12 * redPulse}) 0%, rgba(239,68,68,0.03) 40%, transparent 65%)`,
          filter: "blur(20px)",
        }}
      />

      {/* Giant $300 with neon glow */}
      <div
        style={{
          position: "absolute",
          top: 480,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: Math.min(1, priceIn),
          transform: `scale(${priceScale}) translateY(${(1 - priceIn) * -60}px)`,
        }}
      >
        <span
          style={{
            fontSize: 200,
            fontFamily: serif,
            color: C.red,
            textShadow: `
              0 0 20px rgba(239,68,68,${0.5 * redPulse}),
              0 0 ${glowSize}px rgba(239,68,68,${0.3 * redPulse}),
              0 0 ${glowSize * 2}px rgba(239,68,68,${0.15 * redPulse}),
              0 4px 12px rgba(0,0,0,0.8)`,
            letterSpacing: -5,
          }}
        >
          $300
        </span>
        <span
          style={{
            fontSize: 60,
            fontFamily: sans,
            fontWeight: 700,
            color: "rgba(239,68,68,0.5)",
            opacity: Math.min(1, hrIn),
            transform: `translateX(${(1 - hrIn) * 20}px)`,
            display: "inline-block",
            verticalAlign: "top",
            marginTop: 30,
            marginLeft: 4,
            textShadow: "0 0 20px rgba(239,68,68,0.3)",
          }}
        >
          /hr
        </span>
      </div>

      {/* Question with soft white glow */}
      <div
        style={{
          position: "absolute",
          top: 760,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: Math.min(1, qIn),
          transform: `translateY(${(1 - qIn) * 20}px)`,
        }}
      >
        <span
          style={{
            fontSize: 52,
            fontFamily: serif,
            color: C.warm,
            textShadow: "0 0 30px rgba(255,255,255,0.15), 0 0 60px rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.6)",
          }}
        >
          Can&apos;t afford a lawyer?
        </span>
      </div>

      {/* Glowing badge */}
      {(() => {
        const badgeIn = spring({ frame: frame - 18, fps, config: POP });
        return (
          <div
            style={{
              position: "absolute",
              top: 380,
              right: 60,
              ...glowCard(C.red, badgeIn),
              borderRadius: 14,
              padding: "10px 20px",
              opacity: Math.min(1, badgeIn),
              transform: `rotate(6deg) scale(${badgeIn}) translateY(${(1 - badgeIn) * 15}px)`,
            }}
          >
            <span style={{ fontSize: 15, color: C.red, fontFamily: sans, fontWeight: 700, textShadow: "0 0 8px rgba(239,68,68,0.3)" }}>
              Average attorney fee
            </span>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 2 — PROBLEM CARDS (2–4s)
// ════════════════════════════════════════════
const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [48, 59], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cards = [
    { text: "Generic\nAnswers", rot: -8, x: 80, y: 420, delay: 0, color: C.red },
    { text: "No\nContext", rot: 2, x: 370, y: 380, delay: 6, color: C.orange },
    { text: "Wrong\nState", rot: 10, x: 660, y: 440, delay: 12, color: C.red },
  ];

  const headerIn = spring({ frame, fps, config: SNAP });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: Math.min(1, headerIn),
          transform: `translateY(${(1 - headerIn) * 15}px)`,
        }}
      >
        <div style={{
          fontSize: 44,
          fontFamily: serif,
          color: C.warm,
          textShadow: "0 0 30px rgba(255,255,255,0.1), 0 2px 15px rgba(0,0,0,0.5)",
        }}>
          Legal chatbots today?
        </div>
        <div style={{
          fontSize: 22,
          fontFamily: sans,
          color: C.slate,
          fontWeight: 500,
          marginTop: 8,
          textShadow: "0 0 15px rgba(100,116,139,0.2)",
        }}>
          They don&apos;t know your story.
        </div>
      </div>

      {/* Fanned cards with glowing borders */}
      {cards.map((card, i) => {
        const cardIn = spring({ frame: frame - card.delay, fps, config: BOUNCY });
        const cardScale = interpolate(cardIn, [0, 0.6, 1], [0.5, 1.05, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const hover = Math.sin((frame + i * 20) * 0.06) * 4;
        const cardGlow = Math.sin((frame + i * 10) * 0.08) * 0.5 + 0.5;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: card.x,
              top: card.y + hover,
              width: 300,
              height: 340,
              ...glowCard(card.color, cardGlow * cardIn),
              borderRadius: 24,
              padding: "28px 24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              opacity: Math.min(1, cardIn),
              transform: `rotate(${card.rot}deg) scale(${cardScale})`,
            }}
          >
            {/* Glowing X icon */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                backgroundColor: `${card.color}15`,
                border: `1px solid ${card.color}25`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 15px ${card.color}20, inset 0 0 8px ${card.color}10`,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke={card.color} strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div
              style={{
                fontSize: 38,
                fontFamily: sans,
                fontWeight: 800,
                color: C.warm,
                lineHeight: 1.15,
                whiteSpace: "pre-line",
                textShadow: "0 0 20px rgba(255,255,255,0.08)",
              }}
            >
              {card.text}
            </div>
          </div>
        );
      })}

      {/* Glowing "better way" pill */}
      {(() => {
        const vsIn = spring({ frame: frame - 22, fps, config: POP });
        const pillGlow = Math.sin(frame * 0.1) * 0.3 + 0.7;
        return (
          <div
            style={{
              position: "absolute",
              top: 870,
              left: 0,
              right: 0,
              textAlign: "center",
              opacity: Math.min(1, vsIn),
              transform: `scale(${vsIn})`,
            }}
          >
            <span
              style={{
                fontSize: 26,
                fontFamily: sans,
                fontWeight: 700,
                color: C.goldLight,
                padding: "10px 32px",
                backgroundColor: "rgba(212,165,116,0.08)",
                border: "1px solid rgba(212,165,116,0.2)",
                borderRadius: 50,
                textShadow: textGlow(`rgba(212,165,116,${0.3 * pillGlow})`),
                boxShadow: `0 0 30px rgba(212,165,116,${0.08 * pillGlow}), 0 0 60px rgba(212,165,116,${0.04 * pillGlow}), 0 4px 20px rgba(0,0,0,0.3)`,
              }}
            >
              There&apos;s a better way
            </span>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 3 — LOGO BURST (4–5.5s)
// ════════════════════════════════════════════
const LogoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [35, 44], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoIn = spring({ frame, fps, config: { damping: 12, stiffness: 160 } });
  const glowPulse = Math.sin(frame * 0.15) * 0.12 + 0.28;
  const flash = interpolate(frame, [0, 10], [0.35, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Expanding glow ring
  const ringScale = interpolate(logoIn, [0, 1], [0.3, 2.5]);
  const ringOp = interpolate(logoIn, [0.2, 0.5, 1], [0, 0.2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Burst particles
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const dist = interpolate(logoIn, [0, 1], [0, 350]);
    const pOp = interpolate(logoIn, [0.2, 0.5, 1], [0, 0.5, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const pSize = interpolate(logoIn, [0.2, 0.5, 1], [6, 4, 2], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return {
      x: 540 + Math.cos(angle) * dist,
      y: 820 + Math.sin(angle) * dist,
      opacity: pOp,
      size: pSize,
    };
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: fadeOut }}>
      {/* Flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at center, rgba(212,165,116,${flash}) 0%, rgba(59,130,246,${flash * 0.5}) 40%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />

      {/* Expanding glow ring */}
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          border: `2px solid rgba(212,165,116,${ringOp})`,
          transform: `scale(${ringScale})`,
          boxShadow: `0 0 30px rgba(212,165,116,${ringOp * 0.5}), inset 0 0 30px rgba(212,165,116,${ringOp * 0.3})`,
        }}
      />

      {/* Multi-layer glow behind logo */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle,
            rgba(212,165,116,${glowPulse * 0.5}) 0%,
            rgba(59,130,246,${glowPulse * 0.3}) 30%,
            rgba(124,58,237,${glowPulse * 0.15}) 50%,
            transparent 65%)`,
          filter: "blur(15px)",
        }}
      />

      {/* Burst particles with glow */}
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {particles.map((p, i) => (
          <React.Fragment key={i}>
            <circle cx={p.x} cy={p.y} r={p.size * 3} fill={i % 2 === 0 ? C.gold : C.blue} opacity={p.opacity * 0.15} />
            <circle cx={p.x} cy={p.y} r={p.size} fill={i % 2 === 0 ? C.goldLight : C.blueLight} opacity={p.opacity} />
          </React.Fragment>
        ))}
      </svg>

      <Img
        src={staticFile("casemate_instagram_logo.png")}
        style={{
          width: 420,
          height: 420,
          borderRadius: 28,
          transform: `scale(${logoIn})`,
          boxShadow: `
            0 0 40px rgba(59,130,246,${glowPulse * 0.8}),
            0 0 80px rgba(59,130,246,${glowPulse * 0.4}),
            0 0 30px rgba(212,165,116,${glowPulse * 0.4}),
            0 0 60px rgba(212,165,116,${glowPulse * 0.2}),
            0 30px 60px rgba(0,0,0,0.6)`,
        }}
      />
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 4 — PHONE DEMO (5.5–9.5s)
// ════════════════════════════════════════════
const PhoneDemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [105, 119], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const phoneIn = spring({ frame, fps, config: { damping: 20, stiffness: 120 } });
  const phoneY = interpolate(phoneIn, [0, 1], [300, 0]);

  const userMsg = spring({ frame: frame - 15, fps, config: SNAP });
  const typingVisible = frame >= 28 && frame < 42;
  const aiMsg = spring({ frame: frame - 42, fps, config: SNAP });
  const statute = spring({ frame: frame - 55, fps, config: POP });
  const dmg = spring({ frame: frame - 65, fps, config: SNAP });
  const dmgVal = interpolate(dmg, [0, 1], [0, 6600]);

  const badge1 = spring({ frame: frame - 50, fps, config: BOUNCY });
  const badge2 = spring({ frame: frame - 62, fps, config: BOUNCY });
  const badge3 = spring({ frame: frame - 74, fps, config: BOUNCY });

  const f1 = Math.sin(frame * 0.05) * 5;
  const f2 = Math.sin(frame * 0.06 + 1) * 4;
  const f3 = Math.sin(frame * 0.04 + 2) * 6;

  // Phone border glow
  const phoneBorderGlow = Math.sin(frame * 0.06) * 0.15 + 0.25;

  return (
    <AbsoluteFill style={{ opacity: sceneIn * fadeOut }}>
      {/* Phone glow aura */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 250,
          width: 550,
          height: 900,
          borderRadius: 60,
          background: `radial-gradient(ellipse, rgba(59,130,246,${phoneBorderGlow * 0.15}) 0%, transparent 60%)`,
          filter: "blur(30px)",
          transform: `translateY(${phoneY}px)`,
          opacity: Math.min(1, phoneIn),
        }}
      />

      {/* Phone */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 180,
          width: 420,
          transform: `translateY(${phoneY}px) perspective(1200px) rotateY(-4deg) rotateX(1deg)`,
          opacity: Math.min(1, phoneIn),
        }}
      >
        <div
          style={{
            width: 420,
            height: 840,
            borderRadius: 44,
            backgroundColor: "#0c0f18",
            border: `2px solid rgba(59,130,246,${phoneBorderGlow * 0.4})`,
            padding: 8,
            boxShadow: `
              0 0 ${30 * phoneBorderGlow}px rgba(59,130,246,${phoneBorderGlow * 0.15}),
              0 0 ${60 * phoneBorderGlow}px rgba(59,130,246,${phoneBorderGlow * 0.08}),
              0 40px 100px rgba(0,0,0,0.6),
              inset 0 1px 0 rgba(255,255,255,0.06)`,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 36,
              overflow: "hidden",
              backgroundColor: "#060912",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Status bar */}
            <div style={{ padding: "10px 20px 6px", display: "flex", justifyContent: "space-between", fontSize: 12, color: C.slate, fontFamily: sans, fontWeight: 600 }}>
              <span>9:41</span>
              <span>●●●</span>
            </div>

            {/* Nav */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px 10px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #2563eb, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: sans, boxShadow: "0 0 12px rgba(59,130,246,0.3)" }}>
                CM
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.white, fontFamily: sans }}>CaseMate AI</div>
            </div>

            {/* Chat */}
            <div style={{ flex: 1, padding: "12px 12px", overflow: "hidden" }}>
              <div style={{ textAlign: "center", marginBottom: 10, padding: "5px 10px", backgroundColor: "rgba(59,130,246,0.06)", borderRadius: 8, fontSize: 10, color: C.blue, fontFamily: sans, fontWeight: 600, opacity: Math.min(1, userMsg), boxShadow: "0 0 10px rgba(59,130,246,0.05)" }}>
                MA · Renter · 2yr lease
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8, opacity: Math.min(1, userMsg), transform: `translateX(${(1 - userMsg) * 20}px)` }}>
                <div style={{ maxWidth: "82%", backgroundColor: C.blue, padding: "10px 14px", borderRadius: "14px 14px 3px 14px", boxShadow: "0 0 20px rgba(59,130,246,0.2)" }}>
                  <div style={{ fontSize: 14, color: "#fff", fontFamily: sans, lineHeight: 1.35, fontWeight: 500 }}>
                    My landlord won&apos;t return my deposit. What can I do?
                  </div>
                </div>
              </div>

              {typingVisible && (
                <div style={{ display: "flex", marginBottom: 8 }}>
                  <div style={{ backgroundColor: "rgba(255,255,255,0.04)", padding: "10px 16px", borderRadius: "14px 14px 14px 3px", display: "flex", gap: 5 }}>
                    {[0, 1, 2].map((d) => (
                      <div key={d} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.blue, opacity: Math.sin(frame * 0.5 + d * 1.2) * 0.4 + 0.6, boxShadow: `0 0 6px ${C.blue}60` }} />
                    ))}
                  </div>
                </div>
              )}

              {frame >= 42 && (
                <div style={{ display: "flex" }}>
                  <div style={{ maxWidth: "92%", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "14px 14px 14px 3px", padding: "12px 14px", opacity: Math.min(1, aiMsg) }}>
                    <div style={{ fontSize: 13, color: C.offWhite, fontFamily: sans, lineHeight: 1.4 }}>
                      Your landlord violated <span style={{ color: C.goldLight, fontWeight: 600, textShadow: "0 0 8px rgba(212,165,116,0.2)" }}>MA law</span>:
                    </div>

                    <div style={{ marginTop: 8, padding: "8px 10px", backgroundColor: `rgba(212,165,116,${0.06 * Math.min(1, statute)})`, borderRadius: 8, borderLeft: `2px solid rgba(212,165,116,${0.5 * Math.min(1, statute)})`, opacity: Math.min(1, statute), boxShadow: `0 0 12px rgba(212,165,116,${0.05 * Math.min(1, statute)})` }}>
                      <div style={{ fontSize: 14, color: C.goldLight, fontFamily: sans, fontWeight: 700, textShadow: "0 0 8px rgba(212,165,116,0.15)" }}>
                        M.G.L. c.186 §15B
                      </div>
                    </div>

                    <div style={{ marginTop: 8, opacity: Math.min(1, dmg) }}>
                      <div style={{ fontSize: 30, fontWeight: 700, color: C.green, fontFamily: sans, textShadow: textGlow("rgba(34,197,94,0.2)") }}>
                        ${Math.round(dmgVal).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </div>
                      <div style={{ fontSize: 11, color: C.greenLight, fontFamily: sans, fontWeight: 500, textShadow: "0 0 8px rgba(34,197,94,0.15)" }}>
                        Triple damages
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: "8px 12px 16px", borderTop: "1px solid rgba(255,255,255,0.03)", display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ flex: 1, padding: "8px 12px", backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)", fontSize: 12, color: C.slate, fontFamily: sans }}>
                Ask about your rights...
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: C.blue, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: bloom(C.blue, 0.3) }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path d="M3 10h14M12 5l5 5-5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating glowing badges ── */}
      <div
        style={{
          position: "absolute",
          top: 300 + f1,
          right: 50,
          ...glowCard(C.gold, badge1, 0.06),
          borderRadius: 16,
          padding: "14px 22px",
          opacity: Math.min(1, badge1),
          transform: `rotate(5deg) scale(${badge1}) translateY(${(1 - badge1) * 25}px)`,
        }}
      >
        <div style={{ fontSize: 11, color: C.slate, fontFamily: sans, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" as const, marginBottom: 4 }}>
          Statute Cited
        </div>
        <div style={{ fontSize: 22, color: C.goldLight, fontFamily: sans, fontWeight: 700, textShadow: textGlow("rgba(212,165,116,0.15)") }}>
          M.G.L. §15B
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 680 + f2,
          right: 40,
          ...glowCard(C.green, badge2, 0.06),
          borderRadius: 16,
          padding: "14px 22px",
          opacity: Math.min(1, badge2),
          transform: `rotate(-3deg) scale(${badge2}) translateY(${(1 - badge2) * 25}px)`,
        }}
      >
        <div style={{ fontSize: 11, color: C.slate, fontFamily: sans, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" as const, marginBottom: 4 }}>
          Recovery
        </div>
        <div style={{ fontSize: 28, color: C.green, fontFamily: sans, fontWeight: 700, textShadow: textGlow("rgba(34,197,94,0.2)") }}>
          $6,600
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 1060 + f3,
          right: 70,
          ...glowCard(C.blue, badge3, 0.06),
          borderRadius: 16,
          padding: "14px 22px",
          opacity: Math.min(1, badge3),
          transform: `rotate(4deg) scale(${badge3}) translateY(${(1 - badge3) * 25}px)`,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M9 12l2 2 4-4" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="9" stroke={C.blue} strokeWidth="1.5" />
        </svg>
        <div style={{ fontSize: 18, color: C.blueLight, fontFamily: sans, fontWeight: 700, textShadow: "0 0 10px rgba(59,130,246,0.2)" }}>
          Letter Ready
        </div>
      </div>

      {/* Title */}
      {(() => {
        const titleIn = spring({ frame: frame - 8, fps, config: SNAP });
        return (
          <div style={{ position: "absolute", bottom: 280, left: 0, right: 0, textAlign: "center", opacity: Math.min(1, titleIn), transform: `translateY(${(1 - titleIn) * 15}px)` }}>
            <div style={{ fontSize: 38, fontFamily: serif, color: C.warm, textShadow: "0 0 30px rgba(255,255,255,0.1), 0 4px 20px rgba(0,0,0,0.5)" }}>
              Your situation. Your state.
            </div>
            <div style={{ fontSize: 20, fontFamily: sans, color: C.gold, fontWeight: 600, marginTop: 8, textShadow: textGlow("rgba(212,165,116,0.12)") }}>
              Real answers, not generic advice.
            </div>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 5 — FEATURES (9.5–12s)
// ════════════════════════════════════════════
const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [60, 74], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const headerIn = spring({ frame, fps, config: SNAP });

  const features = [
    { title: "10 Legal\nDomains", color: C.blue, rot: -3, delay: 4 },
    { title: "Real\nCitations", color: C.gold, rot: 3, delay: 8 },
    { title: "Persistent\nMemory", color: C.green, rot: 2, delay: 12 },
    { title: "Document\nAnalysis", color: C.purple, rot: -2, delay: 16 },
  ];

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, textAlign: "center", opacity: Math.min(1, headerIn), transform: `translateY(${(1 - headerIn) * 12}px)` }}>
        <div style={{ fontSize: 46, fontFamily: serif, color: C.warm, textShadow: "0 0 30px rgba(255,255,255,0.1), 0 2px 15px rgba(0,0,0,0.5)" }}>
          Built for Real Cases
        </div>
      </div>

      <div style={{ position: "absolute", top: 440, left: 60, right: 60, display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center" }}>
        {features.map((f, i) => {
          const cardIn = spring({ frame: frame - f.delay, fps, config: BOUNCY });
          const hover = Math.sin((frame + i * 15) * 0.05) * 3;
          const cardGlow = Math.sin((frame + i * 12) * 0.07) * 0.5 + 0.5;

          return (
            <div
              key={i}
              style={{
                width: 440,
                height: 280,
                ...glowCard(f.color, cardGlow * cardIn),
                borderRadius: 24,
                padding: "28px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                opacity: Math.min(1, cardIn),
                transform: `rotate(${f.rot * cardIn}deg) scale(${interpolate(cardIn, [0, 0.6, 1], [0.7, 1.04, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}) translateY(${(1 - cardIn) * 40 + hover}px)`,
              }}
            >
              {/* Glowing dot */}
              <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: f.color, boxShadow: bloom(f.color, 0.6) }} />
              <div style={{ fontSize: 36, fontFamily: sans, fontWeight: 800, color: C.warm, lineHeight: 1.15, whiteSpace: "pre-line", textShadow: "0 0 15px rgba(255,255,255,0.06)" }}>
                {f.title}
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
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: POP });
  const nameIn = spring({ frame: frame - 6, fps, config: SNAP });
  const tagIn = spring({ frame: frame - 10, fps, config: SNAP });
  const btnIn = spring({ frame: frame - 16, fps, config: POP });
  const badgesIn = spring({ frame: frame - 24, fps, config: SNAP });

  const btnScale = interpolate(btnIn, [0, 0.7, 1], [0.8, 1.06, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = Math.sin((frame - 22) * 0.12) * 0.012 * Math.min(1, btnIn);

  // Animated glow behind CTA
  const ctaGlow = Math.sin(frame * 0.06) * 0.06 + 0.14;
  const ctaGlow2 = Math.sin(frame * 0.08 + 1) * 0.04 + 0.08;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 22 }}>
      {/* Multi-layer glow */}
      <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle, rgba(212,165,116,${ctaGlow}) 0%, transparent 55%)`, filter: "blur(25px)" }} />
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, rgba(59,130,246,${ctaGlow2}) 0%, transparent 55%)`, filter: "blur(20px)" }} />

      <Img
        src={staticFile("casemate_instagram_logo.png")}
        style={{
          width: 160,
          height: 160,
          borderRadius: 22,
          opacity: Math.min(1, logoIn),
          transform: `scale(${logoIn})`,
          boxShadow: `
            0 0 40px rgba(59,130,246,0.25),
            0 0 80px rgba(59,130,246,0.12),
            0 0 30px rgba(212,165,116,0.15),
            0 20px 50px rgba(0,0,0,0.5)`,
        }}
      />

      <div style={{
        fontSize: 50,
        fontFamily: serif,
        color: C.warm,
        opacity: Math.min(1, nameIn),
        transform: `translateY(${(1 - nameIn) * 12}px)`,
        letterSpacing: 6,
        textShadow: "0 0 30px rgba(255,255,255,0.12), 0 0 60px rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.6)",
      }}>
        CASEMATE
      </div>

      <div style={{
        fontSize: 20,
        color: C.goldLight,
        fontFamily: sans,
        fontWeight: 600,
        opacity: Math.min(1, tagIn),
        marginTop: -6,
        letterSpacing: 3,
        textShadow: textGlow("rgba(212,165,116,0.15)"),
      }}>
        YOUR AI LEGAL ALLY
      </div>

      <div
        style={{
          marginTop: 16,
          fontSize: 28,
          fontWeight: 700,
          color: "#fff",
          background: "linear-gradient(135deg, #2563eb, #4338ca)",
          padding: "18px 56px",
          borderRadius: 50,
          fontFamily: sans,
          opacity: Math.min(1, btnIn),
          transform: `scale(${btnScale + pulse})`,
          boxShadow: `
            0 0 20px rgba(59,130,246,0.3),
            0 0 50px rgba(59,130,246,0.15),
            0 0 80px rgba(59,130,246,0.08),
            0 8px 30px rgba(0,0,0,0.35),
            inset 0 1px 0 rgba(255,255,255,0.15)`,
          letterSpacing: 1,
        }}
      >
        Try Free Today
      </div>

      {/* Glowing trust badges */}
      <div style={{ display: "flex", gap: 14, marginTop: 12, opacity: Math.min(1, badgesIn), transform: `translateY(${(1 - badgesIn) * 8}px)` }}>
        {["5 States", "10 Domains", "Free to Start"].map((b) => (
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
export const CaseMatePromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: sans }}>
      <Background />
      <Sequence from={0} durationInFrames={60}><HookScene /></Sequence>
      <Sequence from={60} durationInFrames={60} premountFor={15}><ProblemScene /></Sequence>
      <Sequence from={120} durationInFrames={45} premountFor={15}><LogoScene /></Sequence>
      <Sequence from={165} durationInFrames={120} premountFor={15}><PhoneDemoScene /></Sequence>
      <Sequence from={285} durationInFrames={75} premountFor={15}><FeaturesScene /></Sequence>
      <Sequence from={360} durationInFrames={90} premountFor={15}><CTAScene /></Sequence>

      {/* ── Background music — Innerbloom, low volume with fade in/out ── */}
      <Audio
        src={staticFile("innerbloom.mp3")}
        volume={(f) => {
          const fadeIn = interpolate(f, [0, 30], [0, 0.12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const fadeOut = interpolate(f, [420, 450], [0.12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return Math.min(fadeIn, fadeOut);
        }}
      />

      {/* ── SFX: Impact on $300 reveal ── */}
      <Sequence from={0} durationInFrames={30}>
        <Audio src={staticFile("impact.wav")} volume={0.7} />
      </Sequence>

      {/* ── SFX: Pop on "Can't afford" text ── */}
      <Sequence from={12} durationInFrames={15}>
        <Audio src={staticFile("pop.wav")} volume={0.5} />
      </Sequence>

      {/* ── SFX: Whoosh into Problem scene ── */}
      <Sequence from={58} durationInFrames={15}>
        <Audio src={staticFile("whoosh.wav")} volume={0.5} />
      </Sequence>

      {/* ── SFX: Swipe on problem cards fanning in ── */}
      <Sequence from={64} durationInFrames={10}>
        <Audio src={staticFile("swipe.wav")} volume={0.45} />
      </Sequence>
      <Sequence from={70} durationInFrames={10}>
        <Audio src={staticFile("swipe.wav")} volume={0.4} />
      </Sequence>
      <Sequence from={76} durationInFrames={10}>
        <Audio src={staticFile("swipe.wav")} volume={0.35} />
      </Sequence>

      {/* ── SFX: Pop on "There's a better way" pill ── */}
      <Sequence from={90} durationInFrames={15}>
        <Audio src={staticFile("pop.wav")} volume={0.5} />
      </Sequence>

      {/* ── SFX: Whoosh + Impact on logo burst ── */}
      <Sequence from={118} durationInFrames={15}>
        <Audio src={staticFile("whoosh.wav")} volume={0.55} />
      </Sequence>
      <Sequence from={120} durationInFrames={30}>
        <Audio src={staticFile("impact.wav")} volume={0.8} />
      </Sequence>
      <Sequence from={122} durationInFrames={20}>
        <Audio src={staticFile("shimmer.wav")} volume={0.35} />
      </Sequence>

      {/* ── SFX: Whoosh into phone demo ── */}
      <Sequence from={163} durationInFrames={15}>
        <Audio src={staticFile("whoosh.wav")} volume={0.45} />
      </Sequence>

      {/* ── SFX: Pop on user message ── */}
      <Sequence from={180} durationInFrames={15}>
        <Audio src={staticFile("pop.wav")} volume={0.35} />
      </Sequence>

      {/* ── SFX: Shimmer on AI response ── */}
      <Sequence from={207} durationInFrames={20}>
        <Audio src={staticFile("shimmer.wav")} volume={0.3} />
      </Sequence>

      {/* ── SFX: Pop on statute citation ── */}
      <Sequence from={220} durationInFrames={15}>
        <Audio src={staticFile("pop.wav")} volume={0.4} />
      </Sequence>

      {/* ── SFX: Pop on $6,600 counter ── */}
      <Sequence from={230} durationInFrames={15}>
        <Audio src={staticFile("pop.wav")} volume={0.45} />
      </Sequence>

      {/* ── SFX: Shimmer on floating badges ── */}
      <Sequence from={215} durationInFrames={15}>
        <Audio src={staticFile("shimmer.wav")} volume={0.25} />
      </Sequence>
      <Sequence from={227} durationInFrames={15}>
        <Audio src={staticFile("shimmer.wav")} volume={0.25} />
      </Sequence>
      <Sequence from={239} durationInFrames={15}>
        <Audio src={staticFile("shimmer.wav")} volume={0.25} />
      </Sequence>

      {/* ── SFX: Whoosh into features ── */}
      <Sequence from={283} durationInFrames={15}>
        <Audio src={staticFile("whoosh.wav")} volume={0.45} />
      </Sequence>

      {/* ── SFX: Pop on each feature card ── */}
      <Sequence from={289} durationInFrames={10}>
        <Audio src={staticFile("pop.wav")} volume={0.35} />
      </Sequence>
      <Sequence from={293} durationInFrames={10}>
        <Audio src={staticFile("pop.wav")} volume={0.35} />
      </Sequence>
      <Sequence from={297} durationInFrames={10}>
        <Audio src={staticFile("pop.wav")} volume={0.35} />
      </Sequence>
      <Sequence from={301} durationInFrames={10}>
        <Audio src={staticFile("pop.wav")} volume={0.35} />
      </Sequence>

      {/* ── SFX: Whoosh into CTA ── */}
      <Sequence from={358} durationInFrames={15}>
        <Audio src={staticFile("whoosh.wav")} volume={0.5} />
      </Sequence>

      {/* ── SFX: Impact on CTA logo ── */}
      <Sequence from={360} durationInFrames={25}>
        <Audio src={staticFile("impact.wav")} volume={0.6} />
      </Sequence>

      {/* ── SFX: Shimmer on CTA button ── */}
      <Sequence from={376} durationInFrames={20}>
        <Audio src={staticFile("shimmer.wav")} volume={0.4} />
      </Sequence>

      {/* ── SFX: Pop on trust badges ── */}
      <Sequence from={384} durationInFrames={15}>
        <Audio src={staticFile("pop.wav")} volume={0.3} />
      </Sequence>
    </AbsoluteFill>
  );
};
