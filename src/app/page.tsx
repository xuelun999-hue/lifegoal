'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import UploadSection from '@/components/UploadSection'
import AnalysisResult from '@/components/AnalysisResult'
import IntroSection from '@/components/IntroSection'
import { AnalysisData } from '@/types'

export default function Home() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const handleImageUpload = async (file: File) => {
    setIsAnalyzing(true)
    
    try {
      // 將檔案轉換為 base64
      const base64 = await fileToBase64(file)
      
      // 調用真實的分析 API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: base64,
          userInfo: {
            gender: 'unknown' // 可以後續添加性別選擇功能
          }
        })
      })
      
      if (!response.ok) {
        throw new Error('分析請求失敗')
      }
      
      const analysisResult = await response.json()
      setAnalysisData(analysisResult)
      
    } catch (error) {
      console.error('分析失敗:', error)
      // 如果API失敗，顯示錯誤訊息
      alert('分析過程中發生錯誤，請稍後再試')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {!analysisData ? (
          <>
            <IntroSection />
            <UploadSection 
              onImageUpload={handleImageUpload}
              isAnalyzing={isAnalyzing}
            />
          </>
        ) : (
          <AnalysisResult 
            data={analysisData}
            onReset={() => setAnalysisData(null)}
          />
        )}
      </main>
    </div>
  )
}