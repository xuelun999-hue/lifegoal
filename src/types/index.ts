export interface PalmLineFeature {
  length_ratio: number;
  depth: 'shallow' | 'medium' | 'deep';
  curvature: 'straight' | 'slight' | 'moderate' | 'wide';
  clarity: 'faint' | 'clear' | 'prominent';
  color: 'pale' | 'pinkish' | 'red' | 'dark';
  interruptions: number;
  branches: number;
}

export interface LifeLineFeature extends PalmLineFeature {
  start_separation_head_line: number; // 與智慧線起始點的距離
  end_position: 'wrist' | 'middle_palm' | 'upper_palm';
}

export interface HeartLineFeature extends PalmLineFeature {
  end_point: 'under_index_finger' | 'between_index_middle' | 'under_middle_finger' | 'above_middle_finger';
  start_position: 'palm_edge' | 'below_pinky' | 'mount_mercury';
}

export interface HeadLineFeature extends PalmLineFeature {
  slope: 'upward' | 'straight' | 'downward';
  end_position: 'middle_palm' | 'mount_moon' | 'palm_edge';
}

export interface FingerFeature {
  length_ratio: number; // 相對於手掌的比例
  thickness: 'thin' | 'medium' | 'thick';
  flexibility: 'stiff' | 'normal' | 'flexible';
  nail_shape: 'square' | 'round' | 'oval' | 'pointed';
  nail_color: 'pale' | 'pink' | 'red';
}

export interface DetailedPalmFeatures {
  user_id?: string;
  palm_shape: 'square' | 'rectangular' | 'spatulate' | 'conic' | 'psychic';
  palm_size: 'small' | 'medium' | 'large';
  palm_texture: 'smooth' | 'rough' | 'soft' | 'firm';
  palm_color: 'pale' | 'pink' | 'red' | 'yellow';
  
  // 主要掌紋線
  life_line: LifeLineFeature;
  heart_line: HeartLineFeature;
  head_line: HeadLineFeature;
  
  // 次要線條
  fate_line?: PalmLineFeature;
  sun_line?: PalmLineFeature;
  mercury_line?: PalmLineFeature;
  marriage_lines?: PalmLineFeature[];
  
  // 手指特徵
  thumb: FingerFeature;
  index_finger: FingerFeature;
  middle_finger: FingerFeature;
  ring_finger: FingerFeature;
  pinky_finger: FingerFeature;
  
  // 手掌丘陵
  mounts: {
    venus: { prominence: number; texture: string };
    jupiter: { prominence: number; texture: string };
    saturn: { prominence: number; texture: string };
    apollo: { prominence: number; texture: string };
    mercury: { prominence: number; texture: string };
    moon: { prominence: number; texture: string };
    mars_positive: { prominence: number; texture: string };
    mars_negative: { prominence: number; texture: string };
  };
  
  // 特殊記號
  special_marks: Array<{
    type: 'star' | 'cross' | 'triangle' | 'square' | 'island' | 'dot';
    location: string;
    meaning: string;
  }>;
}

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
  detailedFeatures?: DetailedPalmFeatures;
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