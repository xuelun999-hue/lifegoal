'use client'

import { Hand, Compass } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Hand className="w-8 h-8 text-jade-600" />
              <Compass className="w-6 h-6 text-jade-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-chinese">
                玉掌智慧羅盤
              </h1>
              <p className="text-sm text-gray-600">Jade Palm Wisdom Compass</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="btn-secondary">
              登入
            </button>
            <button className="btn-primary">
              註冊
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}