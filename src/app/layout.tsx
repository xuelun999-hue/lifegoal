import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '玉掌智慧羅盤 | Jade Palm Wisdom Compass',
  description: '基於古典玉掌派智慧的現代手相分析應用',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className="min-h-screen gradient-bg">
        {children}
      </body>
    </html>
  )
}