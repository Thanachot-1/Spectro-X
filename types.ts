export interface ColorSpectrumItem {
  name: string;
  value: number; // 0-100
  fill: string; // Hex color code
}

export interface PredictionPhase {
  daysFromNow: number;
  label: string; // e.g., "อีก 2 วัน"
  phase: string; // e.g., "ห่าม", "สุกพอดี", "งอม"
  description: string;
  recommendation: string;
}

export interface DurianAnalysis {
  ripenessPercentage: number;
  status: string; // e.g., "ดิบ", "ห่าม", "สุก", "งอม"
  textureDescription: string;
  spectrumData: ColorSpectrumItem[];
  predictions: PredictionPhase[];
}

export interface AnalysisState {
  isLoading: boolean;
  data: DurianAnalysis | null;
  error: string | null;
}