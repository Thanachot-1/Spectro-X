import { DurianAnalysis } from "../types";

// Browser-friendly mock implementation of analyzeDurianImage.
// Replace this with a server-side call to Google Gemini / GenAI in production.

const SPECTRUM_CHANNELS = [
  410, 435, 460, 485, 510, 535,
  560, 585, 610, 645, 680, 705,
  730, 760, 810, 860, 900, 940
];

const getWavelengthColor = (nm: number) => {
  if (nm < 450) return '#3b82f6';
  if (nm < 500) return '#06b6d4';
  if (nm < 570) return '#22c55e';
  if (nm < 600) return '#eab308';
  if (nm < 700) return '#ef4444';
  return '#7f1d1d';
};

// Simple deterministic pseudo-random based on string to keep responses stable
const hashToNumber = (s: string, max = 100) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h) % max;
};

export const analyzeDurianImage = async (base64Image: string): Promise<DurianAnalysis> => {
  // Simulate network / processing delay
  await new Promise(res => setTimeout(res, 700));

  const seed = base64Image.slice(0, 100);
  const baseRipeness = 30 + (hashToNumber(seed, 70)); // 30-99

  const spectrumData = SPECTRUM_CHANNELS.map((nm, idx) => {
    // create values that trend upward with ripeness for mid wavelengths
    const base = Math.round((Math.sin(idx / 3 + (hashToNumber(seed, 10) / 10)) + 1) * 40);
    const shift = Math.max(0, Math.round((baseRipeness - 50) / 10) * 5);
    const value = Math.max(0, Math.min(100, base + shift + (Math.random() * 8 - 4)));
    return {
      name: `${nm}nm`,
      value: Math.round(value * 10) / 10,
      fill: getWavelengthColor(nm)
    };
  });

  // Sort just in case
  spectrumData.sort((a, b) => parseInt(a.name) - parseInt(b.name));

  const predictions = Array.from({ length: 5 }).map((_, i) => {
    const days = i + 1;
    const ripeness = Math.min(100, Math.round(baseRipeness + days * 2 + hashToNumber(seed + i, 3)));
    let phase = 'สุกพอดี';
    if (ripeness < 40) phase = 'ดิบ';
    else if (ripeness < 60) phase = 'ห่าม';
    else if (ripeness < 85) phase = 'สุกพอดี';
    else phase = 'งอม';

    return {
      daysFromNow: days,
      label: `อีก ${days} วัน`,
      phase,
      description: `คาดว่าอยู่ในสภาพ: ${phase}`,
      recommendation: phase === 'สุกพอดี' ? 'พร้อมบริโภค' : 'รออีกเล็กน้อย'
    };
  });

  const result: DurianAnalysis = {
    ripenessPercentage: Math.round(baseRipeness),
    status: baseRipeness < 40 ? 'ดิบ' : baseRipeness < 60 ? 'ห่าม' : baseRipeness < 85 ? 'สุก' : 'งอม',
    textureDescription: 'ผิวเรียบ มีความนุ่มปานกลาง',
    spectrumData,
    predictions
  };

  return result;
};