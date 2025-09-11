'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import MeetingDetail from '@/components/meetings/MeetingDetail'
import { getMeetingDetail } from '@/lib/meetings/api'

export default function MeetingDetailPage() {
  const params = useParams()
  const [meeting, setMeeting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchMeetingDetail() {
      try {
        setLoading(true)
        const data = await getMeetingDetail(params.id)
        setMeeting(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchMeetingDetail()
    }
  }, [params.id])

  // 페이지 로드 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        <span className="ml-2 text-gray-600">회의록을 불러오는 중...</span>
      </div>
    )
  }

  if (error || !meeting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️ 회의록을 불러오는데 실패했습니다</div>
          <p className="text-gray-600 mb-4">{error || '회의록을 찾을 수 없습니다'}</p>
          <Link 
            href="/meetings"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MeetingDetail meeting={meeting} />
    </div>
  )
}