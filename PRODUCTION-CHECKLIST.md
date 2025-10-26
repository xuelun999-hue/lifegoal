# 生產環境部署檢查清單

## 🚨 **上線前必須完成的關鍵任務**

### 1. **支付系統整合 (CRITICAL)**
- [ ] **支付寶開放平台配置**
  - 註冊支付寶開放平台帳號
  - 創建應用並獲取 APP_ID 和私鑰
  - 配置 `ALIPAY_APP_ID` 和 `ALIPAY_PRIVATE_KEY` 環境變數
  - 整合支付寶 SDK 到 `src/lib/payment-service.ts`

- [ ] **微信支付配置**
  - 註冊微信商戶平台帳號
  - 獲取商戶號、API 密鑰
  - 配置 `WECHAT_APP_ID` 和 `WECHAT_API_KEY` 環境變數
  - 整合微信支付 SDK

- [ ] **銀行卡支付網關**
  - 選擇支付網關服務商（如銀聯、拉卡拉等）
  - 配置相關 API 密鑰

### 2. **環境變數配置 (CRITICAL)**
```bash
# Vercel 生產環境需要設置：
DEEPSEEK_API_KEY=sk-your-real-api-key
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
NEXT_PUBLIC_APP_NAME=玉掌智慧羅盤

# 支付相關（待添加）
ALIPAY_APP_ID=your_alipay_app_id
ALIPAY_PRIVATE_KEY=your_alipay_private_key
WECHAT_APP_ID=your_wechat_app_id
WECHAT_API_KEY=your_wechat_api_key
```

### 3. **數據庫設置 (建議)**
- [ ] **用戶管理系統**
  - 用戶註冊/登入功能
  - 付費狀態記錄
  - 分析歷史保存

- [ ] **訂單管理**
  - 付款訂單記錄
  - 交易狀態追蹤
  - 退款處理

### 4. **安全性檢查**
- [x] API 密鑰已從代碼中移除
- [x] 環境變數正確配置
- [ ] 添加請求頻率限制
- [ ] 添加用戶身份驗證
- [ ] HTTPS 證書配置

### 5. **知識庫部署**
- [x] 知識庫檔案已添加到 Git
- [x] .gitignore 已更新
- [x] 知識庫檔案將正確部署到 Vercel

## 📋 **當前狀態檢查**

### ✅ **已完成項目**
- 基本功能完整
- 知識庫檔案已添加到 Git
- 付款 UI 介面完成
- 測試付款功能正常
- 深度分析報告功能完整
- 健康檢查 API 已添加

### ⚠️ **需要完善項目**
1. **真實支付整合** - 目前只有測試功能
2. **用戶認證系統** - 需要追蹤付費用戶
3. **數據庫集成** - 保存用戶數據和訂單
4. **錯誤監控** - 生產環境錯誤追蹤
5. **性能優化** - 圖片壓縮、CDN 配置

### 🔧 **生產環境測試步驟**
1. 部署到 Vercel
2. 訪問 `/api/health-check` 檢查系統狀態
3. 測試手相分析流程
4. 測試付款流程（測試模式）
5. 檢查知識庫內容載入

## 💰 **收費功能狀態**
- **深度生命藍圖**: ¥38 ✅ 已就緒
- **十年大運趨勢**: ¥128 ✅ 已就緒
- **完整深度報告**: 包含詳細知識庫內容 ✅ 已就緒

## 🚀 **部署命令**
```bash
# 提交最新更改
git add .
git commit -m "Production ready deployment"
git push origin main

# Vercel 會自動部署
```

## ⚡ **緊急修復清單**
如果需要立即上線，最低要求：
1. 確保 DeepSeek API 密鑰正確配置
2. 知識庫檔案正確部署
3. 暫時保留測試付款功能
4. 添加付款成功後的用戶追蹤機制