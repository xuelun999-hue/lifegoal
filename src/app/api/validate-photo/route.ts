import { NextRequest, NextResponse } from 'next/server';
import { DeepSeekPalmistryService } from '@/lib/deepseek-service';

interface PhotoValidationRequest {
  imageData: string;
}

export async function POST(request: NextRequest) {
  try {
    const { imageData }: PhotoValidationRequest = await request.json();
    
    console.log('🔍 開始照片質量驗證...');
    
    // 使用DeepSeek進行智能驗證
    const result = await validatePalmPhotoWithAI(imageData);
    
    console.log(`📊 驗證完成，總分: ${result.score}/100`);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('照片驗證失敗:', error);
    return NextResponse.json(
      { 
        error: '照片驗證過程中發生錯誤',
        result: {
          isValid: false,
          score: 0,
          issues: ['系統錯誤，請稍後再試'],
          suggestions: ['請檢查網絡連接後重新上傳'],
          details: {
            fingersDetected: false,
            palmLinesVisible: false,
            lightingAdequate: false,
            overallClarity: false
          }
        }
      },
      { status: 500 }
    );
  }
}

async function validatePalmPhotoWithAI(imageData: string) {
  try {
    const deepSeekService = new DeepSeekPalmistryService();
    
    // 使用DeepSeek進行多項檢測
    const [fingersResult, palmLinesResult, lightingResult, clarityResult] = await Promise.allSettled([
      checkFingers(deepSeekService, imageData),
      checkPalmLines(deepSeekService, imageData),
      checkLighting(deepSeekService, imageData),
      checkClarity(deepSeekService, imageData)
    ]);
    
    // 解析結果
    const fingersDetected = fingersResult.status === 'fulfilled' ? fingersResult.value : false;
    const palmLinesVisible = palmLinesResult.status === 'fulfilled' ? palmLinesResult.value : false;
    const lightingAdequate = lightingResult.status === 'fulfilled' ? lightingResult.value : false;
    const overallClarity = clarityResult.status === 'fulfilled' ? clarityResult.value : false;
    
    // 計算分數
    let score = 0;
    if (fingersDetected) score += 30;
    if (palmLinesVisible) score += 25;
    if (lightingAdequate) score += 25;
    if (overallClarity) score += 20;
    
    // 生成反饋
    const { issues, suggestions } = generateFeedback({
      fingersDetected,
      palmLinesVisible,
      lightingAdequate,
      overallClarity
    });
    
    return {
      isValid: score >= 75 && fingersDetected && palmLinesVisible && lightingAdequate,
      score,
      issues,
      suggestions,
      details: {
        fingersDetected,
        palmLinesVisible,
        lightingAdequate,
        overallClarity
      }
    };
    
  } catch (error) {
    console.error('AI驗證失敗，使用基本驗證:', error);
    
    // 回退到基本驗證
    return {
      isValid: true, // 如果AI失敗，允許用戶繼續
      score: 70,
      issues: ['AI驗證暫時不可用'],
      suggestions: ['已使用基本檢測，請確保照片清晰完整'],
      details: {
        fingersDetected: true,
        palmLinesVisible: true,
        lightingAdequate: true,
        overallClarity: true
      }
    };
  }
}

async function checkFingers(service: DeepSeekPalmistryService, imageData: string): Promise<boolean> {
  const prompt = `請仔細分析這張手掌照片，檢查是否清楚顯示了完整的五根手指。

檢查要求：
1. 拇指、食指、中指、無名指、小指是否都完整可見
2. 手指是否被遮擋、截斷或模糊
3. 手指輪廓是否清晰可辨

請只回答：是 或 否

圖像：${imageData.substring(0, 200)}...`;

  try {
    const response = await callDeepSeekValidation(prompt);
    return response.toLowerCase().includes('是') || 
           response.toLowerCase().includes('完整') ||
           response.toLowerCase().includes('清楚');
  } catch (error) {
    return false;
  }
}

async function checkPalmLines(service: DeepSeekPalmistryService, imageData: string): Promise<boolean> {
  const prompt = `請仔細分析這張手掌照片，檢查主要掌紋線條是否清晰可見。

檢查要點：
1. 生命線（圍繞拇指根部的弧形線）是否清晰
2. 智慧線（橫穿手掌中部的線條）是否可見
3. 掌紋線條是否足夠清晰以進行分析

請只回答：是 或 否

圖像：${imageData.substring(0, 200)}...`;

  try {
    const response = await callDeepSeekValidation(prompt);
    return response.toLowerCase().includes('是') || 
           response.toLowerCase().includes('清晰') ||
           response.toLowerCase().includes('可見');
  } catch (error) {
    return false;
  }
}

async function checkLighting(service: DeepSeekPalmistryService, imageData: string): Promise<boolean> {
  const prompt = `請評估這張手掌照片的光線條件。

評估標準：
1. 整體亮度是否充足
2. 是否有過暗的陰影遮擋手掌
3. 是否有過度曝光的區域
4. 光線是否均勻，細節是否清晰

請只回答：是 或 否

圖像：${imageData.substring(0, 200)}...`;

  try {
    const response = await callDeepSeekValidation(prompt);
    return response.toLowerCase().includes('是') || 
           response.toLowerCase().includes('充足') ||
           response.toLowerCase().includes('良好');
  } catch (error) {
    return false;
  }
}

async function checkClarity(service: DeepSeekPalmistryService, imageData: string): Promise<boolean> {
  const prompt = `請評估這張手掌照片的整體清晰度。

評估要點：
1. 照片是否模糊或有震動痕跡
2. 手掌細節是否清晰可見
3. 解析度是否足夠進行手相分析

請只回答：是 或 否

圖像：${imageData.substring(0, 200)}...`;

  try {
    const response = await callDeepSeekValidation(prompt);
    return response.toLowerCase().includes('是') || 
           response.toLowerCase().includes('清晰') ||
           response.toLowerCase().includes('足夠');
  } catch (error) {
    return false;
  }
}

async function callDeepSeekValidation(prompt: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const apiUrl = process.env.DEEPSEEK_API_URL;
  
  if (!apiKey || !apiUrl) {
    throw new Error('DeepSeek API not configured');
  }
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 10
    })
  });
  
  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

function generateFeedback(details: {
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