'use client'

import { useState } from 'react'
import { Star, TrendingUp, Heart, Shield, RotateCcw, Lock, Crown } from 'lucide-react'
import { AnalysisData } from '@/types'

interface AnalysisResultProps {
  data: AnalysisData
  onReset: () => void
}

export default function AnalysisResult({ data, onReset }: AnalysisResultProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: '總覽', icon: <Star className="w-4 h-4" /> },
    { id: 'career', label: '事業', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'relationship', label: '感情', icon: <Heart className="w-4 h-4" /> },
    { id: 'health', label: '健康', icon: <Shield className="w-4 h-4" /> },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-jade-50 rounded-lg p-6 border border-jade-200">
              <h3 className="text-lg font-semibold text-jade-800 mb-3 font-chinese">
                手型分析：{data.handType}
              </h3>
              <p className="text-jade-700 leading-relaxed">
                {data.personality}
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3 font-chinese">
                分析可信度
              </h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${data.confidence}%` }}
                  ></div>
                </div>
                <span className="text-blue-700 font-semibold">
                  {data.confidence}%
                </span>
              </div>
            </div>
          </div>
        )
      
      case 'career':
        return (
          <div className="space-y-4">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 font-chinese">
                事業與財運
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {data.career}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {data.wealth}
              </p>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Lock className="w-4 h-4 text-amber-600 mr-2" />
                <span className="text-amber-800 font-medium">深度事業運勢分析</span>
              </div>
              <p className="text-amber-700 text-sm">
                解鎖完整報告查看十年大運、最佳轉職時機、投資建議等詳細內容
              </p>
              <button className="mt-3 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700 transition-colors">
                解鎖完整報告 ¥38
              </button>
            </div>
          </div>
        )
      
      case 'relationship':
        return (
          <div className="space-y-4">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 font-chinese">
                感情與人際
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {data.relationship}
              </p>
            </div>
            
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Crown className="w-4 h-4 text-pink-600 mr-2" />
                <span className="text-pink-800 font-medium">情感合盤分析</span>
              </div>
              <p className="text-pink-700 text-sm">
                上傳伴侶手相，獲得專業的情感相配度分析與相處建議
              </p>
              <button className="mt-3 bg-pink-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-700 transition-colors">
                情感合盤報告 ¥48
              </button>
            </div>
          </div>
        )
      
      case 'health':
        return (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 font-chinese">
              健康與養生
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {data.health}
            </p>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 font-chinese">
            您的手相分析報告
          </h2>
          <button
            onClick={onReset}
            className="btn-secondary flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重新分析</span>
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-jade-500 text-jade-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                <span className="font-chinese">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Tab Content */}
        {renderTabContent()}
      </div>
      
      {/* Premium Features */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card border-2 border-jade-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-jade-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-jade-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 font-chinese">
              深度生命藍圖
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              完整的性格、事業、感情、健康、家庭關係分析
            </p>
            <button className="btn-primary w-full">
              解鎖完整報告 ¥38
            </button>
          </div>
        </div>
        
        <div className="card border-2 border-purple-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 font-chinese">
              十年大運趨勢
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              未來十年運勢預測與人生規劃建議
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors w-full">
              年度訂閱 ¥128
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}