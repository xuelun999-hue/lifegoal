'use client'

import { useState } from 'react'
import { Star, TrendingUp, Heart, Shield, RotateCcw, Lock, Crown, Eye } from 'lucide-react'
import { AnalysisData } from '@/types'
import PaymentModal from './PaymentModal'
import PremiumAnalysisResult from './PremiumAnalysisResult'
import { PalmVisualization } from './PalmVisualization'

interface AnalysisResultProps {
  data: AnalysisData
  onReset: () => void
  uploadedImage?: string | null
}

export default function AnalysisResult({ data, onReset, uploadedImage }: AnalysisResultProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false)
  const [currentPackage, setCurrentPackage] = useState({ name: '', amount: 0 })

  const tabs = [
    { id: 'overview', label: '總覽', icon: <Star className="w-4 h-4" /> },
    { id: 'visualization', label: '手掌特徵', icon: <Eye className="w-4 h-4" /> },
    { id: 'career', label: '事業', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'relationship', label: '感情', icon: <Heart className="w-4 h-4" /> },
    { id: 'health', label: '健康', icon: <Shield className="w-4 h-4" /> },
  ]

  const handlePurchase = (packageName: string, amount: number) => {
    setCurrentPackage({ name: packageName, amount });
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setIsPremiumUnlocked(true);
    alert('付款成功！現在可以查看完整深度分析報告了！');
  };

  // 如果已解鎖完整版，顯示高級分析結果
  if (isPremiumUnlocked) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-chinese mb-2">
              完整深度分析報告
            </h2>
            <p className="text-gray-600">基於玉掌派知識庫的專業分析</p>
          </div>
          <button
            onClick={onReset}
            className="btn-secondary flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重新分析</span>
          </button>
        </div>
        <PremiumAnalysisResult data={data} isPremium={true} />
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'visualization':
        if (!uploadedImage || !data.palmPositioning) {
          return (
            <div className="text-center py-8">
              <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">手掌特徵分析數據不可用</p>
            </div>
          );
        }
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">
              手掌特徵視覺化分析
            </h3>
            <PalmVisualization 
              imageUrl={uploadedImage}
              palmFeatures={data.palmPositioning.features}
              onRegenerateFeatures={() => {
                // 可以在這裡添加重新分析功能
                console.log('重新分析手掌特徵');
              }}
            />
            
            {/* 顯示檢測質量報告 */}
            {data.palmPositioning.quality && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">檢測質量報告</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>檢測狀態:</span>
                    <span className={data.palmPositioning.quality.isValid ? 'text-green-600' : 'text-red-600'}>
                      {data.palmPositioning.quality.isValid ? '✓ 合格' : '✗ 需要改進'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>質量評分:</span>
                    <span>{data.palmPositioning.quality.score.toFixed(1)}分</span>
                  </div>
                  {data.palmPositioning.quality.issues.length > 0 && (
                    <div>
                      <span className="font-medium">問題:</span>
                      <ul className="list-disc list-inside ml-4 text-gray-600">
                        {data.palmPositioning.quality.issues.map((issue, index) => (
                          <li key={index}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {data.palmPositioning.quality.suggestions.length > 0 && (
                    <div>
                      <span className="font-medium">建議:</span>
                      <ul className="list-disc list-inside ml-4 text-gray-600">
                        {data.palmPositioning.quality.suggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
        
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
            <button 
              onClick={() => handlePurchase('深度生命藍圖', 38)}
              className="btn-primary w-full"
            >
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
            <button 
              onClick={() => handlePurchase('十年大運趨勢', 128)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors w-full"
            >
              年度訂閱 ¥128
            </button>
          </div>
        </div>
      </div>
      
      {/* 付款模態框 */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
        amount={currentPackage.amount}
        packageName={currentPackage.name}
      />
    </div>
  )
}