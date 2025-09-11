'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 및 서비스명 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/summit.png" 
                alt="Summit Logo" 
                width={40} 
                height={40}
                className="w-10 h-10"
              />
              <span className="text-xl font-bold text-gray-900">SUMMIT</span>
            </Link>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className="flex items-center space-x-6">
            <Link 
              href="/meetings" 
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              회의 레포트
            </Link>
            <Link 
              href="/chat"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2 transition-colors"
            >
              <span>🤖</span>
              <span>AI 챗봇</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
