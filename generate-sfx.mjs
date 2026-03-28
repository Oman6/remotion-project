// Generate sound effect WAV files programmatically
import { writeFileSync } from "fs";

function createWav(samples, sampleRate = 44100) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = samples.length * (bitsPerSample / 8);
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  return buffer;
}

// 1. WHOOSH — swept noise burst (for scene transitions)
function generateWhoosh(duration = 0.25, sampleRate = 44100) {
  const len = Math.floor(duration * sampleRate);
  const samples = new Float64Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / sampleRate;
    const progress = i / len;
    // Bandpass-like filtered noise with frequency sweep
    const freq = 200 + progress * 3000;
    const noise = (Math.random() * 2 - 1);
    const carrier = Math.sin(2 * Math.PI * freq * t);
    const env = Math.sin(progress * Math.PI) * Math.exp(-progress * 2);
    samples[i] = noise * carrier * env * 0.7;
  }
  return samples;
}

// 2. POP — short tonal click (for elements popping in)
function generatePop(duration = 0.08, sampleRate = 44100) {
  const len = Math.floor(duration * sampleRate);
  const samples = new Float64Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / sampleRate;
    const progress = i / len;
    const freq = 800 * Math.exp(-progress * 8);
    const env = Math.exp(-progress * 15);
    samples[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.8;
  }
  return samples;
}

// 3. IMPACT — low thud with subtle rumble (for big reveals like $300, logo)
function generateImpact(duration = 0.35, sampleRate = 44100) {
  const len = Math.floor(duration * sampleRate);
  const samples = new Float64Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / sampleRate;
    const progress = i / len;
    const freq = 60 + 40 * Math.exp(-progress * 6);
    const env = Math.exp(-progress * 5);
    const sub = Math.sin(2 * Math.PI * freq * t) * env;
    const click = Math.exp(-progress * 40) * Math.sin(2 * Math.PI * 2000 * t) * 0.3;
    samples[i] = (sub * 0.8 + click) * 0.9;
  }
  return samples;
}

// 4. SHIMMER — rising sparkle (for glow/badge reveals)
function generateShimmer(duration = 0.3, sampleRate = 44100) {
  const len = Math.floor(duration * sampleRate);
  const samples = new Float64Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / sampleRate;
    const progress = i / len;
    const freq1 = 2000 + progress * 3000;
    const freq2 = 3000 + progress * 4000;
    const env = Math.sin(progress * Math.PI) * Math.exp(-progress * 1.5);
    samples[i] = (Math.sin(2 * Math.PI * freq1 * t) * 0.4 +
                  Math.sin(2 * Math.PI * freq2 * t) * 0.3 +
                  Math.sin(2 * Math.PI * freq1 * 1.5 * t) * 0.2) * env * 0.5;
  }
  return samples;
}

// 5. SWIPE — quick directional sweep (for cards fanning in)
function generateSwipe(duration = 0.15, sampleRate = 44100) {
  const len = Math.floor(duration * sampleRate);
  const samples = new Float64Array(len);
  for (let i = 0; i < len; i++) {
    const progress = i / len;
    const noise = Math.random() * 2 - 1;
    const env = Math.sin(progress * Math.PI);
    const filter = Math.sin(progress * Math.PI * 4);
    samples[i] = noise * env * filter * 0.4;
  }
  return samples;
}

// Generate and write files
const sfx = {
  "whoosh.wav": generateWhoosh(),
  "pop.wav": generatePop(),
  "impact.wav": generateImpact(),
  "shimmer.wav": generateShimmer(),
  "swipe.wav": generateSwipe(),
};

for (const [name, samples] of Object.entries(sfx)) {
  writeFileSync(`public/${name}`, createWav(samples));
  console.log(`Generated ${name} (${samples.length} samples)`);
}

console.log("Done!");
