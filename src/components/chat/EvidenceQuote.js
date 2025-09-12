'use client';

import { useRouter } from 'next/navigation';

export default function EvidenceQuote({ quote, speaker, scriptId, meetingTitle, meetingDate, chunkIndex, relevanceScore }) {
  const router = useRouter();

  const handleTitleClick = () => {
    if (scriptId) {
      // script_id를 활용해서 회의 세부 페이지로 이동
      router.push(`/meetings/${scriptId}?chunk=${chunkIndex}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '날짜 미상';
    try {
      return new Date(dateString).toLocaleDateString('ko-KR');
    } catch {
      return dateString;
    }
  };


  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      {/* 인용문 */}
      <div className="mb-3">
        <blockquote className="text-gray-800 italic border-l-4 border-blue-300 pl-3 text-sm leading-relaxed">
          &ldquo;{quote}&rdquo;
        </blockquote>
      </div>

      {/* 메타데이터 */}
      <div className="text-xs">
        {/* 화자, 회의, 날짜 정보를 한 줄에 표시 */}
        <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
          {speaker && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">화자:</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                {speaker}
              </span>
            </div>
          )}

          {meetingTitle && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">회의:</span>
              <button
                onClick={handleTitleClick}
                className="bg-green-100 text-green-800 px-2 py-1 rounded font-medium hover:bg-green-200 transition-colors cursor-pointer"
              >
                {meetingTitle}
              </button>
            </div>
          )}

          {meetingDate && (
            <div className="flex items-center space-x-1">
              <span className="text-gray-500">날짜:</span>
              <span className="text-gray-700">{formatDate(meetingDate)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}