'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import UploadSection from '@/components/UploadSection'
import AnalysisResult from '@/components/AnalysisResult'
import IntroSection from '@/components/IntroSection'

export default function Home() {
  const [analysisData, setAnalysisData] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleImageUpload = async (file: File) => {
    setIsAnalyzing(true)
    
    // Mock AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Mock analysis result
    const mockResult = {
      handType: '木型手',
      personality: '創造力豐富，具有藝術天賦，思維活躍',
      career: '適合從事創意、藝術或教育相關工作',
      wealth: '財運中等，需要透過努力和智慧累積財富',
      health: '注意肝膽和神經系統的保養',
      relationship: '感情豐富，但需要學會表達和溝通',
      confidence: 85
    }
    
    setAnalysisData(mockResult)
    setIsAnalyzing(false)
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