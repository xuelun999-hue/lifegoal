# 玉掌智慧羅盤 (Jade Palm Wisdom Compass)

一個基於古典玉掌派智慧與現代AI技術的手相分析應用。

## 🌟 功能特色

- 🤖 **AI智能分析**：自動識別手型、掌紋線條
- 📱 **簡潔界面**：直觀易用的手相分析體驗
- 🔮 **深度解讀**：基於玉掌派傳統理論的專業分析
- 💎 **個人化報告**：性格、事業、感情、健康全面解析
- 🎯 **Freemium模式**：基礎功能免費，進階分析付費

## 🚀 技術棧

- **框架**：Next.js 15 + TypeScript
- **樣式**：Tailwind CSS
- **圖標**：Lucide React
- **動畫**：Framer Motion
- **部署**：Vercel

## 📦 安裝與運行

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 構建生產版本
npm run build

# 啟動生產服務
npm start
```

開啟 [http://localhost:3000](http://localhost:3000) 查看應用。

## 🎨 產品架構

### 核心模組
- **智能掃描**：照片上傳與AI預處理
- **分析引擎**：基於玉掌派理論的規則運算
- **報告生成**：結構化的手相分析結果
- **付費功能**：深度報告與趨勢預測

### 用戶流程
1. 上傳手掌照片
2. AI自動分析識別
3. 免費基礎報告
4. 付費解鎖完整功能

## 🔧 環境變量

創建 `.env.local` 文件：

```env
# 未來AI服務配置
NEXT_PUBLIC_API_URL=your_api_url
OPENAI_API_KEY=your_openai_key
```

## 📱 MVP功能

- ✅ 手相照片上傳
- ✅ 模擬AI分析流程
- ✅ 基礎手相解讀
- ✅ 免費增值模式展示
- ✅ 響應式設計
- ⏳ 用戶認證系統
- ⏳ 真實AI視覺識別
- ⏳ 支付系統集成

## 🚀 部署

### Vercel 部署

1. 將代碼推送到 GitHub
2. 在 Vercel 中導入項目
3. 自動部署完成

### 手動部署

```bash
npm run build
npm start
```

## 📄 授權

MIT License

---

**注意**：此為MVP版本，僅用於演示產品概念。真實的AI分析功能需要進一步開發整合。