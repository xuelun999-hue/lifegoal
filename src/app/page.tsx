'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import UploadSection from '@/components/UploadSection'
import AnalysisResult from '@/components/AnalysisResult'
import IntroSection from '@/components/IntroSection'
import UserInfoForm from '@/components/UserInfoForm'
import PhotoValidationResult from '@/components/PhotoValidationResult'
import { AnalysisData } from '@/types'
import { PhotoValidator, PhotoValidationResult as ValidationResult } from '@/lib/photo-validator'

interface UserInfo {
  gender: 'male' | 'female' | 'other' | null;
  birthYear: number | null;
}

export default function Home() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo>({ gender: null, birthYear: null })
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  
  // 照片验证器实例
  const photoValidator = new PhotoValidator()

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
      setIsValidating(true)
      setValidationResult(null)
      setAnalysisData(null)
      
      // 將檔案轉換為 base64
      const base64 = await fileToBase64(file)
      setUploadedImage(base64)
      
      // 驗證照片質量
      const validation = await photoValidator.validatePalmPhoto(base64)
      setValidationResult(validation)
      
    } catch (error) {
      console.error('照片處理失敗:', error)
      alert('照片處理失敗，請重新上傳')
    } finally {
      setIsValidating(false)
    }
  }

  const handleProceedWithAnalysis = async () => {
    if (!uploadedImage || !validationResult?.isValid) {
      return
    }
    
    setIsAnalyzing(true)
    
    try {
      // 調用真實的分析 API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: uploadedImage,
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

  const handleRetryUpload = () => {
    setUploadedImage(null)
    setValidationResult(null)
    setAnalysisData(null)
  }

  const handleReset = () => {
    setUploadedImage(null)
    setValidationResult(null)
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
    
    // 显示照片验证结果
    if (validationResult && uploadedImage) {
      return (
        <PhotoValidationResult
          result={validationResult}
          onRetry={handleRetryUpload}
          onProceed={handleProceedWithAnalysis}
          uploadedImage={uploadedImage}
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
          isAnalyzing={isValidating || isAnalyzing}
          disabled={!userInfo.gender || !userInfo.birthYear}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  )
}