# 部署指南 (Deployment Guide)

## 🚀 Vercel 自動部署

### 步驟 1: 上傳到 GitHub

```bash
# 如果尚未設置遠程倉庫
git remote add origin https://github.com/你的用戶名/jade-palm-compass.git
git branch -M main
git push -u origin main
```

### 步驟 2: Vercel 部署

1. 訪問 [vercel.com](https://vercel.com)
2. 使用 GitHub 帳號登入
3. 點擊 "New Project"
4. 選擇 `jade-palm-compass` 倉庫
5. 保持默認設置，點擊 "Deploy"
6. 等待部署完成（約 2-3 分鐘）

### 步驟 3: 自定義域名（可選）

1. 在 Vercel 項目設置中點擊 "Domains"
2. 添加您的自定義域名
3. 按照指示配置 DNS 記錄

## 🔧 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm run dev

# 訪問 http://localhost:3000
```

## 📱 手動測試

1. 上傳手掌照片（任意圖片）
2. 等待 3 秒模擬 AI 分析
3. 查看分析結果的不同標籤頁
4. 測試付費功能提示
5. 重新分析功能

## 🎯 Next Steps

- [ ] 集成真實的AI視覺識別服務
- [ ] 添加用戶認證系統
- [ ] 集成支付網關
- [ ] 優化移動端體驗
- [ ] 添加更多語言支持

## 📞 技術支持

如遇到問題，請檢查：
1. Node.js 版本 >= 18
2. npm 或 yarn 是否正常工作
3. 網絡連接是否穩定