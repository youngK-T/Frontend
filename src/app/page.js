'use client';
import Link from 'next/link';
import { useState } from 'react';
import SimpleUploadModal from '@/components/upload/SimpleUploadModal';

export default function Home() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* 메인 헤더 */}
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            정상을 향한 여정을 시작하세요
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            회의 분석의 <strong>Summit</strong>에 도달할 수 있도록
          </p>
          <p className="text-lg text-gray-600">
            AI 가이드 <strong>세르파</strong>가 함께합니다
          </p>
        </div>

        {/* 액션 카드들 */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* 새 회의 분석 카드 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">새 회의 분석</h3>
            <p className="text-gray-600 mb-6">
              음성 파일을 업로드하여 AI가 자동으로<br />
              회의의 핵심을 정리하고 분석합니다
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              분석 시작하기
            </button>
          </div>

          {/* 회의 레포트 조회 카드 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">회의 레포트 조회</h3>
            <p className="text-gray-600 mb-6">
              이미 완성된 회의 레포트를 선택하여<br />
              세르파와 함께 심층 분석해보세요
            </p>
            <Link
              href="/meetings"
              className="block w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              레포트 보기
            </Link>
          </div>
        </div>
      </main>

      {/* 음성 업로드 모달 */}
      <SimpleUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </div>
  );
}