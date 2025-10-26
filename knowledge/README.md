# 知識庫目錄結構

## 📁 目錄說明

```
knowledge/
├── pdfs/                   # 🔴 在這裡放置你的PDF檔案
│   ├── palmistry-guide.pdf
│   ├── hand-analysis.pdf
│   └── ...更多PDF檔案
├── processed/              # 處理後的文本檔案 (自動生成)
│   ├── palmistry-guide.md
│   ├── hand-analysis.md
│   └── ...對應的Markdown檔案
└── embeddings/             # 向量化數據 (自動生成)
    ├── palmistry-guide.json
    └── ...向量數據檔案
```

## 📤 上傳你的PDF檔案

**請將你的PDF知識庫檔案放入以下目錄：**
```
/knowledge/pdfs/
```

### 建議的檔案命名規範：
- `palmistry-basics.pdf` - 手相學基礎理論
- `hand-types.pdf` - 手型分類詳解
- `palm-lines.pdf` - 掌紋線條分析
- `special-marks.pdf` - 特殊記號含義
- `combination-rules.pdf` - 組合判斷法則

## 🔧 處理流程

1. **上傳PDF** → `knowledge/pdfs/`
2. **自動處理** → 提取文本到 `knowledge/processed/`
3. **向量化** → 生成嵌入向量到 `knowledge/embeddings/`
4. **集成使用** → DeepSeek API調用時參考

## 🚀 使用方式

上傳PDF後，運行以下命令處理知識庫：

```bash
# 安裝PDF處理依賴
npm install pdf-parse

# 運行知識庫處理腳本
npm run process-knowledge
```

## ⚠️ 注意事項

- PDF檔案大小建議不超過50MB
- 確保PDF文字可選取（非純圖片）
- 檔案名使用英文和連字符，避免特殊字符
- 處理後的檔案會自動gitignore，不會上傳到GitHub