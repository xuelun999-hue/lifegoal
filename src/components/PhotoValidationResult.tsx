'use client'

import { AlertTriangle, CheckCircle, X, RotateCcw } from 'lucide-react'
import { PhotoValidationResult } from '@/lib/photo-validator'

interface PhotoValidationResultProps {
  result: PhotoValidationResult;
  onRetry: () => void;
  onProceed: () => void;
  uploadedImage: string;
}

export default function PhotoValidationResultComponent({ 
  result, 
  onRetry, 
  onProceed,
  uploadedImage 
}: PhotoValidationResultProps) {
  
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 75) return 'bg-green-50 border-green-200';
    if (score >= 50) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  }

  const CheckItem = ({ isValid, label }: { isValid: boolean; label: string }) => (
    <div className="flex items-center space-x-2 py-1">
      {isValid ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-red-500" />
      )}
      <span className={`text-sm ${isValid ? 'text-green-700' : 'text-red-700'}`}>
        {label}
      </span>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        {/* 照片預覽 */}
        <div className="mb-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={uploadedImage} 
            alt="上傳的手掌照片" 
            className="w-64 h-64 object-cover rounded-lg mx-auto border-2 border-gray-200"
          />
        </div>

        {/* 驗證結果標題 */}
        <div className={`rounded-lg p-4 mb-6 border-2 ${getScoreBgColor(result.score)}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 font-chinese">
              照片質量檢測結果
            </h3>
            <div className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
              {result.score}/100
            </div>
          </div>
          
          {result.isValid ? (
            <div className="flex items-center text-green-700">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-medium font-chinese">照片質量良好，可以進行分析</span>
            </div>
          ) : (
            <div className="flex items-center text-red-700">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span className="font-medium font-chinese">照片質量需要改善</span>
            </div>
          )}
        </div>

        {/* 詳細檢測項目 */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 font-chinese">檢測項目</h4>
            <CheckItem 
              isValid={result.details.fingersDetected} 
              label="五根手指清楚可見" 
            />
            <CheckItem 
              isValid={result.details.palmLinesVisible} 
              label="掌紋線條清晰" 
            />
            <CheckItem 
              isValid={result.details.lightingAdequate} 
              label="光線充足均勻" 
            />
            <CheckItem 
              isValid={result.details.overallClarity} 
              label="整體清晰度良好" 
            />
          </div>

          {/* 問題和建議 */}
          {(result.issues.length > 0 || result.suggestions.length > 0) && (
            <div className="space-y-2">
              {result.issues.length > 0 && (
                <div>
                  <h4 className="font-semibold text-red-600 font-chinese">發現問題</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {result.issues.map((issue, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 mr-1">•</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {result.suggestions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-blue-600 font-chinese">改善建議</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {result.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-1">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 拍攝技巧提示 */}
        {!result.isValid && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-800 mb-2 font-chinese">
              拍攝技巧提示：
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 在自然光或充足的室內燈光下拍攝</li>
              <li>• 手掌完全展開，五指自然分開</li>
              <li>• 手掌垂直於鏡頭，距離20-30公分</li>
              <li>• 使用手機後置鏡頭以獲得更好的清晰度</li>
              <li>• 確保手掌佔據照片的主要區域</li>
              <li>• 避免陰影遮擋和強光反射</li>
            </ul>
          </div>
        )}

        {/* 操作按鈕 */}
        <div className="flex space-x-4">
          <button
            onClick={onRetry}
            className="flex-1 btn-secondary flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重新上傳</span>
          </button>
          
          {result.isValid ? (
            <button
              onClick={onProceed}
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>開始分析</span>
            </button>
          ) : (
            <div className="flex-1">
              <button
                onClick={onProceed}
                className="w-full bg-gray-300 text-gray-500 font-medium py-2 px-4 rounded-lg cursor-not-allowed"
                disabled
              >
                照片質量不符合要求
              </button>
              <p className="text-xs text-gray-500 mt-1 text-center">
                需要通過所有檢測項目才能進行分析
              </p>
            </div>
          )}
        </div>

        {/* 質量標準說明 */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 font-chinese">
            <strong>質量標準：</strong>為確保分析準確性，照片必須清楚顯示五根手指、主要掌紋線條，
            且光線充足、圖像清晰。不符合標準的照片可能導致分析結果不準確。
          </p>
        </div>
      </div>
    </div>
  )
}