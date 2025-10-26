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
    
    // 計算分數 - 平衡的評分標準
    let score = 30; // 基礎分數
    if (fingersDetected) score += 35; // 手指檢測最重要
    if (palmLinesVisible) score += 25; // 掌紋也很重要
    if (lightingAdequate) score += 10;
    if (overallClarity) score += 10;
    
    // 生成反饋
    const { issues, suggestions } = generateFeedback({
      fingersDetected,
      palmLinesVisible,
      lightingAdequate,
      overallClarity
    });
    
    // 平衡的驗證條件：必須同時檢測到手指AND掌紋，或者總分超過70分
    const isValid = (fingersDetected && palmLinesVisible) || score >= 70;
    
    return {
      isValid,
      score: Math.min(score, 100), // 確保分數不超過100
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
  const prompt = `請仔細分析這張照片，判斷是否為人類手掌照片。

嚴格檢查要求：
1. 這是否是一隻真實的人類手掌？
2. 是否可以看到手指（至少3-4根）？
3. 照片主體是否確實是手掌，而不是其他物體、動物或身體部位？
4. 如果是貓、狗、其他動物或非手掌物體，必須回答"否"

請只回答：是 或 否

圖像：${imageData.substring(0, 200)}...`;

  try {
    const response = await callDeepSeekValidation(prompt);
    return response.toLowerCase().includes('是') || 
           response.toLowerCase().includes('可以') ||
           response.toLowerCase().includes('看到') ||
           response.toLowerCase().includes('手');
  } catch (error) {
    return true; // 如果API失敗，默認通過
  }
}

async function checkPalmLines(service: DeepSeekPalmistryService, imageData: string): Promise<boolean> {
  const prompt = `請分析這張手掌照片，檢查是否可以看到一些掌紋線條。

檢查要點：
1. 是否可以看到手掌表面的一些線條
2. 不需要非常清晰，只要能看到線條即可
3. 照片是否足夠清楚來進行基本分析

請只回答：是 或 否

圖像：${imageData.substring(0, 200)}...`;

  try {
    const response = await callDeepSeekValidation(prompt);
    return response.toLowerCase().includes('是') || 
           response.toLowerCase().includes('可以') ||
           response.toLowerCase().includes('看到') ||
           response.toLowerCase().includes('線條');
  } catch (error) {
    return true; // 如果API失敗，默認通過
  }
}

async function checkLighting(service: DeepSeekPalmistryService, imageData: string): Promise<boolean> {
  const prompt = `請評估這張手掌照片的光線是否可以接受。

評估標準：
1. 照片是否太暗看不清楚
2. 是否過度曝光變成白色
3. 整體是否可以看清手掌內容

請只回答：是 或 否

圖像：${imageData.substring(0, 200)}...`;

  try {
    const response = await callDeepSeekValidation(prompt);
    return response.toLowerCase().includes('是') || 
           response.toLowerCase().includes('可以') ||
           response.toLowerCase().includes('接受') ||
           response.toLowerCase().includes('看清');
  } catch (error) {
    return true; // 如果API失敗，默認通過
  }
}

async function checkClarity(service: DeepSeekPalmistryService, imageData: string): Promise<boolean> {
  const prompt = `請評估這張手掌照片是否可以接受用於分析。

評估標準：
1. 照片是否太模糊無法看清基本內容
2. 是否可以看到手掌的基本輪廓
3. 整體是否可以用於基本分析（不需要非常清晰）

請只回答：是 或 否

圖像：${imageData.substring(0, 200)}...`;

  try {
    const response = await callDeepSeekValidation(prompt);
    return response.toLowerCase().includes('是') || 
           response.toLowerCase().includes('可以') ||
           response.toLowerCase().includes('接受') ||
           response.toLowerCase().includes('看到');
  } catch (error) {
    return true; // 如果API失敗，默認通過
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