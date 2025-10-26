'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import UploadSection from '@/components/UploadSection'
import AnalysisResult from '@/components/AnalysisResult'
import IntroSection from '@/components/IntroSection'
import UserInfoForm from '@/components/UserInfoForm'
import { AnalysisData } from '@/types'

interface UserInfo {
  gender: 'male' | 'female' | 'other' | null;
  birthYear: number | null;
}

export default function Home() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo>({ gender: null, birthYear: null })
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const handleImageUpload = async (file: File) => {
    try {
      setIsAnalyzing(true)
      setAnalysisData(null)
      
      // 將檔案轉換為 base64
      const base64 = await fileToBase64(file)
      setUploadedImage(base64)
      
      // 直接進行分析，跳過驗證步驟
      await performAnalysis(base64)
      
    } catch (error) {
      console.error('照片處理失敗:', error)
      alert('照片處理失敗，請重新上傳')
      setIsAnalyzing(false)
    }
  }

  const performAnalysis = async (imageData: string) => {
    try {
      // 調用真實的分析 API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: imageData,
          userInfo: {
            gender: userInfo.gender || 'unknown',
            birthYear: userInfo.birthYear,
            age: userInfo.birthYear ? new Date().getFullYear() - userInfo.birthYear : undefined
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
      alert('分析過程中發生錯誤，請稍後再試')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setUploadedImage(null)
    setAnalysisData(null)
    setUserInfo({ gender: null, birthYear: null })
  }

  // 渲染不同的界面状态
  const renderContent = () => {
    // 显示分析结果
    if (analysisData) {
      return (
        <AnalysisResult 
          data={analysisData}
          onReset={handleReset}
        />
      )
    }
    
    // 显示上传界面
    return (
      <>
        <IntroSection />
        <UserInfoForm 
          onInfoUpdate={setUserInfo}
          initialInfo={userInfo}
        />
        <UploadSection 
          onImageUpload={handleImageUpload}
          isAnalyzing={isAnalyzing}
          disabled={!userInfo.gender || !userInfo.birthYear}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-1">
        {renderContent()}
      </main>
      <Footer />
    </div>
  )
}