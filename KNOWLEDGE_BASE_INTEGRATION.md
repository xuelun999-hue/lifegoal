# 知識庫 + DeepSeek 集成指南

## 📚 知識庫結構設計

### 建議的知識庫文件結構：

```
knowledge_base/
├── palmistry_basics/
│   ├── hand_types.md           # 五大手型分類
│   ├── palm_lines.md           # 九大主線詳解
│   ├── mounts.md               # 九大丘位分析
│   └── special_marks.md        # 特殊記號含義
├── analysis_rules/
│   ├── combination_rules.md    # 組合判斷法則
│   ├── tendency_analysis.md    # 傾向性分析
│   └── life_periods.md         # 人生階段劃分
├── interpretations/
│   ├── personality.md          # 性格特質解讀
│   ├── career_wealth.md        # 事業財運分析
│   ├── relationships.md        # 感情人際關係
│   └── health_wellness.md      # 健康養生建議
└── templates/
    ├── report_structure.md     # 報告結構模板
    └── response_examples.md    # 回應範例
```

## 🔧 DeepSeek API 集成

### 1. 環境配置

在 `.env.local` 添加：

```env
# DeepSeek API 配置
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
NEXT_PUBLIC_APP_NAME=玉掌智慧羅盤
```

### 2. API 服務封裝

創建 `src/lib/deepseek.ts`：

```typescript
interface PalmAnalysisRequest {
  imageData: string;
  userInfo: {
    gender?: string;
    age?: number;
  };
}

interface PalmAnalysisResponse {
  handType: string;
  personality: string;
  career: string;
  wealth: string;
  health: string;
  relationship: string;
  confidence: number;
}

export class DeepSeekPalmistryService {
  private apiKey: string;
  private apiUrl: string;
  private knowledgeBase: string;

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY!;
    this.apiUrl = process.env.DEEPSEEK_API_URL!;
    this.knowledgeBase = this.loadKnowledgeBase();
  }

  private loadKnowledgeBase(): string {
    // 載入知識庫內容
    // 可以從文件系統讀取或從數據庫獲取
    return `
    玉掌派手相學知識庫：
    
    手型分類：
    1. 木型手：手掌長方形，手指修長...
    2. 火型手：手掌呈梯形，手指較短...
    [詳細知識庫內容]
    `;
  }

  async analyzePalm(request: PalmAnalysisRequest): Promise<PalmAnalysisResponse> {
    const prompt = this.constructPrompt(request);
    
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: this.knowledgeBase
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      })
    });

    const data = await response.json();
    return this.parseResponse(data.choices[0].message.content);
  }

  private constructPrompt(request: PalmAnalysisRequest): string {
    return `
    請根據玉掌派手相學理論，分析以下手掌圖像：
    
    用戶信息：
    - 性別：${request.userInfo.gender || '未提供'}
    - 年齡：${request.userInfo.age || '未提供'}
    
    圖像數據：${request.imageData}
    
    請按照以下格式提供分析：
    1. 手型分類
    2. 性格特質
    3. 事業方向
    4. 財運分析
    5. 健康建議
    6. 感情運勢
    7. 分析可信度(1-100)
    
    請確保分析基於傳統玉掌派理論，避免迷信色彩。
    `;
  }

  private parseResponse(content: string): PalmAnalysisResponse {
    // 解析 DeepSeek 回應並轉換為標準格式
    // 實現具體的文本解析邏輯
    return {
      handType: '木型手',
      personality: '...',
      career: '...',
      wealth: '...',
      health: '...',
      relationship: '...',
      confidence: 85
    };
  }
}
```

### 3. API 路由實現

創建 `src/app/api/analyze/route.ts`：

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { DeepSeekPalmistryService } from '@/lib/deepseek';

export async function POST(request: NextRequest) {
  try {
    const { imageData, userInfo } = await request.json();
    
    const service = new DeepSeekPalmistryService();
    const analysis = await service.analyzePalm({
      imageData,
      userInfo
    });
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: '分析過程中發生錯誤' },
      { status: 500 }
    );
  }
}
```

## 📝 知識庫內容示例

### hand_types.md
```markdown
# 五大手型分類

## 木型手
- 特徵：手掌長方形，手指修長纖細
- 性格：創造力強，藝術天賦，思維活躍
- 適合職業：藝術家、設計師、教師、作家

## 火型手
- 特徵：手掌呈梯形，手指較短但有力
- 性格：行動力強，熱情積極，領導能力
- 適合職業：管理者、銷售、企業家

[其他手型...]
```

### combination_rules.md
```markdown
# 組合判斷法則

## 線條組合分析
1. 如果丙奇線(事業線)清晰且直上智慧線，表示...
2. 如果壬儀線(感情線)呈鎖鏈狀，需要注意...
3. 當休門號出現在天輔位時，預示...

## 丘位配合判斷
- 金星丘隆起 + 月丘平坦 = 性格內向但感情豐富
- 木星丘發達 + 土星丘凹陷 = 領導欲強但缺乏耐心

[更多組合規則...]
```

## 🔄 前端集成

修改 `src/app/page.tsx` 中的分析函數：

```typescript
const handleImageUpload = async (file: File) => {
  setIsAnalyzing(true);
  
  try {
    const base64 = await fileToBase64(file);
    
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageData: base64,
        userInfo: {
          gender: userGender // 需要添加用戶性別選擇
        }
      })
    });
    
    const analysisResult = await response.json();
    setAnalysisData(analysisResult);
  } catch (error) {
    console.error('分析失敗:', error);
    // 顯示錯誤提示
  } finally {
    setIsAnalyzing(false);
  }
};
```

## 📊 性能優化建議

1. **知識庫緩存**：將知識庫內容緩存在記憶體中
2. **分批載入**：根據分析需求動態載入相關知識
3. **回應緩存**：對相似圖像的分析結果進行緩存
4. **錯誤處理**：實現完整的錯誤處理和重試機制

## 🚀 部署注意事項

1. 確保 DeepSeek API 密鑰安全存儲
2. 配置適當的 API 請求限制
3. 監控 API 使用量和成本
4. 實現日誌記錄用於調試和優化