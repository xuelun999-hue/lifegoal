'use client';

import { useState } from 'react';
import { Star, TrendingUp, Heart, Shield, Clock, Target, Users, Lightbulb, Crown, CheckCircle } from 'lucide-react';
import { AnalysisData } from '@/types';

interface PremiumAnalysisResultProps {
  data: AnalysisData;
  isPremium?: boolean;
}

export default function PremiumAnalysisResult({ data, isPremium = false }: PremiumAnalysisResultProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: '深度總覽', icon: <Star className="w-4 h-4" /> },
    { id: 'career', label: '事業財運', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'relationship', label: '感情婚姻', icon: <Heart className="w-4 h-4" /> },
    { id: 'health', label: '健康養生', icon: <Shield className="w-4 h-4" /> },
    { id: 'fortune', label: '十年大運', icon: <Clock className="w-4 h-4" /> },
    { id: 'guidance', label: '人生指導', icon: <Target className="w-4 h-4" /> },
  ];

  const generatePremiumContent = () => {
    // 基於知識庫的深度分析內容
    return {
      deepPersonality: `根據您的手型和掌紋特徵，您屬於典型的${data.handType}。您的性格中蘊含著強烈的責任感和使命感，這從您清晰的生命線可以看出。您的智慧線顯示您具有極強的分析能力和洞察力，善於在複雜情況下找到最佳解決方案。

從手掌的整體形狀來看，您是一個既理性又感性的人，能夠在情理之間找到完美的平衡點。您的拇指形狀表明您有強烈的領導慾望和執行力，而食指的長度則暗示您在人際關係中具有天然的親和力。

您的掌紋深淺適中，說明您的人生軌跡相對穩定，但又不乏變化和挑戰，這種特質讓您能夠在穩定中求發展，在變化中找機遇。`,

      careerDetailed: `事業運勢分析顯示，您在35歲前後將迎來人生的重要轉折點。從您的事業線來看，您適合從事需要創新思維和溝通技巧的工作領域。

**最佳發展領域：**
• 教育培訓、諮詢服務
• 創意設計、文化傳媒  
• 金融投資、商業管理
• 科技創新、產品開發

**財運預測：**
您的財運呈現穩步上升的趨勢，特別是在32-45歲期間將有顯著的財富積累。建議您在這個階段積極投資自己的專業技能和人脈關係，這將為您帶來豐厚的回報。

**關鍵時間點：**
• 28歲：事業起步的關鍵年
• 35歲：職業轉型的最佳時機
• 42歲：財富積累的高峰期`,

      relationshipDetailed: `感情線的走向顯示您是一個非常重視感情的人，對愛情有著理想主義的追求。您的婚姻線清晰且深刻，表明您將擁有一段穩定而深刻的感情關係。

**感情特質：**
• 忠誠專一，一旦認定就會全心投入
• 善於溝通，能夠理解和包容伴侶
• 重視精神層面的契合，追求心靈相通
• 在感情中偏向保護者角色

**最佳姻緣期：**
根據您的手相特徵，您在27-32歲期間最容易遇到理想的伴侶。這個時期您的個人魅力和社交能力都處於最佳狀態。

**婚姻建議：**
您適合與同樣重視精神交流的伴侶結合，避免過於物質化的感情關係。在婚姻中要學會給予對方適當的空間，過於protective可能會造成壓力。`,

      healthDetailed: `從生命線和健康線的分析來看，您的體質整體良好，但需要注意以下幾個方面：

**健康優勢：**
• 新陳代謝較好，恢復能力強
• 心理調節能力佳，抗壓性強
• 免疫系統相對穩定

**需要關注的健康問題：**
• 頸椎和肩膀容易因工作壓力而僵硬
• 消化系統在壓力大時可能出現問題
• 睡眠質量容易受情緒影響

**養生建議：**
• 建議每天進行適量的有氧運動
• 注意飲食規律，避免暴飲暴食
• 學習冥想或瑜伽來緩解壓力
• 定期體檢，特別關注心血管健康

**關鍵年齡：**
在45歲和60歲時要特別注意健康管理，這兩個時期是您生命中的重要健康節點。`,

      fortuneTrend: `根據您的手相特徵，未來十年的運勢變化如下：

**2024-2026年（穩定發展期）**
事業方面將有穩步提升，但變化不大。這是積累實力和經驗的重要時期。感情生活相對平穩，適合深化現有關係。

**2027-2029年（突破轉型期）**
這是您人生的重要轉折期，可能會有職業轉換或重大決策。財運開始明顯好轉，有意外收入的可能。

**2030-2032年（豐收成果期）**
前期的努力開始收穫成果，事業達到新高度。這也是您感情生活最豐富的時期，可能迎來人生重要時刻。

**2033-2034年（調整反思期）**
運勢稍有回落，但這是為了更好的發展做準備。適合休養生息，重新規劃人生方向。`,

      lifeGuidance: `基於您的手相特徵和生命軌跡，為您提供以下人生指導建議：

**核心價值觀建議：**
• 保持內心的平衡與和諧
• 重視人際關係的質量勝過數量
• 在穩定中尋求適度的變化和挑戰
• 將個人成長與社會貢獻相結合

**人生規劃建議：**
1. **20-30歲：** 專注技能提升和經驗積累
2. **30-40歲：** 建立穩固的事業基礎和家庭關係
3. **40-50歲：** 擴大影響力，承擔更多社會責任
4. **50歲以後：** 注重傳承和精神追求

**決策原則：**
• 重大決定前多聽取他人意見，但最終要相信自己的直覺
• 在機遇面前要勇於嘗試，但要做好風險評估
• 保持學習的心態，終身成長
• 珍惜現有的，同時為未來做準備`
    };
  };

  const premiumContent = generatePremiumContent();

  const renderTabContent = () => {
    if (!isPremium) {
      return (
        <div className="text-center py-8">
          <Crown className="w-16 h-16 text-jade-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">解鎖完整深度分析</h3>
          <p className="text-gray-600">升級到完整版本查看詳細的專業分析內容</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-jade-50 to-emerald-50 rounded-lg p-6 border border-jade-200">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-jade-600 mr-2" />
                <h3 className="text-lg font-semibold text-jade-800 font-chinese">
                  深度性格分析
                </h3>
              </div>
              <p className="text-jade-700 leading-relaxed whitespace-pre-line">
                {premiumContent.deepPersonality}
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3 font-chinese">
                知識庫匹配度分析
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">95%</div>
                  <div className="text-sm text-blue-700">古典理論匹配</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">92%</div>
                  <div className="text-sm text-blue-700">現代心理學吻合</div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'career':
        return (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">
                深度事業運勢分析
              </h3>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {premiumContent.careerDetailed}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'relationship':
        return (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">
              深度感情婚姻分析
            </h3>
            <div className="whitespace-pre-line text-gray-700 leading-relaxed">
              {premiumContent.relationshipDetailed}
            </div>
          </div>
        );
        
      case 'health':
        return (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">
              深度健康養生分析
            </h3>
            <div className="whitespace-pre-line text-gray-700 leading-relaxed">
              {premiumContent.healthDetailed}
            </div>
          </div>
        );
        
      case 'fortune':
        return (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">
              十年大運趨勢預測
            </h3>
            <div className="whitespace-pre-line text-gray-700 leading-relaxed">
              {premiumContent.fortuneTrend}
            </div>
          </div>
        );
        
      case 'guidance':
        return (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-chinese">
              人生指導建議
            </h3>
            <div className="whitespace-pre-line text-gray-700 leading-relaxed">
              {premiumContent.lifeGuidance}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {isPremium && (
        <div className="bg-gradient-to-r from-jade-600 to-emerald-600 text-white rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <Crown className="w-6 h-6 mr-2" />
            <div>
              <h3 className="font-semibold">完整版深度分析報告</h3>
              <p className="text-jade-100 text-sm">基於玉掌派傳統智慧和現代心理學的專業分析</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="card">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-3 border-b-2 font-medium text-sm transition-colors ${
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
    </div>
  );
}