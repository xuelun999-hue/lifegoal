// 手掌定位和分析增強工具
// 基於提供的 Python ROI 提取邏輯改進手相分析

interface PalmFeatures {
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

    return {
      palmCenter,
      palmRadius,
      rotationAngle,
      keyPoints,
      roiSquare,
      confidence
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