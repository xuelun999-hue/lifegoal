'use client'

import { useState } from 'react'
import { User, Calendar, Users } from 'lucide-react'

interface UserInfo {
  gender: 'male' | 'female' | 'other' | null;
  birthYear: number | null;
}

interface UserInfoFormProps {
  onInfoUpdate: (userInfo: UserInfo) => void;
  initialInfo?: UserInfo;
}

export default function UserInfoForm({ onInfoUpdate, initialInfo }: UserInfoFormProps) {
  const [userInfo, setUserInfo] = useState<UserInfo>(
    initialInfo || { gender: null, birthYear: null }
  )

  const currentYear = new Date().getFullYear()
  const minYear = currentYear - 100
  const maxYear = currentYear - 10

  const handleGenderChange = (gender: 'male' | 'female' | 'other') => {
    const newInfo = { ...userInfo, gender }
    setUserInfo(newInfo)
    onInfoUpdate(newInfo)
  }

  const handleBirthYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const birthYear = e.target.value ? parseInt(e.target.value) : null
    const newInfo = { ...userInfo, birthYear }
    setUserInfo(newInfo)
    onInfoUpdate(newInfo)
  }

  const isComplete = userInfo.gender && userInfo.birthYear

  return (
    <div className="card mb-6">
      <div className="flex items-center mb-4">
        <User className="w-5 h-5 text-jade-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 font-chinese">
          個人資料
        </h3>
      </div>
      
      <div className="space-y-4">
        {/* 性別選擇 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
            <Users className="w-4 h-4 inline mr-1" />
            性別
          </label>
          <div className="flex space-x-3">
            <button
              onClick={() => handleGenderChange('male')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                userInfo.gender === 'male'
                  ? 'bg-jade-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              男性
            </button>
            <button
              onClick={() => handleGenderChange('female')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                userInfo.gender === 'female'
                  ? 'bg-jade-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              女性
            </button>
            <button
              onClick={() => handleGenderChange('other')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                userInfo.gender === 'other'
                  ? 'bg-jade-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              其他
            </button>
          </div>
        </div>

        {/* 出生年份選擇 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-chinese">
            <Calendar className="w-4 h-4 inline mr-1" />
            出生年份
          </label>
          <select
            value={userInfo.birthYear || ''}
            onChange={handleBirthYearChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-jade-500 focus:border-jade-500 text-gray-900"
          >
            <option value="">請選擇出生年份</option>
            {Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i).map(year => (
              <option key={year} value={year}>
                {year}年
              </option>
            ))}
          </select>
        </div>

        {/* 完成狀態提示 */}
        {isComplete && (
          <div className="bg-jade-50 border border-jade-200 rounded-lg p-3">
            <p className="text-jade-700 text-sm font-chinese">
              ✓ 個人資料已完成，可以開始上傳手相照片
            </p>
          </div>
        )}
        
        {!isComplete && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-700 text-sm font-chinese">
              請完成個人資料填寫以獲得更準確的分析結果
            </p>
          </div>
        )}
      </div>

      {/* 隱私聲明 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 font-chinese">
          🔒 您的個人資料僅用於手相分析，我們承諾嚴格保護您的隱私
        </p>
      </div>
    </div>
  )
}