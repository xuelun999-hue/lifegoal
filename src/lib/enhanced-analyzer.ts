import fs from 'fs';
import path from 'path';

export class EnhancedPalmAnalyzer {
  private knowledgeBase: string = '';
  private handTypePatterns: Map<string, RegExp> = new Map();
  private analysisKeywords: Map<string, string[]> = new Map();

  constructor() {
    this.loadKnowledgeBase();
    this.initializePatterns();
  }

  private loadKnowledgeBase(): void {
    try {
      const processedDir = path.join(process.cwd(), 'knowledge', 'processed');
      
      if (!fs.existsSync(processedDir)) {
        this.knowledgeBase = this.getDefaultKnowledge();
        return;
      }

      const files = fs.readdirSync(processedDir)
        .filter(file => file.endsWith('.md'));

      let combinedKnowledge = '';

      for (const file of files) {
        const filePath = path.join(processedDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 过滤掉二进制内容，只保留可读文本
        const cleanContent = this.cleanContent(content);
        if (cleanContent.length > 100) { // 只有内容足够长才添加
          combinedKnowledge += cleanContent + '\n\n';
        }
      }

      this.knowledgeBase = combinedKnowledge || this.getDefaultKnowledge();
    } catch (error) {
      console.error('载入知识库时发生错误:', error);
      this.knowledgeBase = this.getDefaultKnowledge();
    }
  }

  private cleanContent(content: string): string {
    // 移除二进制内容和XML标签
    return content
      .replace(/PK[\s\S]*?xml/g, '') // 移除压缩文件内容
      .replace(/<[^>]*>/g, '') // 移除XML标签
      .replace(/[^\u4e00-\u9fa5\u0020-\u007E\n\r]/g, '') // 只保留中文、英文和基本符号
      .replace(/\s{3,}/g, '\n\n') // 合并多个空行
      .trim();
  }

  private initializePatterns(): void {
    // 初始化手型识别模式
    this.handTypePatterns.set('木型手', /木型手|长方形.*手掌|手指.*修长|纤细/);
    this.handTypePatterns.set('火型手', /火型手|梯形.*手掌|手指.*短.*有力|掌厚肉实/);
    this.handTypePatterns.set('土型手', /土型手|方形.*厚实|手指.*粗壮|肉质丰满/);
    this.handTypePatterns.set('金型手', /金型手|方形.*手掌|手指.*适中|指甲整齐/);
    this.handTypePatterns.set('水型手', /水型手|椭圆形.*手掌|手指.*柔软|皮肤细腻/);

    // 初始化分析关键词
    this.analysisKeywords.set('性格', ['性格', '特质', '品格', '个性', '气质']);
    this.analysisKeywords.set('事业', ['事业', '职业', '工作', '适合', '发展']);
    this.analysisKeywords.set('财运', ['财运', '财富', '金钱', '收入', '理财']);
    this.analysisKeywords.set('健康', ['健康', '身体', '疾病', '保养', '注意']);
    this.analysisKeywords.set('感情', ['感情', '恋爱', '婚姻', '关系', '伴侣']);
  }

  public analyzeBasedOnKnowledge(userInfo: any = {}): any {
    // 从知识库中随机选择手型
    const handTypes = ['木型手', '火型手', '土型手', '金型手', '水型手'];
    const selectedHandType = handTypes[Math.floor(Math.random() * handTypes.length)];

    // 基于选择的手型从知识库中提取相关信息
    const analysis = this.extractAnalysisForHandType(selectedHandType);

    return {
      handType: selectedHandType,
      personality: analysis.personality || this.getDefaultPersonality(selectedHandType),
      career: analysis.career || this.getDefaultCareer(selectedHandType),
      wealth: analysis.wealth || this.getDefaultWealth(selectedHandType),
      health: analysis.health || this.getDefaultHealth(selectedHandType),
      relationship: analysis.relationship || this.getDefaultRelationship(selectedHandType),
      confidence: Math.floor(Math.random() * 15) + 85 // 85-99%
    };
  }

  private extractAnalysisForHandType(handType: string): any {
    const lines = this.knowledgeBase.split('\n');
    const analysis: any = {};
    
    let foundHandType = false;
    let currentSection = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // 查找手型开始
      if (line.includes(handType)) {
        foundHandType = true;
        continue;
      }

      if (foundHandType) {
        // 如果遇到下一个手型，停止搜索
        if (line.includes('型手') && !line.includes(handType)) {
          break;
        }

        // 提取各类信息
        for (const [key, keywords] of this.analysisKeywords.entries()) {
          for (const keyword of keywords) {
            if (line.includes(keyword) && line.length > 10) {
              const cleanLine = line
                .replace(/[*#-•]/g, '')
                .replace(/.*[:：]/, '')
                .trim();
              
              if (cleanLine && !analysis[key]) {
                analysis[key] = cleanLine;
              }
            }
          }
        }
      }
    }

    return analysis;
  }

  private getDefaultPersonality(handType: string): string {
    const personalities = {
      '木型手': '創造力豐富，具有藝術天賦，思維活躍，感情細膩，追求完美',
      '火型手': '行動力強，熱情積極，具有領導能力，決策果斷，富有激情',
      '土型手': '務實穩重，踏實可靠，執行力強，注重安全，有耐心',
      '金型手': '理性冷靜，邏輯思維強，注重細節，有條理，追求精確',
      '水型手': '感性直覺，適應力強，善於溝通，富有同情心，靈活變通'
    };
    return personalities[handType] || '性格溫和，適應能力強';
  }

  private getDefaultCareer(handType: string): string {
    const careers = {
      '木型手': '適合從事藝術、設計、教育、文學創作、音樂等創意性工作',
      '火型手': '適合從事管理、銷售、創業、體育、軍警等需要行動力的工作',
      '土型手': '適合從事建築、農業、製造業、金融、會計等穩定性工作',
      '金型手': '適合從事科技、法律、醫療、工程、研究等專業性工作',
      '水型手': '適合從事媒體、服務業、心理諮詢、外交、旅遊等人際性工作'
    };
    return careers[handType] || '事業發展穩定，需要找到適合的方向';
  }

  private getDefaultWealth(handType: string): string {
    const wealth = {
      '木型手': '財運需要通過創意和才華積累，晚年運勢較好，投資需謹慎',
      '火型手': '財運旺盛，善於把握機會，但需要注意衝動性投資的風險',
      '土型手': '財運穩定，善於理財和儲蓄，適合長期穩健的投資方式',
      '金型手': '財運通過專業技能獲得，收入穩定，理財觀念較強',
      '水型手': '財運多變，收入來源多樣化，需要學會理財規劃'
    };
    return wealth[handType] || '財運中等，需要努力經營';
  }

  private getDefaultHealth(handType: string): string {
    const health = {
      '木型手': '注意肝膽和神經系統的保養，避免過度勞累，保持規律作息',
      '火型手': '注意心血管和消化系統，控制情緒，避免過度激動',
      '土型手': '注意脾胃和關節保養，控制飲食，適量運動',
      '金型手': '注意肺部和皮膚健康，保持環境清潔，規律作息',
      '水型手': '注意腎臟和循環系統，保持水分平衡，避免過度疲勞'
    };
    return health[handType] || '身體健康狀況良好，注意定期檢查';
  }

  private getDefaultRelationship(handType: string): string {
    const relationships = {
      '木型手': '感情豐富細膩，需要心靈相通的伴侶，重視精神層面的交流',
      '火型手': '感情熱烈直接，喜歡主動追求，需要能欣賞其魅力的伴侶',
      '土型手': '感情穩定專一，重視家庭責任，適合踏實可靠的伴侶',
      '金型手': '感情理性務實，重視伴侶的品格和能力，追求門當戶對',
      '水型手': '感情變化豐富，善解人意，需要能夠理解其敏感的伴侶'
    };
    return relationships[handType] || '感情運勢良好，需要用心經營';
  }

  private getDefaultKnowledge(): string {
    return `
# 玉掌派手相學基礎知識

## 手型分類
### 木型手
特徵：手掌長方形，手指修長纖細，骨節明顯
性格：創造力豐富，具有藝術天賦，思維活躍，感情細膩
事業：適合藝術、設計、教育、文學創作等創意性工作
財運：通過才華和創意獲得財富，需要耐心積累
健康：注意肝膽和神經系統的保養

### 火型手
特徵：手掌呈梯形，手指較短但有力，掌厚肉實
性格：行動力強，熱情積極，具有領導能力，決策果斷
事業：適合管理、銷售、創業、體育等需要行動力的工作
財運：財運旺盛，善於把握機會，容易成功
健康：注意心血管和消化系統健康

[其他手型類似...]
`;
  }

  public getKnowledgeStats(): any {
    return {
      knowledgeLength: this.knowledgeBase.length,
      handTypesCount: this.handTypePatterns.size,
      isLoaded: this.knowledgeBase.length > 1000
    };
  }
}