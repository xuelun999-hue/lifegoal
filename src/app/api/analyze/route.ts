import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface AnalysisRequest {
  imageData: string;
  userInfo: {
    gender?: string;
    age?: number;
  };
}

// 載入知識庫內容
function loadKnowledgeBase(): string {
  try {
    const processedDir = path.join(process.cwd(), 'knowledge', 'processed');
    
    if (!fs.existsSync(processedDir)) {
      return getDefaultKnowledge();
    }

    const files = fs.readdirSync(processedDir)
      .filter(file => file.endsWith('.md'));

    if (files.length === 0) {
      return getDefaultKnowledge();
    }

    let combinedKnowledge = '# 玉掌派手相學知識庫\n\n';

    for (const file of files) {
      const filePath = path.join(processedDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      combinedKnowledge += content + '\n\n';
    }

    return combinedKnowledge;
  } catch (error) {
    console.error('載入知識庫時發生錯誤:', error);
    return getDefaultKnowledge();
  }
}

function getDefaultKnowledge(): string {
  return `
# 玉掌派手相學基礎知識

## 手型分類
### 木型手
- 特徵：手掌長方形，手指修長纖細
- 性格：創造力強，藝術天賦，思維活躍
- 事業：適合藝術、設計、教育、文學創作

### 火型手  
- 特徵：手掌呈梯形，手指較短但有力
- 性格：行動力強，熱情積極，具領導能力
- 事業：適合管理、銷售、創業、體育

### 土型手
- 特徵：手掌方形厚實，手指粗壯
- 性格：務實穩重，踏實可靠，執行力強
- 事業：適合建築、農業、製造業、金融

### 金型手
- 特徵：手掌方形，手指長度適中
- 性格：理性冷靜，邏輯思維強，注重細節
- 事業：適合科技、法律、會計、醫療

### 水型手
- 特徵：手掌橢圓形，手指柔軟靈活
- 性格：感性直覺，適應力強，善於溝通
- 事業：適合媒體、服務業、心理諮詢

## 主要掌紋線條
### 生命線（地紋）
- 位置：圍繞拇指根部
- 意義：健康狀況、生命力、重大變化

### 智慧線（人紋）
- 位置：橫向穿過手掌中部
- 意義：思維方式、智力水平、決策能力

### 感情線（天紋）
- 位置：手掌上方橫線
- 意義：情感表達、人際關係、愛情運勢
`;
}

// 基於知識庫進行分析的模擬函數
function analyzeWithKnowledge(knowledgeBase: string, userInfo: any) {
  // 模擬基於知識庫的分析
  // 在實際應用中，這裡會調用 DeepSeek API
  
  const handTypes = ['木型手', '火型手', '土型手', '金型手', '水型手'];
  const randomHandType = handTypes[Math.floor(Math.random() * handTypes.length)];
  
  // 根據手型從知識庫中提取相關信息
  const handTypeInfo = extractHandTypeInfo(knowledgeBase, randomHandType);
  
  return {
    handType: randomHandType,
    personality: handTypeInfo.personality || '創造力豐富，具有藝術天賦，思維活躍',
    career: handTypeInfo.career || '適合從事創意、藝術或教育相關工作',
    wealth: '財運中等，需要透過努力和智慧累積財富，建議在創意領域發展',
    health: '注意肝膽和神經系統的保養，保持規律作息',
    relationship: '感情豐富，但需要學會表達和溝通，適合與有共同興趣的伴侶',
    confidence: Math.floor(Math.random() * 20) + 80 // 80-99%
  };
}

function extractHandTypeInfo(knowledgeBase: string, handType: string) {
  const lines = knowledgeBase.split('\n');
  let personality = '';
  let career = '';
  
  // 找到手型相關的行
  let foundHandType = false;
  for (const line of lines) {
    if (line.includes(handType)) {
      foundHandType = true;
      continue;
    }
    
    if (foundHandType) {
      if (line.includes('性格') || line.includes('**性格**')) {
        personality = line.replace(/.*性格[*:：]*/, '').replace(/[*-]/, '').trim();
      }
      if (line.includes('事業') || line.includes('**事業**')) {
        career = line.replace(/.*事業[*:：]*/, '').replace(/[*-]/, '').trim();
      }
      
      // 如果遇到下一個手型，停止搜尋
      if (line.includes('###') && line.includes('手')) {
        break;
      }
    }
  }
  
  return { personality, career };
}

export async function POST(request: NextRequest) {
  try {
    const { imageData, userInfo }: AnalysisRequest = await request.json();
    
    // 載入知識庫
    const knowledgeBase = loadKnowledgeBase();
    
    // 模擬分析過程（實際應用中會調用 DeepSeek API）
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 基於知識庫進行分析
    const analysis = analyzeWithKnowledge(knowledgeBase, userInfo);
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('分析過程中發生錯誤:', error);
    return NextResponse.json(
      { error: '分析過程中發生錯誤，請稍後再試' },
      { status: 500 }
    );
  }
}