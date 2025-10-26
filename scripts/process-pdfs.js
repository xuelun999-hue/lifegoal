const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const PDFS_DIR = path.join(__dirname, '../knowledge/pdfs');
const PROCESSED_DIR = path.join(__dirname, '../knowledge/processed');

async function processPDFs() {
  try {
    // 確保處理目錄存在
    if (!fs.existsSync(PROCESSED_DIR)) {
      fs.mkdirSync(PROCESSED_DIR, { recursive: true });
    }

    // 讀取PDF目錄
    const pdfFiles = fs.readdirSync(PDFS_DIR).filter(file => file.endsWith('.pdf'));
    
    if (pdfFiles.length === 0) {
      console.log('❌ 在 knowledge/pdfs/ 目錄中未找到PDF檔案');
      console.log('請將你的PDF知識庫檔案放入 knowledge/pdfs/ 目錄');
      return;
    }

    console.log(`📚 找到 ${pdfFiles.length} 個PDF檔案，開始處理...`);

    for (const pdfFile of pdfFiles) {
      console.log(`🔄 正在處理: ${pdfFile}`);
      
      try {
        const pdfPath = path.join(PDFS_DIR, pdfFile);
        const dataBuffer = fs.readFileSync(pdfPath);
        
        // 解析PDF
        const data = await pdf(dataBuffer);
        
        // 清理文本
        const cleanText = data.text
          .replace(/\s+/g, ' ')  // 合併多個空格
          .replace(/\n\s*\n/g, '\n\n')  // 清理多餘換行
          .trim();

        // 生成Markdown檔案
        const baseName = path.basename(pdfFile, '.pdf');
        const mdFileName = `${baseName}.md`;
        const mdPath = path.join(PROCESSED_DIR, mdFileName);
        
        const mdContent = `# ${baseName.replace(/-/g, ' ').toUpperCase()}

> 從 ${pdfFile} 提取的內容

${cleanText}

---
*處理時間: ${new Date().toISOString()}*
*頁數: ${data.numpages}*
*字數: ${cleanText.length}*
`;

        fs.writeFileSync(mdPath, mdContent, 'utf8');
        
        console.log(`✅ ${pdfFile} → ${mdFileName} (${data.numpages}頁, ${cleanText.length}字)`);
        
      } catch (fileError) {
        console.error(`❌ 處理 ${pdfFile} 時發生錯誤:`, fileError.message);
      }
    }

    console.log('\n🎉 PDF處理完成！');
    console.log('📝 處理後的文件位於: knowledge/processed/');
    console.log('🔧 接下來可以將這些內容整合到DeepSeek知識庫中');

  } catch (error) {
    console.error('❌ 處理過程中發生錯誤:', error);
  }
}

// 運行處理腳本
processPDFs();