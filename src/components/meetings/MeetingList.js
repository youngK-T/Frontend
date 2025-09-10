'use client'

import { useState, useEffect } from 'react'
import MeetingCard from './MeetingCard'
import { getMeetings } from '@/lib/meetings'

export default function MeetingList() {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchMeetings() {
      try {
        setLoading(true)
        const data = await getMeetings()
        setMeetings(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMeetings()
  }, [])

  // 로딩 상태
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">회의록을 불러오는 중...</span>
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">⚠️ 회의록을 불러오는데 실패했습니다</div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          다시 시도
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* 결과 개수 표시 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            총 <span className="font-semibold text-gray-900">{meetings.length}개</span>의 회의 리포트
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>다음 선택:</span>
            <button className="text-blue-600 hover:text-blue-800">전체 선택</button>
          </div>
        </div>
      </div>

      {/* 회의록 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {meetings.map((meeting) => (
          <MeetingCard key={meeting.script_id} meeting={meeting} />
        ))}
      </div>
    </div>
  )
}
