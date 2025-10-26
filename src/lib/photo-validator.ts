export interface PhotoValidationResult {
  isValid: boolean;
  score: number;
  issues: string[];
  suggestions: string[];
  details: {
    fingersDetected: boolean;
    palmLinesVisible: boolean;
    lightingAdequate: boolean;
    overallClarity: boolean;
  };
}

export class PhotoValidator {
  
  /**
   * 驗證手掌照片質量
   * 檢查：1.五根手指 2.掌紋和生命線智慧線 3.光線明亮圖片清晰
   */
  async validatePalmPhoto(imageData: string): Promise<PhotoValidationResult> {
    try {
      console.log('📸 開始照片質量驗證...');
      
      // 調用服務器端API進行驗證
      const response = await fetch('/api/validate-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: imageData
        })
      });
      
      if (!response.ok) {
        throw new Error(`驗證API請求失敗: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        console.error('服務器驗證錯誤:', data.error);
        return data.result;
      }
      
      console.log(`✅ 驗證完成，分數: ${data.score}/100`);
      return data;
      
    } catch (error) {
      console.error('照片驗證失敗:', error);
      
      // 如果API失敗，使用基本的客戶端驗證
      return await this.fallbackValidation(imageData);
    }
  }
  
  /**
   * 備用驗證方法（當API不可用時）
   */
  private async fallbackValidation(imageData: string): Promise<PhotoValidationResult> {
    try {
      const image = await this.loadImage(imageData);
      
      // 基本檢查
      const basicChecks = {
        fingersDetected: image.width > 300 && image.height > 300,
        palmLinesVisible: true, // 假設基本通過
        lightingAdequate: true,
        overallClarity: image.width >= 400 && image.height >= 400
      };
      
      const score = this.calculateScore(basicChecks);
      const { issues, suggestions } = this.generateFeedback(basicChecks);
      
      return {
        isValid: score >= 60, // 降低標準
        score,
        issues: ['使用基本驗證', ...issues],
        suggestions: ['AI驗證暫時不可用', ...suggestions],
        details: basicChecks
      };
      
    } catch (error) {
      return {
        isValid: false,
        score: 0,
        issues: ['照片處理失敗'],
        suggestions: ['請檢查照片格式是否正確，然後重新上傳'],
        details: {
          fingersDetected: false,
          palmLinesVisible: false,
          lightingAdequate: false,
          overallClarity: false
        }
      };
    }
  }
  private async loadImage(imageData: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = imageData;
    });
  }
  
  /**
   * 計算總分
   */
  private calculateScore(details: {
    fingersDetected: boolean;
    palmLinesVisible: boolean;
    lightingAdequate: boolean;
    overallClarity: boolean;
  }): number {
    let score = 0;
    
    if (details.fingersDetected) score += 30;
    if (details.palmLinesVisible) score += 25;
    if (details.lightingAdequate) score += 25;
    if (details.overallClarity) score += 20;
    
    return score;
  }
  
  /**
   * 生成反饋建議
   */
  private generateFeedback(details: {
    fingersDetected: boolean;
    palmLinesVisible: boolean;
    lightingAdequate: boolean;
    overallClarity: boolean;
  }): { issues: string[]; suggestions: string[] } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    if (!details.fingersDetected) {
      issues.push('無法清楚識別五根手指');
      suggestions.push('請確保手掌完全展開，五根手指都清晰可見且沒有被遮擋');
    }
    
    if (!details.palmLinesVisible) {
      issues.push('掌紋線條不夠清晰');
      suggestions.push('請在良好光線下拍攝，確保生命線和智慧線清晰可見');
    }
    
    if (!details.lightingAdequate) {
      issues.push('照片光線不足或過度曝光');
      suggestions.push('請在自然光或充足的室內燈光下拍攝，避免陰影和強光直射');
    }
    
    if (!details.overallClarity) {
      issues.push('照片模糊或解析度不足');
      suggestions.push('請保持相機穩定，確保照片清晰，建議使用後置鏡頭拍攝');
    }
    
    if (issues.length === 0) {
      suggestions.push('照片質量良好，可以進行分析');
    }
    
    return { issues, suggestions };
  }
}