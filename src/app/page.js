'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 메인 페이지 접근 시 회의 목록 페이지로 리다이렉트
    router.push('/meetings');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <span className="mt-2 text-gray-600 block">회의 목록으로 이동 중...</span>
      </div>
    </div>
  );
}