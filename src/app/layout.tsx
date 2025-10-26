import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '玉掌智慧羅盤 | Jade Palm Wisdom Compass',
  description: '基於古典玉掌派智慧的現代手相分析應用，提供專業的手相解讀服務',
  keywords: '手相分析,掌相,玉掌派,手相解讀,命理,運勢預測',
  authors: [{ name: '玉掌智慧羅盤' }],
  creator: '玉掌智慧羅盤',
  publisher: '玉掌智慧羅盤',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/favicon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: '玉掌智慧羅盤',
    title: '玉掌智慧羅盤 - 專業手相分析',
    description: '基於古典玉掌派智慧的現代手相分析應用，提供專業的手相解讀服務',
    locale: 'zh_TW',
  },
  twitter: {
    card: 'summary_large_image',
    title: '玉掌智慧羅盤 - 專業手相分析',
    description: '基於古典玉掌派智慧的現代手相分析應用',
  },
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