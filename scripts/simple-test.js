const fs = require('fs');
const path = require('path');

async function testKnowledge() {
  console.log('🧪 測試知識庫載入...\n');
  
  const processedDir = path.join(__dirname, '../knowledge/processed');
  
  console.log('📂 檢查處理目錄:', processedDir);
  
  if (!fs.existsSync(processedDir)) {
    console.log('❌ 處理目錄不存在');
    return;
  }
  
  const files = fs.readdirSync(processedDir).filter(f => f.endsWith('.md'));
  console.log(`📄 找到 ${files.length} 個處理檔案:`, files.map(f => f.substring(0, 30) + '...'));
  
  // 創建測試知識庫內容
  const testKnowledgePath = path.join(processedDir, 'palmistry-basics.md');
  const testContent = `# 玉掌派手相學基礎

## 手型分類

### 木型手
- **特徵**：手掌長方形，手指修長纖細，骨節明顯
- **性格**：創造力豐富，具有藝術天賦，思維活躍，感情細膩
- **事業**：適合藝術、設計、教育、文學創作等創意性工作
- **財運**：通過才華和創意獲得財富，需要耐心積累

### 火型手
- **特徵**：手掌呈梯形，手指較短但有力，掌厚肉實
- **性格**：行動力強，熱情積極，具有領導能力，決策果斷
- **事業**：適合管理、銷售、創業、體育等需要行動力的工作
- **財運**：財運旺盛，善於把握機會，容易成功

### 土型手
- **特徵**：手掌方形厚實，手指粗壯，肉質豐滿
- **性格**：務實穩重，踏實可靠，執行力強，注重安全
- **事業**：適合建築、農業、製造業、金融等穩定性工作
- **財運**：財運穩定，善於理財，積少成多

### 金型手
- **特徵**：手掌方形，手指長度適中，指甲整齊
- **性格**：理性冷靜，邏輯思維強，注重細節，有條理
- **事業**：適合科技、法律、會計、醫療等專業性工作
- **財運**：通過專業技能獲得穩定收入

### 水型手
- **特徵**：手掌橢圓形，手指柔軟靈活，皮膚細膩
- **性格**：感性直覺，適應力強，善於溝通，富有同情心
- **事業**：適合媒體、服務業、心理諮詢、外交等人際性工作
- **財運**：財運多變，需要學會理財規劃

## 主要掌紋線條

### 生命線（地紋）
- **位置**：起於食指與拇指之間，圍繞拇指根部形成弧線
- **意義**：代表健康狀況、生命力強弱、重大生活變化
- **分析要點**：
  - 線條清晰深長：身體健康，生命力旺盛
  - 線條淺短：體質較弱，需要注意保養
  - 有島紋：該時期健康需要注意
  - 有斷裂：生活中可能有重大變化

### 智慧線（人紋）
- **位置**：橫向穿過手掌中部，通常與生命線共同起點
- **意義**：代表思維方式、智力水平、學習能力、決策風格
- **分析要點**：
  - 線條直：理性思維，邏輯性強
  - 線條彎曲：感性思維，創意豐富
  - 線條長：思考深入，分析能力強
  - 線條短：思維敏捷，決策快速

### 感情線（天紋）
- **位置**：手掌上方的橫線，從小指側向食指方向
- **意義**：代表情感表達方式、人際關係、愛情運勢
- **分析要點**：
  - 線條深長：感情豐富，專一持久
  - 線條淺短：理性大於感性
  - 有分岔：感情複雜，可能有多段戀情
  - 有島紋：感情路上可能有困擾

## 組合判斷原則

### 基本原則
1. **手型決定基本性格框架**：先看整體手型分類
2. **主線反映人生重點領域**：生命、智慧、感情三線
3. **副線顯示細節特徵**：事業線、財運線等
4. **特殊記號指示關鍵時期**：星紋、三角紋、島紋等
5. **綜合分析得出結論**：不可單線論斷

### 組合實例
- **木型手 + 智慧線彎曲**：藝術創作天賦
- **火型手 + 事業線清晰**：領導管理能力
- **土型手 + 財運線深長**：理財投資天賦
- **金型手 + 智慧線直長**：專業技術能力
- **水型手 + 感情線豐富**：人際交往天賦

## 分析步驟

1. **觀察手型**：確定基本性格類型
2. **分析三大主線**：了解核心特質
3. **檢查副線和特殊記號**：補充細節信息
4. **考慮線條組合**：進行綜合判斷
5. **提供建議**：基於分析給出人生指導

注：手相分析應作為自我認知和人生規劃的參考工具，而非絕對預測。`;

  fs.writeFileSync(testKnowledgePath, testContent, 'utf8');
  console.log('✅ 已創建手相學基礎知識庫');
  
  // 測試讀取
  const content = fs.readFileSync(testKnowledgePath, 'utf8');
  console.log(`📏 知識庫內容長度: ${content.length} 字符`);
  console.log('📝 內容預覽:', content.substring(0, 100) + '...');
  
  // 檢查所有檔案
  const allFiles = fs.readdirSync(processedDir).filter(f => f.endsWith('.md'));
  let totalChars = 0;
  
  console.log('\n📊 知識庫統計:');
  for (const file of allFiles) {
    const filePath = path.join(processedDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    totalChars += fileContent.length;
    console.log(`📄 ${file}: ${fileContent.length} 字符`);
  }
  
  console.log(`\n📈 總計: ${allFiles.length} 個檔案, ${totalChars} 字符`);
  console.log('\n🎉 知識庫準備完成！現在可以在應用中測試了');
  console.log('🌐 本地測試地址: http://localhost:3000');
}

testKnowledge();