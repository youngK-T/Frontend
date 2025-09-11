'use client';
import ChatBot from '@/components/chat/ChatBot';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <button className="text-gray-400 hover:text-gray-600">
              <span className="text-xl">←</span>
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Summit</h2>
              <p className="text-gray-600">전사 회의 분석 어시스턴트</p>
            </div>
          </div>
        </div>

        <ChatBot />
      </main>
    </div>
  );
}