export interface PalmFeatures {
  palmCenter: { x: number; y: number };
  palmRadius: number;
  rotationAngle: number;
  keyPoints: Array<{ x: number; y: number; type: string }>;
  roiSquare: {
    topLeft: { x: number; y: number };
    bottomRight: { x: number; y: number };
  };
  confidence: number;
}

export interface AnalysisData {
  handType: string
  personality: string
  career: string
  wealth: string
  health: string
  relationship: string
  confidence: number
  palmPositioning?: {
    features: PalmFeatures;
    quality: {
      isValid: boolean;
      score: number;
      issues: string[];
      suggestions: string[];
    };
  };
}