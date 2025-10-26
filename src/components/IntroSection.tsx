'use client'

import { Star, Shield, Zap, Heart } from 'lucide-react'

export default function IntroSection() {
  const features = [
    {
      icon: <Star className="w-6 h-6 text-jade-600" />,
      title: '古典玉掌派智慧',
      description: '基於中國傳統手相學精髓'
    },
    {
      icon: <Zap className="w-6 h-6 text-jade-600" />,
      title: '精準分析',
      description: '系統化解讀掌紋奧秘'
    },
    {
      icon: <Shield className="w-6 h-6 text-jade-600" />,
      title: '隱私保護',
      description: '您的個人資料完全保密'
    },
    {
      icon: <Heart className="w-6 h-6 text-jade-600" />,
      title: '個人化指引',
      description: '專屬於您的生命藍圖解讀'
    }
  ]

  return (
    <div className="text-center mb-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 font-chinese">
          探索您的生命密碼
        </h2>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          透過古典玉掌派的智慧與現代技術，深度解讀您的掌紋奧秘
          <br />
          了解性格特質、事業方向、感情運勢與人生規劃
        </p>
        
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="card text-center">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 font-chinese">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="bg-jade-50 rounded-xl p-6 border border-jade-100">
          <h3 className="text-lg font-semibold text-jade-800 mb-2 font-chinese">
            開始您的智慧之旅
          </h3>
          <p className="text-jade-700">
            上傳您的手掌照片，讓我們為您揭開生命的奧秘
          </p>
        </div>
      </div>
    </div>
  )
}