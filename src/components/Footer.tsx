'use client';

import { Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* 客服聯繫方式 */}
          <div className="flex items-center space-x-2 text-gray-600">
            <Mail className="w-4 h-4" />
            <span className="text-sm">客服聯繫：</span>
            <a 
              href="mailto:unesco999@gmail.com" 
              className="text-jade-600 hover:text-jade-700 transition-colors text-sm"
            >
              unesco999@gmail.com
            </a>
          </div>
          
          {/* 版權聲明 */}
          <div className="text-center text-gray-500 text-sm">
            <p>© {currentYear} 玉掌智慧羅盤. 保留所有權利.</p>
            <p className="mt-1">本服務僅供娛樂參考，不作為人生決策依據</p>
          </div>
        </div>
        
        {/* 免責聲明 */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            本應用基於傳統手相學理論結合現代技術提供分析服務。分析結果僅供參考娛樂，
            不應作為重大人生決策的唯一依據。請理性對待分析內容，如有疑問請聯繫客服。
          </p>
        </div>
      </div>
    </footer>
  );
}