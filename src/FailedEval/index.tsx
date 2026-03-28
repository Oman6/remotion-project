import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Sora";
import { GridBackground } from "./GridBackground";
import { AnimatedText } from "./AnimatedText";
import { StatCounter } from "./StatCounter";

const { fontFamily } = loadFont();

const ACCENT = "#22c55e";
const BG = "#0a0a0a";

// ────────────────────────────────────────────
// HOOK (0–3s / frames 0–89)
// "I failed 4 prop firm evals."
// ────────────────────────────────────────────
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeOut = interpolate(frame, [70, 89], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      <AnimatedText
        text="I failed 4 prop firm evals."
        fontSize={72}
        highlightWords={["4"]}
        highlightColor={ACCENT}
        staggerFrames={4}
      />
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────
// BEAT (3–6s / frames 90–179)
// "Then I stopped trading manually."
// ────────────────────────────────────────────
const BeatScene: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeOut = interpolate(frame, [70, 89], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      <AnimatedText
        text="Then I stopped trading manually."
        fontSize={64}
        highlightWords={["manually"]}
        highlightColor={ACCENT}
        staggerFrames={5}
      />
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────
// PROOF (6–11s / frames 180–329)
// Animated stat counters
// ────────────────────────────────────────────
const ProofScene: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeOut = interpolate(frame, [130, 149], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
        flexDirection: "column",
        gap: 30,
      }}
    >
      <StatCounter
        value={84.6}
        suffix="%"
        label="Win Rate"
        delay={0}
        decimals={1}
      />
      <StatCounter
        value={449}
        label="Trades"
        delay={30}
        decimals={0}
      />
      <StatCounter
        value={65}
        prefix="$"
        suffix="K"
        label="Backtest Profit"
        delay={60}
        decimals={0}
      />
      <StatCounter
        value={2.35}
        label="Profit Factor"
        delay={90}
        decimals={2}
      />
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────
// MIDDLE (11–13s / frames 330–389)
// "The algo doesn't flinch..."
// ────────────────────────────────────────────
const MiddleScene: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeOut = interpolate(frame, [45, 59], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
        flexDirection: "column",
        gap: 24,
      }}
    >
      <AnimatedText
        text="The algo doesn't flinch."
        fontSize={56}
        delay={0}
        staggerFrames={4}
      />
      <AnimatedText
        text="No revenge trades. No hesitation."
        fontSize={46}
        color="#cccccc"
        delay={15}
        staggerFrames={4}
      />
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────
// CTA (13–15s / frames 390–449)
// novaalgos.com — "Get the Bot"
// ────────────────────────────────────────────
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const urlProgress = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const buttonProgress = spring({
    frame: frame - 12,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const buttonScale = interpolate(
    buttonProgress,
    [0, 0.7, 1],
    [0.8, 1.06, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );

  // Subtle continuous pulse on the button
  const pulse =
    Math.sin((frame - 20) * 0.15) * 0.03 *
    Math.min(1, buttonProgress);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 36,
      }}
    >
      {/* URL */}
      <div
        style={{
          fontSize: 54,
          fontWeight: 700,
          color: ACCENT,
          fontFamily: "Sora, sans-serif",
          opacity: Math.min(1, urlProgress),
          transform: `translateY(${(1 - urlProgress) * 30}px)`,
        }}
      >
        novaalgos.com
      </div>

      {/* Button */}
      <div
        style={{
          fontSize: 34,
          fontWeight: 700,
          color: BG,
          backgroundColor: ACCENT,
          padding: "18px 52px",
          borderRadius: 50,
          fontFamily: "Sora, sans-serif",
          opacity: Math.min(1, buttonProgress),
          transform: `scale(${buttonScale + pulse})`,
          boxShadow: `0 0 40px rgba(34, 197, 94, ${0.3 * Math.min(1, buttonProgress)})`,
        }}
      >
        Get the Bot
      </div>
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────
// MAIN COMPOSITION
// ────────────────────────────────────────────
export const FailedEval: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily }}>
      <GridBackground />

      <Sequence from={0} durationInFrames={90}>
        <HookScene />
      </Sequence>

      <Sequence from={90} durationInFrames={90}>
        <BeatScene />
      </Sequence>

      <Sequence from={180} durationInFrames={150}>
        <ProofScene />
      </Sequence>

      <Sequence from={330} durationInFrames={60}>
        <MiddleScene />
      </Sequence>

      <Sequence from={390} durationInFrames={60}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
