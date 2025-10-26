import fs from 'fs';
import path from 'path';

export class KnowledgeLoader {
  private knowledgeCache: Map<string, string> = new Map();
  private processedDir: string;

  constructor() {
    this.processedDir = path.join(process.cwd(), 'knowledge', 'processed');
  }

  /**
   * 載入所有處理過的知識庫內容
   */
  loadAllKnowledge(): string {
    try {
      if (!fs.existsSync(this.processedDir)) {
        console.warn('知識庫目錄不存在:', this.processedDir);
        return this.getDefaultKnowledge();
      }

      const files = fs.readdirSync(this.processedDir)
        .filter(file => file.endsWith('.md'));

      if (files.length === 0) {
        console.warn('未找到處理過的知識庫檔案');
        return this.getDefaultKnowledge();
      }

      let combinedKnowledge = '# 玉掌派手相學知識庫\n\n';

      for (const file of files) {
        const cacheKey = file;
        
        if (this.knowledgeCache.has(cacheKey)) {
          combinedKnowledge += this.knowledgeCache.get(cacheKey) + '\n\n';
          continue;
        }

        const filePath = path.join(this.processedDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        this.knowledgeCache.set(cacheKey, content);
        combinedKnowledge += content + '\n\n';
      }

      return combinedKnowledge;

    } catch (error) {
      console.error('載入知識庫時發生錯誤:', error);
      return this.getDefaultKnowledge();
    }
  }

  /**
   * 載入特定主題的知識
   */
  loadKnowledgeByTopic(topic: string): string {
    try {
      const topicFile = `${topic}.md`;
      const filePath = path.join(this.processedDir, topicFile);

      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf8');
      }

      // 如果找不到特定檔案，搜尋包含該主題的檔案
      const files = fs.readdirSync(this.processedDir)
        .filter(file => file.includes(topic) && file.endsWith('.md'));

      if (files.length > 0) {
        const filePath = path.join(this.processedDir, files[0]);
        return fs.readFileSync(filePath, 'utf8');
      }

      return '';
    } catch (error) {
      console.error(`載入主題 ${topic} 的知識時發生錯誤:`, error);
      return '';
    }
  }

  /**
   * 搜尋知識庫中的關鍵字
   */
  searchKnowledge(keyword: string): string[] {
    try {
      const allContent = this.loadAllKnowledge();
      const lines = allContent.split('\n');
      
      return lines.filter(line => 
        line.toLowerCase().includes(keyword.toLowerCase())
      );
    } catch (error) {
      console.error('搜尋知識庫時發生錯誤:', error);
      return [];
    }
  }

  /**
   * 獲取默認知識庫（當PDF尚未處理時使用）
   */
  private getDefaultKnowledge(): string {
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

注意：此為基礎知識，請上傳你的PDF知識庫以獲得更詳細的專業內容。
`;
  }

  /**
   * 清除快取
   */
  clearCache(): void {
    this.knowledgeCache.clear();
  }

  /**
   * 獲取知識庫統計信息
   */
  getKnowledgeStats(): {
    fileCount: number;
    totalCharacters: number;
    availableTopics: string[];
  } {
    try {
      if (!fs.existsSync(this.processedDir)) {
        return { fileCount: 0, totalCharacters: 0, availableTopics: [] };
      }

      const files = fs.readdirSync(this.processedDir)
        .filter(file => file.endsWith('.md'));

      let totalCharacters = 0;
      const availableTopics: string[] = [];

      for (const file of files) {
        const filePath = path.join(this.processedDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        totalCharacters += content.length;
        availableTopics.push(path.basename(file, '.md'));
      }

      return {
        fileCount: files.length,
        totalCharacters,
        availableTopics
      };
    } catch (error) {
      console.error('獲取知識庫統計時發生錯誤:', error);
      return { fileCount: 0, totalCharacters: 0, availableTopics: [] };
    }
  }
}