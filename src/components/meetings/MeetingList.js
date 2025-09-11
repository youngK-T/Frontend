'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MeetingCard from './MeetingCard'
import { getMeetings } from '@/lib/meetings'

export default function MeetingList({ searchQuery, sortOrder, selectedTags }) {
  const router = useRouter()
  const [allMeetings, setAllMeetings] = useState([])
  const [filteredMeetings, setFilteredMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMeetings, setSelectedMeetings] = useState(new Set())

  useEffect(() => {
    async function fetchMeetings() {
      try {
        setLoading(true)
        const data = await getMeetings()
        setAllMeetings(data)
        setFilteredMeetings(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMeetings()
  }, [])

  // 검색, 정렬, 태그 필터링 로직
  useEffect(() => {
    let filtered = [...allMeetings]

    // 검색어 필터링
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(meeting => 
        meeting.title.toLowerCase().includes(query) ||
        meeting.script_summaries?.toLowerCase().includes(query) ||
        meeting.speakers?.toLowerCase().includes(query) ||
        meeting.one_line_summaries?.toLowerCase().includes(query) ||
        meeting.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // 태그 필터링
    if (selectedTags && selectedTags.length > 0) {
      filtered = filtered.filter(meeting =>
        meeting.tags && selectedTags.some(tag => meeting.tags.includes(tag))
      )
    }

    // 정렬
    if (sortOrder) {
      filtered.sort((a, b) => {
        switch (sortOrder) {
          case '제목순':
            return a.title.localeCompare(b.title)
          case '참석자순':
            const aCount = a.speakers ? a.speakers.split(',').length : 0
            const bCount = b.speakers ? b.speakers.split(',').length : 0
            return bCount - aCount
          case '날짜순':
          default:
            return new Date(b.created_at) - new Date(a.created_at)
        }
      })
    }

    setFilteredMeetings(filtered)
  }, [allMeetings, searchQuery, sortOrder, selectedTags])

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

  // 전체 선택/해제 핸들러
  const handleSelectAll = () => {
    if (selectedMeetings.size === filteredMeetings.length) {
      setSelectedMeetings(new Set())
    } else {
      setSelectedMeetings(new Set(filteredMeetings.map(m => m.script_id)))
    }
  }

  // 개별 선택 핸들러
  const handleSelectMeeting = (scriptId) => {
    const newSelected = new Set(selectedMeetings)
    if (newSelected.has(scriptId)) {
      newSelected.delete(scriptId)
    } else {
      newSelected.add(scriptId)
    }
    setSelectedMeetings(newSelected)
  }

  // AI 분석 핸들러
  const handleAnalyze = () => {
    const selectedIds = Array.from(selectedMeetings)
    if (selectedIds.length === 0) {
      alert('분석할 회의를 선택해주세요.')
      return
    }
    
    console.log('AI 분석 요청:', selectedIds)
    // 다중 선택된 회의 ID들을 쿼리 파라미터로 전달하여 챗봇으로 이동
    const queryParams = selectedIds.map(id => `script_ids=${encodeURIComponent(id)}`).join('&')
    router.push(`/?${queryParams}`)
  }

  // 개별 회의 해제 핸들러
  const handleRemoveSelected = (scriptId) => {
    const newSelected = new Set(selectedMeetings)
    newSelected.delete(scriptId)
    setSelectedMeetings(newSelected)
  }

  // 선택된 회의 제목 가져오기
  const getSelectedMeetingTitle = (scriptId) => {
    const meeting = allMeetings.find(m => m.script_id === scriptId)
    return meeting ? meeting.title : `회의 ${scriptId}`
  }

  return (
    <div>
      {/* 결과 개수 및 선택 기능 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-900">
            총 <span className="font-semibold text-gray-900">{filteredMeetings.length}개</span>의 회의 리포트
            {allMeetings.length !== filteredMeetings.length && (
              <span className="ml-2 text-gray-500">
                (전체 {allMeetings.length}개 중)
              </span>
            )}
            {selectedMeetings.size > 0 && (
              <span className="ml-2 text-blue-600 font-medium">
                {selectedMeetings.size}개 선택됨
              </span>
            )}
          </p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>다음 선택:</span>
              <button 
                onClick={handleSelectAll}
                className="text-blue-600 hover:text-blue-800"
              >
                {selectedMeetings.size === filteredMeetings.length ? '선택 해제' : '전체 선택'}
              </button>
            </div>
            {selectedMeetings.size > 0 && (
              <button
                onClick={handleAnalyze}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <span>📊</span>
                <span>선택한 {selectedMeetings.size}개 레포트로 AI 분석</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 선택된 회의 태그 표시 */}
      {selectedMeetings.size > 0 && (
        <div className="mb-6">
          <div className="bg-white border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sm font-medium text-blue-800">선택된 회의:</span>
              <button
                onClick={() => setSelectedMeetings(new Set())}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                전체 해제
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from(selectedMeetings).map((scriptId) => (
                <div
                  key={scriptId}
                  className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                >
                  <span className="max-w-xs truncate">
                    {getSelectedMeetingTitle(scriptId)}
                  </span>
                  <button
                    onClick={() => handleRemoveSelected(scriptId)}
                    className="ml-2 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    title="선택 해제"
                  >
                    <span className="text-xs">×</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 회의록 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMeetings.length > 0 ? (
          filteredMeetings.map((meeting) => (
            <MeetingCard 
              key={meeting.script_id} 
              meeting={meeting}
              isSelected={selectedMeetings.has(meeting.script_id)}
              onSelect={handleSelectMeeting}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-500">다른 검색어나 필터를 시도해보세요.</p>
          </div>
        )}
      </div>
    </div>
  )
}
