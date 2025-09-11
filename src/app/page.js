'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatBot from '@/components/chat/ChatBot';
import SimpleUploadModal from '@/components/upload/SimpleUploadModal';
import { getMeetingDetail } from '@/lib/meetings/api';
import Link from 'next/link';

function HomeContent() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [meetingLoading, setMeetingLoading] = useState(false);
  const searchParams = useSearchParams();
  const scriptId = searchParams.get('script_id');

  // 다중 script_ids 처리
  const scriptIds = searchParams.getAll('script_ids');
  const allScriptIds = scriptId ? [scriptId] : scriptIds;

  // 선택된 회의 정보 가져오기
  useEffect(() => {
    async function fetchMeetingInfo() {
      if (allScriptIds.length === 0) {
        setSelectedMeeting(null);
        return;
      }

      try {
        setMeetingLoading(true);
        if (allScriptIds.length === 1) {
          // 단일 회의인 경우 상세 정보 가져오기
          const meetingData = await getMeetingDetail(allScriptIds[0]);
          setSelectedMeeting(meetingData);
        } else {
          // 다중 회의인 경우 모든 회의 정보 가져오기
          const meetingPromises = allScriptIds.map(id => getMeetingDetail(id));
          const meetingDataList = await Promise.allSettled(meetingPromises);
          
          const successfulMeetings = meetingDataList
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value);
          
          const meetingTitles = successfulMeetings.map(meeting => meeting.title);
          
          setSelectedMeeting({
            title: meetingTitles.length > 0 
              ? meetingTitles.join(', ') 
              : `선택된 ${allScriptIds.length}개 회의`,
            script_ids: allScriptIds,
            isMultiple: true,
            meetings: successfulMeetings
          });
        }
      } catch (error) {
        console.error('Failed to fetch meeting info:', error);
        setSelectedMeeting(null);
      } finally {
        setMeetingLoading(false);
      }
    }

    fetchMeetingInfo();
  }, [scriptId, scriptIds.join(',')]); // scriptIds 배열의 변화 감지

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Summit</h2>
                <p className="text-gray-600">전사 회의 분석 어시스턴트</p>
                {meetingLoading && allScriptIds.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    회의 정보를 불러오는 중...
                  </p>
                )}
                {selectedMeeting && (
                  <p className="text-sm text-blue-600 mt-1">
                    선택된 회의: {selectedMeeting.title}
                  </p>
                )}
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

        <ChatBot 
          initialScriptIds={allScriptIds}
          selectedMeeting={selectedMeeting}
        />

        {/* 음성 업로드 모달 */}
        <SimpleUploadModal 
          isOpen={isUploadModalOpen} 
          onClose={() => setIsUploadModalOpen(false)} 
        />
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">로딩 중...</span>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}