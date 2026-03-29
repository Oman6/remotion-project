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

const { fontFamily: sans } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});
const { fontFamily: serif } = loadSerif("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

const FAST = { damping: 28, stiffness: 320 };
const SNAP = { damping: 26, stiffness: 260 };
const POP = { damping: 12, stiffness: 200 };

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
  purple: "#7c3aed",
  iGray: "#1c1c1e",
  iGrayLight: "#2c2c2e",
  iBubbleGreen: "#34c759",
  iBubbleGray: "#333336",
};

const bloom = (color: string, i = 1) =>
  `0 0 ${15 * i}px ${color}, 0 0 ${40 * i}px ${color}, 0 0 ${80 * i}px ${color}40`;

const textGlow = (color: string) =>
  `0 0 10px ${color}, 0 0 30px ${color}80, 0 0 60px ${color}40, 0 2px 8px rgba(0,0,0,0.6)`;

// ── Background ──
const GlowBG: React.FC = () => {
  const frame = useCurrentFrame();
  const orbs = [
    { x: 150, y: 500, s: 500, c: "rgba(59,130,246,0.06)", sp: 0.004, ph: 0 },
    { x: 700, y: 1100, s: 550, c: "rgba(212,165,116,0.04)", sp: 0.005, ph: 1.5 },
    { x: 400, y: 1600, s: 400, c: "rgba(124,58,237,0.04)", sp: 0.003, ph: 3 },
  ];
  const ray = interpolate(frame, [0, 450], [-400, 1400]);
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(165deg, #030508 0%, #080e1a 40%, #0a0e1e 70%, #050810 100%)", overflow: "hidden" }}>
      {orbs.map((o, i) => (
        <div key={i} style={{
          position: "absolute", left: o.x + Math.sin(frame * o.sp + o.ph) * 50,
          top: o.y + Math.cos(frame * o.sp + o.ph + 1) * 35,
          width: o.s, height: o.s, borderRadius: "50%",
          background: `radial-gradient(circle, ${o.c} 0%, transparent 65%)`, filter: "blur(35px)",
        }} />
      ))}
      <div style={{
        position: "absolute", top: 0, left: ray, width: 120, height: 2200,
        background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.015) 30%, rgba(255,255,255,0.025) 50%, rgba(255,255,255,0.015) 70%, transparent 100%)",
        transform: "rotate(25deg)", transformOrigin: "top left",
      }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)" }} />
    </div>
  );
};

// ── iMessage bubble component ──
const IMsgBubble: React.FC<{
  text: string;
  isMe: boolean;
  frame: number;
  delay: number;
  fps: number;
}> = ({ text, isMe, frame, delay, fps }) => {
  const msgIn = spring({ frame: frame - delay, fps, config: FAST });
  if (frame < delay) return null;
  return (
    <div style={{
      display: "flex", justifyContent: isMe ? "flex-end" : "flex-start",
      opacity: Math.min(1, msgIn),
      transform: `translateY(${(1 - Math.min(1, msgIn)) * 12}px) scale(${interpolate(msgIn, [0, 0.5, 1], [0.85, 1.02, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
    }}>
      <div style={{
        maxWidth: "80%",
        backgroundColor: isMe ? C.iBubbleGreen : C.iBubbleGray,
        padding: "12px 16px",
        borderRadius: 20,
        ...(isMe ? { borderBottomRightRadius: 6 } : { borderBottomLeftRadius: 6 }),
      }}>
        <div style={{ fontSize: 22, color: "#fff", fontFamily: sans, fontWeight: 400, lineHeight: 1.4 }}>
          {text}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════
// SCENE 1 — POV HOOK (0–40 frames, ~1.3s)
// ════════════════════════════════════════════
const POVHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [30, 39], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const povIn = spring({ frame, fps, config: FAST });
  const lineIn = spring({ frame: frame - 2, fps, config: FAST });
  const subIn = spring({ frame: frame - 5, fps, config: SNAP });

  const glowPulse = Math.sin(frame * 0.2) * 0.05 + 0.1;

  return (
    <AbsoluteFill style={{ opacity: fadeOut, justifyContent: "center", alignItems: "center" }}>
      <div style={{
        position: "absolute", width: 700, height: 700, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(59,130,246,${glowPulse}) 0%, rgba(124,58,237,${glowPulse * 0.5}) 30%, transparent 60%)`,
        filter: "blur(25px)",
      }} />

      <div style={{
        opacity: Math.min(1, povIn), padding: "6px 28px", borderRadius: 10,
        backgroundColor: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
        marginBottom: 18, boxShadow: "0 0 20px rgba(59,130,246,0.1)",
        transform: `scale(${interpolate(povIn, [0, 0.5, 1], [1.8, 0.97, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
      }}>
        <span style={{ fontSize: 20, fontFamily: sans, fontWeight: 800, color: C.blue, letterSpacing: 6, textShadow: "0 0 15px rgba(59,130,246,0.3)" }}>POV</span>
      </div>

      <div style={{ opacity: Math.min(1, lineIn), transform: `translateY(${(1 - lineIn) * 8}px)`, textAlign: "center", maxWidth: 850, padding: "0 50px" }}>
        <div style={{ fontSize: 54, fontFamily: serif, color: C.warm, lineHeight: 1.15, textShadow: "0 0 40px rgba(255,255,255,0.1), 0 4px 20px rgba(0,0,0,0.6)" }}>
          Your landlord tries to
          <br />
          <span style={{ color: C.red, textShadow: textGlow("rgba(239,68,68,0.2)") }}>keep your deposit</span>
        </div>
      </div>

      <div style={{ marginTop: 20, opacity: Math.min(1, subIn), transform: `translateY(${(1 - subIn) * 6}px)` }}>
        <span style={{ fontSize: 26, fontFamily: sans, fontWeight: 600, color: C.offWhite }}>...but you pull up the exact statute 😤</span>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 2 — LANDLORD TEXTS (40–130, ~3s)
// ════════════════════════════════════════════
const LandlordTexts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [80, 89], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const screenIn = spring({ frame, fps, config: FAST });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* Full screen iMessage style */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: 60, bottom: 60,
        backgroundColor: "#000", borderRadius: 0, overflow: "hidden",
        opacity: Math.min(1, screenIn), transform: `scale(${interpolate(screenIn, [0, 1], [0.97, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
        boxShadow: "0 0 60px rgba(0,0,0,0.5), 0 0 20px rgba(59,130,246,0.04)",
        display: "flex", flexDirection: "column",
      }}>
        {/* iMessage nav */}
        <div style={{ padding: "20px 24px 14px", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ fontSize: 18, color: C.blue, fontFamily: sans }}>‹</span>
          <div style={{
            width: 44, height: 44, borderRadius: 22, backgroundColor: "#666",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, color: "#fff", fontFamily: sans, fontWeight: 600,
          }}>JR</div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 600, color: C.white, fontFamily: sans }}>John (Landlord)</div>
            <div style={{ fontSize: 12, color: C.slate, fontFamily: sans }}>iMessage</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, padding: "24px 28px", display: "flex", flexDirection: "column", gap: 14, overflow: "hidden" }}>
          {/* Time stamp */}
          <div style={{ textAlign: "center", fontSize: 12, color: C.slate, fontFamily: sans, fontWeight: 500, marginBottom: 6 }}>Today 2:34 PM</div>

          <IMsgBubble text="Hey, about your security deposit — I'm keeping it for damages." isMe={false} frame={frame} delay={3} fps={fps} />
          <IMsgBubble text="There were scuffs on the walls and the carpet needed cleaning." isMe={false} frame={frame} delay={12} fps={fps} />
          <IMsgBubble text="Wait what? I lived there for 3 years, that's normal wear and tear" isMe={true} frame={frame} delay={22} fps={fps} />
          <IMsgBubble text="Not my problem. The deposit is mine." isMe={false} frame={frame} delay={32} fps={fps} />

          {/* Panicked reaction */}
          {frame >= 40 && (() => {
            const rIn = spring({ frame: frame - 40, fps, config: POP });
            return (
              <div style={{ textAlign: "center", opacity: Math.min(1, rIn), transform: `scale(${rIn})`, marginTop: 8 }}>
                <span style={{ fontSize: 14, fontFamily: sans, fontWeight: 600, color: C.slate, backgroundColor: "rgba(255,255,255,0.06)", padding: "6px 16px", borderRadius: 12 }}>
                  😰 You start typing... then stop.
                </span>
              </div>
            );
          })()}

          {/* "Opens CaseMate" overlay */}
          {frame >= 55 && (() => {
            const oIn = spring({ frame: frame - 55, fps, config: POP });
            return (
              <div style={{
                position: "absolute", bottom: 180, left: 0, right: 0, textAlign: "center",
                opacity: Math.min(1, oIn), transform: `scale(${oIn}) translateY(${(1 - oIn) * 10}px)`,
              }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 28px",
                  borderRadius: 50, backgroundColor: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)",
                  boxShadow: "0 0 30px rgba(59,130,246,0.12)",
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, fontWeight: 800, color: "#fff", fontFamily: sans,
                  }}>CM</div>
                  <span style={{ fontSize: 18, fontFamily: sans, fontWeight: 700, color: C.blueLight, textShadow: "0 0 10px rgba(59,130,246,0.2)" }}>
                    Opens CaseMate...
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 3 — CASEMATE SCAN (130–270, ~4.7s)
// ════════════════════════════════════════════
const CasemateScan: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [128, 139], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const screenIn = spring({ frame, fps, config: FAST });

  // Paste animation
  const pasteIn = spring({ frame: frame - 5, fps, config: SNAP });

  // "Analyzing" progress
  const analyzeStart = 18;
  const analyzeProgress = interpolate(frame, [analyzeStart, analyzeStart + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const analyzeDone = frame >= analyzeStart + 22;

  // Results
  const resultStart = analyzeStart + 24;
  const r1 = spring({ frame: frame - resultStart, fps, config: SNAP });
  const r2 = spring({ frame: frame - resultStart - 8, fps, config: SNAP });
  const r3 = spring({ frame: frame - resultStart - 16, fps, config: POP });
  const r4 = spring({ frame: frame - resultStart - 26, fps, config: POP });

  // Phone border glow
  const borderGlow = Math.sin(frame * 0.07) * 0.12 + 0.2;

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
      {/* Phone */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: 60, bottom: 60,
        borderRadius: 0, backgroundColor: "#060912",
        border: `2px solid rgba(59,130,246,${borderGlow * 0.3})`,
        overflow: "hidden", display: "flex", flexDirection: "column",
        opacity: Math.min(1, screenIn),
        boxShadow: `0 0 ${30 * borderGlow}px rgba(59,130,246,${borderGlow * 0.1}), 0 0 ${60 * borderGlow}px rgba(59,130,246,${borderGlow * 0.05}), 0 40px 100px rgba(0,0,0,0.5)`,
      }}>
        {/* Status */}
        <div style={{ padding: "14px 24px 8px", display: "flex", justifyContent: "space-between", fontSize: 13, color: C.slate, fontFamily: sans, fontWeight: 600 }}>
          <span>9:41</span><span>●●●</span>
        </div>

        {/* App header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg, #2563eb, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff", fontFamily: sans, boxShadow: "0 0 12px rgba(59,130,246,0.3)" }}>CM</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.white, fontFamily: sans }}>CaseMate AI</div>
          <div style={{ marginLeft: "auto", fontSize: 11, color: C.green, fontFamily: sans, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: C.green, boxShadow: "0 0 6px rgba(34,197,94,0.5)" }} />Analyzing
          </div>
        </div>

        {/* Chat */}
        <div style={{ flex: 1, padding: "20px 24px", overflow: "hidden", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Pasted message */}
          <div style={{
            opacity: Math.min(1, pasteIn), transform: `translateY(${(1 - pasteIn) * 10}px)`,
            display: "flex", justifyContent: "flex-end",
          }}>
            <div style={{
              maxWidth: "88%", backgroundColor: C.blue, padding: "14px 18px", borderRadius: "18px 18px 4px 18px",
              boxShadow: "0 0 15px rgba(59,130,246,0.15)",
            }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontFamily: sans, fontWeight: 600, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" as const }}>
                📋 Pasted from Messages
              </div>
              <div style={{ fontSize: 19, color: "#fff", fontFamily: sans, lineHeight: 1.4, fontWeight: 400 }}>
                "About your security deposit — I'm keeping it for damages. Scuffs on walls, carpet needed cleaning. Not my problem."
              </div>
            </div>
          </div>

          {/* Analyzing bar */}
          {frame >= analyzeStart && !analyzeDone && (
            <div style={{ padding: "8px 0" }}>
              <div style={{ fontSize: 12, color: C.blue, fontFamily: sans, fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.blue, opacity: Math.sin(frame * 0.5) * 0.4 + 0.6, boxShadow: `0 0 6px ${C.blue}50` }} />
                Scanning Massachusetts tenant law...
              </div>
              <div style={{ width: "100%", height: 3, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <div style={{ width: `${analyzeProgress * 100}%`, height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${C.blue}, ${C.purple})`, boxShadow: `0 0 8px ${C.blue}40` }} />
              </div>
            </div>
          )}

          {/* Results */}
          {analyzeDone && (
            <div style={{ display: "flex", opacity: Math.min(1, r1), transform: `translateY(${(1 - Math.min(1, r1)) * 8}px)` }}>
              <div style={{ maxWidth: "95%", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "18px 18px 18px 4px", padding: "14px 16px" }}>
                {/* Verdict */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{ padding: "4px 12px", borderRadius: 8, backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <span style={{ fontSize: 12, fontFamily: sans, fontWeight: 700, color: C.red }}>⚠️ VIOLATION FOUND</span>
                  </div>
                </div>

                <div style={{ fontSize: 18, color: C.offWhite, fontFamily: sans, lineHeight: 1.5, marginBottom: 14 }}>
                  Your landlord <span style={{ color: C.red, fontWeight: 700 }}>cannot</span> keep your deposit for normal wear and tear. Scuffs and carpet cleaning after 3 years are <span style={{ color: C.goldLight, fontWeight: 600 }}>explicitly excluded</span>.
                </div>

                {/* Statute */}
                {frame >= resultStart + 8 && (
                  <div style={{
                    padding: "12px 14px", backgroundColor: "rgba(212,165,116,0.06)", borderRadius: 12, borderLeft: `3px solid ${C.gold}`,
                    opacity: Math.min(1, r2), transform: `translateY(${(1 - Math.min(1, r2)) * 6}px)`,
                    boxShadow: "0 0 12px rgba(212,165,116,0.04)", marginBottom: 10,
                  }}>
                    <div style={{ fontSize: 10, color: C.slate, fontFamily: sans, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" as const, marginBottom: 2 }}>Exact statute</div>
                    <div style={{ fontSize: 22, color: C.goldLight, fontFamily: sans, fontWeight: 700, textShadow: "0 0 10px rgba(212,165,116,0.12)" }}>M.G.L. c.186 §15B(4)</div>
                    <div style={{ fontSize: 14, color: C.offWhite, fontFamily: sans, marginTop: 3 }}>
                      "Normal wear and tear shall not be charged to the tenant"
                    </div>
                  </div>
                )}

                {/* Damages */}
                {frame >= resultStart + 16 && (
                  <div style={{
                    padding: "12px 14px", backgroundColor: "rgba(34,197,94,0.05)", borderRadius: 12, borderLeft: `3px solid ${C.green}`,
                    opacity: Math.min(1, r3), transform: `scale(${r3})`, marginBottom: 10,
                  }}>
                    <div style={{ fontSize: 10, color: C.slate, fontFamily: sans, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" as const, marginBottom: 2 }}>You're owed</div>
                    <div style={{ fontSize: 36, color: C.green, fontFamily: sans, fontWeight: 800, textShadow: textGlow("rgba(34,197,94,0.15)") }}>
                      ${Math.round(interpolate(Math.min(1, r3), [0, 1], [0, 4500])).toLocaleString()}
                    </div>
                    <div style={{ fontSize: 14, color: C.greenLight, fontFamily: sans, fontWeight: 500, marginTop: 2 }}>Triple damages — they lose.</div>
                  </div>
                )}

                {/* Generate reply button */}
                {frame >= resultStart + 26 && (
                  <div style={{ opacity: Math.min(1, r4), transform: `scale(${r4})` }}>
                    <div style={{
                      background: "linear-gradient(135deg, #2563eb, #4338ca)", borderRadius: 14, padding: "13px 18px", textAlign: "center",
                      boxShadow: bloom(C.blue, 0.3) + ", 0 4px 15px rgba(0,0,0,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}>
                      <span style={{ fontSize: 16 }}>💬</span>
                      <span style={{ fontSize: 19, fontFamily: sans, fontWeight: 700, color: "#fff" }}>Generate Reply to Landlord</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 4 — CLAP BACK (270–360, 3s)
// ════════════════════════════════════════════
const ClapBack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [78, 89], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const screenIn = spring({ frame, fps, config: FAST });

  // Messages
  const msg1 = spring({ frame: frame - 5, fps, config: FAST });
  const msg2 = spring({ frame: frame - 16, fps, config: FAST });
  const msg3 = spring({ frame: frame - 28, fps, config: SNAP });
  const delivered = spring({ frame: frame - 35, fps, config: SNAP });

  // Landlord "typing" then silence
  const dotsShow = frame >= 42 && frame < 56;
  const readShow = frame >= 56;
  const readIn = spring({ frame: frame - 56, fps, config: SNAP });

  // "Silence" label
  const silenceIn = spring({ frame: frame - 62, fps, config: POP });

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
      <div style={{
        position: "absolute", left: 0, right: 0, top: 60, bottom: 60,
        backgroundColor: "#000", borderRadius: 0, overflow: "hidden",
        opacity: Math.min(1, screenIn), display: "flex", flexDirection: "column",
        boxShadow: "0 0 60px rgba(0,0,0,0.5), 0 0 20px rgba(34,197,94,0.06)",
      }}>
        {/* Nav */}
        <div style={{ padding: "20px 24px 14px", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ fontSize: 18, color: C.blue, fontFamily: sans }}>‹</span>
          <div style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#666", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff", fontFamily: sans, fontWeight: 600 }}>JR</div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 600, color: C.white, fontFamily: sans }}>John (Landlord)</div>
            <div style={{ fontSize: 12, color: C.slate, fontFamily: sans }}>iMessage</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, padding: "24px 28px", display: "flex", flexDirection: "column", gap: 14, overflow: "hidden" }}>
          <div style={{ textAlign: "center", fontSize: 12, color: C.slate, fontFamily: sans, fontWeight: 500, marginBottom: 6 }}>Today 2:41 PM</div>

          {/* User's clap back */}
          {frame >= 5 && (
            <div style={{ display: "flex", justifyContent: "flex-end", opacity: Math.min(1, msg1), transform: `translateY(${(1 - Math.min(1, msg1)) * 10}px) scale(${interpolate(msg1, [0, 0.5, 1], [0.85, 1.02, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})` }}>
              <div style={{ maxWidth: "85%", backgroundColor: C.iBubbleGreen, padding: "12px 16px", borderRadius: "20px 20px 6px 20px" }}>
                <div style={{ fontSize: 17, color: "#fff", fontFamily: sans, lineHeight: 1.35 }}>
                  Hi John. Under M.G.L. c.186 §15B, you cannot deduct for normal wear and tear — which includes scuffs and carpet cleaning after a 3-year tenancy.
                </div>
              </div>
            </div>
          )}

          {frame >= 16 && (
            <div style={{ display: "flex", justifyContent: "flex-end", opacity: Math.min(1, msg2), transform: `translateY(${(1 - Math.min(1, msg2)) * 10}px) scale(${interpolate(msg2, [0, 0.5, 1], [0.85, 1.02, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})` }}>
              <div style={{ maxWidth: "85%", backgroundColor: C.iBubbleGreen, padding: "12px 16px", borderRadius: "20px 20px 6px 20px" }}>
                <div style={{ fontSize: 17, color: "#fff", fontFamily: sans, lineHeight: 1.35 }}>
                  You had 30 days to return it. It's been 45. I'm now entitled to 3x damages — that's $4,500.
                </div>
              </div>
            </div>
          )}

          {frame >= 28 && (
            <div style={{ display: "flex", justifyContent: "flex-end", opacity: Math.min(1, msg3), transform: `translateY(${(1 - Math.min(1, msg3)) * 10}px) scale(${interpolate(msg3, [0, 0.5, 1], [0.85, 1.02, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})` }}>
              <div style={{ maxWidth: "85%", backgroundColor: C.iBubbleGreen, padding: "12px 16px", borderRadius: "20px 20px 6px 20px" }}>
                <div style={{ fontSize: 17, color: "#fff", fontFamily: sans, lineHeight: 1.35 }}>
                  I've attached a formal demand letter. Please respond within 7 days.
                </div>
              </div>
            </div>
          )}

          {/* Delivered */}
          {frame >= 35 && (
            <div style={{ textAlign: "right", opacity: Math.min(1, delivered), fontSize: 11, color: C.slate, fontFamily: sans, fontWeight: 500, paddingRight: 4 }}>
              Delivered
            </div>
          )}

          {/* Landlord typing dots */}
          {dotsShow && (
            <div style={{ display: "flex" }}>
              <div style={{ backgroundColor: C.iBubbleGray, padding: "12px 18px", borderRadius: "20px 20px 20px 6px", display: "flex", gap: 5 }}>
                {[0, 1, 2].map(d => <div key={d} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#999", opacity: Math.sin(frame * 0.5 + d * 1.2) * 0.4 + 0.6 }} />)}
              </div>
            </div>
          )}

          {/* Read receipt */}
          {readShow && (
            <div style={{ textAlign: "right", opacity: Math.min(1, readIn), fontSize: 11, color: C.blue, fontFamily: sans, fontWeight: 500, paddingRight: 4 }}>
              Read 2:42 PM
            </div>
          )}

          {/* Silence label */}
          {frame >= 62 && (
            <div style={{ textAlign: "center", marginTop: 20, opacity: Math.min(1, silenceIn), transform: `scale(${silenceIn})` }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 24px", borderRadius: 50,
                backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
                boxShadow: "0 0 20px rgba(34,197,94,0.08)",
              }}>
                <span style={{ fontSize: 22 }}>🤐</span>
                <span style={{ fontSize: 18, fontFamily: sans, fontWeight: 700, color: C.green, textShadow: "0 0 10px rgba(34,197,94,0.15)" }}>Radio silence.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// SCENE 5 — CTA (360–450, 3s)
// ════════════════════════════════════════════
const CTAScene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: POP });
  const tagIn = spring({ frame: frame - 4, fps, config: FAST });
  const lineIn = spring({ frame: frame - 8, fps, config: SNAP });
  const btnIn = spring({ frame: frame - 14, fps, config: POP });
  const badgesIn = spring({ frame: frame - 20, fps, config: SNAP });

  const btnScale = interpolate(btnIn, [0, 0.7, 1], [0.8, 1.06, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = Math.sin((frame - 16) * 0.12) * 0.012 * Math.min(1, btnIn);
  const ctaGlow = Math.sin(frame * 0.06) * 0.06 + 0.14;
  const ctaGlow2 = Math.sin(frame * 0.08 + 1) * 0.04 + 0.08;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20 }}>
      <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle, rgba(212,165,116,${ctaGlow}) 0%, transparent 55%)`, filter: "blur(25px)" }} />
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, rgba(59,130,246,${ctaGlow2}) 0%, transparent 55%)`, filter: "blur(20px)" }} />

      <Img src={staticFile("casemate_instagram_logo.png")} style={{
        width: 140, height: 140, borderRadius: 22, opacity: Math.min(1, logoIn), transform: `scale(${logoIn})`,
        boxShadow: `0 0 40px rgba(59,130,246,0.25), 0 0 80px rgba(59,130,246,0.12), 0 0 30px rgba(212,165,116,0.15), 0 20px 50px rgba(0,0,0,0.5)`,
      }} />

      <div style={{
        fontSize: 46, fontFamily: serif, color: C.warm, opacity: Math.min(1, tagIn),
        transform: `translateY(${(1 - tagIn) * 10}px)`, textAlign: "center", lineHeight: 1.2,
        textShadow: "0 0 30px rgba(255,255,255,0.12), 0 4px 20px rgba(0,0,0,0.6)",
      }}>
        Know your rights.
        <br />
        <span style={{ color: C.goldLight, textShadow: textGlow("rgba(212,165,116,0.2)") }}>Fight back.</span>
      </div>

      <div style={{
        width: interpolate(Math.min(1, lineIn), [0, 1], [0, 200]), height: 2,
        background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
        opacity: Math.min(1, lineIn), boxShadow: `0 0 12px ${C.gold}40`,
      }} />

      <div style={{
        marginTop: 4, fontSize: 28, fontWeight: 700, color: "#fff",
        background: "linear-gradient(135deg, #2563eb, #4338ca)",
        padding: "18px 56px", borderRadius: 50, fontFamily: sans, opacity: Math.min(1, btnIn),
        transform: `scale(${btnScale + pulse})`,
        boxShadow: bloom(C.blue, 0.4) + `, 0 8px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)`,
        letterSpacing: 1,
      }}>
        Try CaseMate Free
      </div>

      <div style={{ display: "flex", gap: 14, marginTop: 8, opacity: Math.min(1, badgesIn), transform: `translateY(${(1 - badgesIn) * 8}px)` }}>
        {["No credit card", "Real citations", "50 states"].map(b => (
          <div key={b} style={{
            fontSize: 13, color: C.blueLight, fontFamily: sans, fontWeight: 600,
            padding: "6px 14px", backgroundColor: "rgba(59,130,246,0.06)",
            border: "1px solid rgba(59,130,246,0.12)", borderRadius: 10, letterSpacing: 0.5,
            boxShadow: "0 0 12px rgba(59,130,246,0.06)", textShadow: "0 0 8px rgba(59,130,246,0.15)",
          }}>{b}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════
export const CaseMatePromo3: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: sans }}>
      <GlowBG />
      <Sequence from={0} durationInFrames={40}><POVHook /></Sequence>
      <Sequence from={40} durationInFrames={90} premountFor={10}><LandlordTexts /></Sequence>
      <Sequence from={130} durationInFrames={140} premountFor={10}><CasemateScan /></Sequence>
      <Sequence from={270} durationInFrames={90} premountFor={10}><ClapBack /></Sequence>
      <Sequence from={360} durationInFrames={90} premountFor={10}><CTAScene3 /></Sequence>
    </AbsoluteFill>
  );
};
