'use client';
import { useState } from 'react';
import ChatBot from '@/components/chat/ChatBot';
import SimpleUploadModal from '@/components/upload/SimpleUploadModal';
import Link from 'next/link';

export default function Home() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Summit</h2>
                <p className="text-gray-600">전사 회의 분석 어시스턴트</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                <span>새 회의 업로드</span>
              </button>
              <Link 
                href="/meetings"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                회의 목록 보기
              </Link>
            </div>
          </div>
        </div>

        <ChatBot />

        {/* 음성 업로드 모달 */}
        <SimpleUploadModal 
          isOpen={isUploadModalOpen} 
          onClose={() => setIsUploadModalOpen(false)} 
        />
      </main>
    </div>
  );
}