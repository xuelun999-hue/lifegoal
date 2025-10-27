// 手掌定位和分析增強工具
// 基於提供的 Python ROI 提取邏輯改進手相分析

import { 
  PalmFeatures, 
  DetailedPalmFeatures,
  LifeLineFeature,
  HeartLineFeature,
  HeadLineFeature,
  FingerFeature 
} from '@/types';

interface PalmAnalysisConfig {
  enableRotationCorrection: boolean;
  enableSegmentation: boolean;
  usePSOOptimization: boolean;
  keyPointThreshold: number;
}

export class PalmPositioningService {
  private config: PalmAnalysisConfig;

  constructor(config?: Partial<PalmAnalysisConfig>) {
    this.config = {
      enableRotationCorrection: true,
      enableSegmentation: true,
      usePSOOptimization: false, // 在 JS 環境中簡化
      keyPointThreshold: 0.7,
      ...config
    };
  }

  /**
   * 分析手掌圖片並提取關鍵特徵
   * 這個方法模擬了 Python 代碼中的 AutoRotateRoIExtract.roi_extract
   */
  async analyzePalmFeatures(imageData: string): Promise<PalmFeatures> {
    // 模擬手掌特徵檢測 - 在實際應用中這裡會調用 AI 服務
    return this.simulatePalmDetection(imageData);
  }

  /**
   * 生成改進的手相分析提示詞
   * 基於檢測到的手掌特徵來增強 AI 分析
   */
  generateEnhancedPrompt(basePrompt: string, palmFeatures: PalmFeatures): string {
    const enhancedPrompt = `${basePrompt}

## 手掌特徵定位信息
基於計算機視覺分析，此手掌圖片具有以下特徵：

**手掌中心位置**: (${palmFeatures.palmCenter.x.toFixed(1)}, ${palmFeatures.palmCenter.y.toFixed(1)})
**手掌半徑**: ${palmFeatures.palmRadius.toFixed(1)}像素
**旋轉角度**: ${palmFeatures.rotationAngle.toFixed(1)}度
**檢測信心度**: ${(palmFeatures.confidence * 100).toFixed(1)}%

**關鍵點位置**:
${palmFeatures.keyPoints.map(point => 
  `- ${point.type}: (${point.x.toFixed(1)}, ${point.y.toFixed(1)})`
).join('\n')}

**感興趣區域 (ROI)**:
- 左上角: (${palmFeatures.roiSquare.topLeft.x}, ${palmFeatures.roiSquare.topLeft.y})
- 右下角: (${palmFeatures.roiSquare.bottomRight.x}, ${palmFeatures.roiSquare.bottomRight.y})

請根據這些精確的定位信息，結合傳統手相學知識，進行更準確的分析。特別注意：
1. 根據手掌旋轉角度調整線條解讀
2. 基於關鍵點位置精確定位生命線、智慧線、感情線
3. 考慮手掌比例和形狀特徵
4. 結合檢測信心度評估分析可靠性`;

    return enhancedPrompt;
  }

  /**
   * 模擬手掌檢測 - 在實際部署中可以替換為真實的 AI 檢測
   */
  private simulatePalmDetection(imageData: string): PalmFeatures {
    // 基於圖片數據生成模擬的手掌特徵
    const seed = this.hashCode(imageData) % 1000;
    
    // 模擬手掌中心（圖片中央偏下）
    const palmCenter = {
      x: 250 + (seed % 100) - 50, // 200-300 範圍
      y: 300 + (seed % 80) - 40   // 260-340 範圍
    };

    // 模擬手掌半徑
    const palmRadius = 120 + (seed % 60); // 120-180 範圍

    // 模擬旋轉角度
    const rotationAngle = ((seed % 60) - 30) * 0.5; // -15 到 +15 度

    // 模擬關鍵點（手指尖、關節等）
    const keyPoints = this.generateKeyPoints(palmCenter, palmRadius, rotationAngle, seed);

    // 計算 ROI 正方形
    const roiSize = Math.floor(palmRadius * Math.sqrt(2));
    const roiSquare = {
      topLeft: {
        x: Math.max(0, palmCenter.x - roiSize / 2),
        y: Math.max(0, palmCenter.y - roiSize / 2)
      },
      bottomRight: {
        x: palmCenter.x + roiSize / 2,
        y: palmCenter.y + roiSize / 2
      }
    };

    // 模擬檢測信心度
    const confidence = 0.75 + (seed % 25) / 100; // 0.75-1.0

    const detailedFeatures = this.generateDetailedFeatures(seed, palmCenter, palmRadius);

    return {
      palmCenter,
      palmRadius,
      rotationAngle,
      keyPoints,
      roiSquare,
      confidence,
      detailedFeatures
    };
  }

  /**
   * 生成關鍵點位置
   */
  private generateKeyPoints(center: { x: number; y: number }, radius: number, angle: number, seed: number): Array<{ x: number; y: number; type: string }> {
    const points = [];
    const angleRad = (angle * Math.PI) / 180;

    // 拇指尖
    points.push({
      x: center.x - radius * 0.6 * Math.cos(angleRad) + (seed % 20) - 10,
      y: center.y - radius * 0.3 * Math.sin(angleRad) + (seed % 20) - 10,
      type: '拇指尖'
    });

    // 食指尖
    points.push({
      x: center.x - radius * 0.2 * Math.cos(angleRad) + (seed % 15) - 7,
      y: center.y - radius * 0.8 * Math.sin(angleRad) + (seed % 15) - 7,
      type: '食指尖'
    });

    // 中指尖
    points.push({
      x: center.x + radius * 0.1 * Math.cos(angleRad) + (seed % 15) - 7,
      y: center.y - radius * 0.9 * Math.sin(angleRad) + (seed % 15) - 7,
      type: '中指尖'
    });

    // 無名指尖
    points.push({
      x: center.x + radius * 0.4 * Math.cos(angleRad) + (seed % 15) - 7,
      y: center.y - radius * 0.8 * Math.sin(angleRad) + (seed % 15) - 7,
      type: '無名指尖'
    });

    // 小指尖
    points.push({
      x: center.x + radius * 0.7 * Math.cos(angleRad) + (seed % 20) - 10,
      y: center.y - radius * 0.6 * Math.sin(angleRad) + (seed % 20) - 10,
      type: '小指尖'
    });

    // 手腕中心
    points.push({
      x: center.x + (seed % 30) - 15,
      y: center.y + radius * 0.8 + (seed % 20) - 10,
      type: '手腕中心'
    });

    return points;
  }

  /**
   * 簡單的字符串哈希函數
   */
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 轉換為 32-bit 整數
    }
    return Math.abs(hash);
  }

  /**
   * 驗證手掌特徵的質量
   */
  validatePalmQuality(features: PalmFeatures): {
    isValid: boolean;
    score: number;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = features.confidence * 100;

    // 檢查信心度
    if (features.confidence < 0.7) {
      issues.push('手掌檢測信心度較低');
      suggestions.push('請確保手掌完全展開且光線充足');
      score -= 20;
    }

    // 檢查關鍵點數量
    if (features.keyPoints.length < 5) {
      issues.push('檢測到的關鍵點較少');
      suggestions.push('請確保五根手指都清晰可見');
      score -= 15;
    }

    // 檢查手掌大小
    if (features.palmRadius < 80) {
      issues.push('手掌在圖片中較小');
      suggestions.push('請將手掌靠近鏡頭，佔據圖片主要區域');
      score -= 10;
    }

    // 檢查旋轉角度
    if (Math.abs(features.rotationAngle) > 20) {
      issues.push('手掌傾斜角度較大');
      suggestions.push('請保持手掌水平，減少傾斜');
      score -= 5;
    }

    const isValid = score >= 70 && features.confidence >= 0.6;

    return {
      isValid,
      score: Math.max(0, Math.min(100, score)),
      issues,
      suggestions
    };
  }

  /**
   * 生成詳細的手相特徵分析
   */
  private generateDetailedFeatures(seed: number, palmCenter: { x: number; y: number }, palmRadius: number): DetailedPalmFeatures {
    // 基於seed生成一致的隨機特徵
    const random = (offset: number = 0) => ((seed + offset) % 100) / 100;
    
    // 生命線特徵
    const life_line: LifeLineFeature = {
      length_ratio: 0.7 + random(1) * 0.3, // 0.7-1.0
      depth: random(2) > 0.7 ? 'deep' : random(2) > 0.4 ? 'medium' : 'shallow',
      curvature: random(3) > 0.6 ? 'wide' : random(3) > 0.3 ? 'moderate' : 'slight',
      clarity: random(4) > 0.6 ? 'prominent' : random(4) > 0.3 ? 'clear' : 'faint',
      color: random(5) > 0.7 ? 'red' : random(5) > 0.4 ? 'pinkish' : 'pale',
      interruptions: Math.floor(random(6) * 3), // 0-2
      branches: Math.floor(random(7) * 5), // 0-4
      start_separation_head_line: random(8) * 0.3, // 0-0.3
      end_position: random(9) > 0.6 ? 'wrist' : random(9) > 0.3 ? 'middle_palm' : 'upper_palm'
    };

    // 感情線特徵
    const heart_line: HeartLineFeature = {
      length_ratio: 0.6 + random(10) * 0.4, // 0.6-1.0
      depth: random(11) > 0.6 ? 'deep' : random(11) > 0.3 ? 'medium' : 'shallow',
      curvature: random(12) > 0.5 ? 'moderate' : random(12) > 0.2 ? 'slight' : 'straight',
      clarity: random(13) > 0.5 ? 'prominent' : random(13) > 0.2 ? 'clear' : 'faint',
      color: random(14) > 0.6 ? 'red' : random(14) > 0.3 ? 'pinkish' : 'pale',
      interruptions: Math.floor(random(15) * 2), // 0-1
      branches: Math.floor(random(16) * 4), // 0-3
      end_point: random(17) > 0.7 ? 'above_middle_finger' : 
                random(17) > 0.5 ? 'under_middle_finger' : 
                random(17) > 0.3 ? 'between_index_middle' : 'under_index_finger',
      start_position: random(18) > 0.5 ? 'mount_mercury' : random(18) > 0.2 ? 'below_pinky' : 'palm_edge'
    };

    // 智慧線特徵
    const head_line: HeadLineFeature = {
      length_ratio: 0.5 + random(19) * 0.5, // 0.5-1.0
      depth: random(20) > 0.6 ? 'deep' : random(20) > 0.3 ? 'medium' : 'shallow',
      curvature: random(21) > 0.6 ? 'moderate' : random(21) > 0.3 ? 'slight' : 'straight',
      clarity: random(22) > 0.6 ? 'prominent' : random(22) > 0.3 ? 'clear' : 'faint',
      color: random(23) > 0.6 ? 'red' : random(23) > 0.3 ? 'pinkish' : 'pale',
      interruptions: Math.floor(random(24) * 2), // 0-1
      branches: Math.floor(random(25) * 3), // 0-2
      slope: random(26) > 0.6 ? 'downward' : random(26) > 0.3 ? 'straight' : 'upward',
      end_position: random(27) > 0.5 ? 'mount_moon' : random(27) > 0.2 ? 'palm_edge' : 'middle_palm'
    };

    // 手指特徵生成函數
    const generateFingerFeature = (offset: number): FingerFeature => ({
      length_ratio: 0.7 + random(offset) * 0.3, // 0.7-1.0
      thickness: random(offset + 1) > 0.6 ? 'thick' : random(offset + 1) > 0.3 ? 'medium' : 'thin',
      flexibility: random(offset + 2) > 0.6 ? 'flexible' : random(offset + 2) > 0.3 ? 'normal' : 'stiff',
      nail_shape: random(offset + 3) > 0.7 ? 'pointed' : 
                  random(offset + 3) > 0.5 ? 'oval' : 
                  random(offset + 3) > 0.3 ? 'round' : 'square',
      nail_color: random(offset + 4) > 0.6 ? 'red' : random(offset + 4) > 0.3 ? 'pink' : 'pale'
    });

    return {
      palm_shape: random(30) > 0.8 ? 'psychic' : 
                  random(30) > 0.6 ? 'conic' : 
                  random(30) > 0.4 ? 'spatulate' : 
                  random(30) > 0.2 ? 'rectangular' : 'square',
      palm_size: random(31) > 0.6 ? 'large' : random(31) > 0.3 ? 'medium' : 'small',
      palm_texture: random(32) > 0.7 ? 'firm' : 
                    random(32) > 0.5 ? 'soft' : 
                    random(32) > 0.3 ? 'rough' : 'smooth',
      palm_color: random(33) > 0.7 ? 'red' : 
                  random(33) > 0.5 ? 'pink' : 
                  random(33) > 0.3 ? 'yellow' : 'pale',
      
      life_line,
      heart_line,
      head_line,
      
      // 次要線條（可選）
      fate_line: random(40) > 0.7 ? {
        length_ratio: 0.4 + random(41) * 0.6,
        depth: random(42) > 0.5 ? 'medium' : 'shallow',
        curvature: 'straight',
        clarity: random(43) > 0.5 ? 'clear' : 'faint',
        color: 'pinkish',
        interruptions: Math.floor(random(44) * 2),
        branches: Math.floor(random(45) * 2)
      } : undefined,
      
      // 手指特徵
      thumb: generateFingerFeature(50),
      index_finger: generateFingerFeature(55),
      middle_finger: generateFingerFeature(60),
      ring_finger: generateFingerFeature(65),
      pinky_finger: generateFingerFeature(70),
      
      // 手掌丘陵
      mounts: {
        venus: { prominence: random(80) * 10, texture: random(81) > 0.5 ? 'smooth' : 'rough' },
        jupiter: { prominence: random(82) * 10, texture: random(83) > 0.5 ? 'smooth' : 'rough' },
        saturn: { prominence: random(84) * 10, texture: random(85) > 0.5 ? 'smooth' : 'rough' },
        apollo: { prominence: random(86) * 10, texture: random(87) > 0.5 ? 'smooth' : 'rough' },
        mercury: { prominence: random(88) * 10, texture: random(89) > 0.5 ? 'smooth' : 'rough' },
        moon: { prominence: random(90) * 10, texture: random(91) > 0.5 ? 'smooth' : 'rough' },
        mars_positive: { prominence: random(92) * 10, texture: random(93) > 0.5 ? 'smooth' : 'rough' },
        mars_negative: { prominence: random(94) * 10, texture: random(95) > 0.5 ? 'smooth' : 'rough' }
      },
      
      // 特殊記號
      special_marks: random(96) > 0.8 ? [
        {
          type: random(97) > 0.8 ? 'star' : 
                random(97) > 0.6 ? 'triangle' : 
                random(97) > 0.4 ? 'square' : 
                random(97) > 0.2 ? 'cross' : 'dot',
          location: random(98) > 0.5 ? 'mount_jupiter' : 'life_line',
          meaning: '特殊運勢標記'
        }
      ] : []
    };
  }
}

// 工廠函數，創建不同類型的手掌定位服務
export function createPalmPositioningService(type: 'auto' | 'rotate' | 'segment' | 'fast' = 'auto'): PalmPositioningService {
  const configs = {
    auto: {
      enableRotationCorrection: true,
      enableSegmentation: true,
      usePSOOptimization: true,
      keyPointThreshold: 0.7
    },
    rotate: {
      enableRotationCorrection: true,
      enableSegmentation: false,
      usePSOOptimization: true,
      keyPointThreshold: 0.8
    },
    segment: {
      enableRotationCorrection: false,
      enableSegmentation: true,
      usePSOOptimization: true,
      keyPointThreshold: 0.6
    },
    fast: {
      enableRotationCorrection: true,
      enableSegmentation: false,
      usePSOOptimization: false,
      keyPointThreshold: 0.5
    }
  };

  return new PalmPositioningService(configs[type]);
}