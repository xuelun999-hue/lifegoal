'use client'

import { useState, useRef } from 'react'
import { Upload, Camera, Loader2, CheckCircle } from 'lucide-react'

interface UploadSectionProps {
  onImageUpload: (file: File) => void
  isAnalyzing: boolean
}

export default function UploadSection({ onImageUpload, isAnalyzing }: UploadSectionProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0])
    }
  }

  const handleFiles = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      onImageUpload(file)
    }
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  if (isAnalyzing) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          {uploadedImage && (
            <div className="mb-6">
              <img 
                src={uploadedImage} 
                alt="已上傳的手掌照片" 
                className="w-64 h-64 object-cover rounded-lg mx-auto border-2 border-jade-200"
              />
            </div>
          )}
          
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 text-jade-600 animate-spin mr-3" />
            <span className="text-lg font-semibold text-gray-900 font-chinese">
              正在分析您的手相...
            </span>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              識別手型特徵
            </div>
            <div className="flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-jade-500 animate-spin mr-2" />
              分析掌紋線條
            </div>
            <div className="flex items-center justify-center text-gray-400">
              <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2"></div>
              生成詳細報告
            </div>
          </div>
          
          <p className="mt-4 text-gray-500">
            請稍候，我們正在運用玉掌派的古老智慧為您解讀...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragActive 
              ? 'border-jade-400 bg-jade-50' 
              : 'border-gray-300 hover:border-jade-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleChange}
          />
          
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-jade-100 rounded-full">
                <Upload className="w-8 h-8 text-jade-600" />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-chinese">
                上傳您的手掌照片
              </h3>
              <p className="text-gray-600 mb-4">
                支援 JPG、PNG 格式，建議照片清晰度高於 2MP
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={onButtonClick}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <Camera className="w-5 h-5" />
                <span>選擇照片</span>
              </button>
              
              <p className="text-sm text-gray-500">
                或將照片拖放到此區域
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2 font-chinese">
            拍攝建議：
          </h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• 確保手掌完全展開，五指自然伸直</li>
            <li>• 選擇光線充足的環境，避免陰影</li>
            <li>• 手掌垂直於鏡頭，避免傾斜角度</li>
            <li>• 建議使用手機後置鏡頭拍攝</li>
          </ul>
        </div>
      </div>
    </div>
  )
}