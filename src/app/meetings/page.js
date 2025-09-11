'use client'

import { useState, useEffect } from 'react'
import MeetingList from '@/components/meetings/MeetingList'
import { getTags } from '@/lib/meetings/api'

export default function MeetingsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('날짜순')
  const [selectedTags, setSelectedTags] = useState([])
  const [availableTags, setAvailableTags] = useState([])
  const [tagsLoading, setTagsLoading] = useState(true)

  // 태그 데이터 불러오기
  useEffect(() => {
    async function fetchTags() {
      try {
        setTagsLoading(true)
        const tags = await getTags()
        // 빈 태그나 의미없는 태그 제거
        const filteredTags = tags.filter(tag => 
          tag && 
          tag.trim() !== '' && 
          !tag.includes('내용 없음') && 
          !tag.includes('미완성') && 
          !tag.includes('미제공')
        )
        setAvailableTags(filteredTags)
      } catch (error) {
        console.error('Failed to fetch tags:', error)
        // 에러 시 빈 배열로 설정
        setAvailableTags([])
      } finally {
        setTagsLoading(false)
      }
    }

    fetchTags()
  }, [])

  // 태그 토글 함수
  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{overflow: 'visible'}}>
      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-visible">
        <div className="mb-8 overflow-visible">
          <div className="flex items-center space-x-2 mb-6">
            <button className="text-gray-400 hover:text-gray-600">
              <span className="text-xl">←</span>
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">회의 리포트 목록</h2>
              <p className="text-gray-900">과거 회의 기록들을 확인하고 관리하세요</p>
            </div>
          </div>
          

          {/* 검색 및 필터 섹션 */}
          <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 relative" 
            style={{
              zIndex: 1000,
              overflow: 'visible',
              paddingBottom: '2rem'
            }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="제목, 내용, 참석자로 검색..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
              </div>
              <div className="relative min-w-[120px]" style={{zIndex: 1001}}>
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white appearance-none pr-8 min-w-[120px]"
                  style={{
                    zIndex: 1002,
                    position: 'relative',
                    width: '120px'
                  }}
                >
                  <option value="날짜순">날짜순</option>
                  <option value="제목순">제목순</option>
                  <option value="참석자순">참석자순</option>
                </select>
                {/* 드롭다운 화살표 */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none" style={{zIndex: 1003}}>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 태그 필터 */}
            <div className="mb-4">
              <span className="text-sm text-gray-900 mb-3 block">🏷️ 태그 필터</span>
              <div className="flex flex-wrap gap-2">
                {tagsLoading ? (
                  <span className="text-sm text-gray-500">태그를 불러오는 중...</span>
                ) : availableTags.length > 0 ? (
                  availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">사용 가능한 태그가 없습니다</span>
                )}
              </div>
            </div>
            
            {/* 선택된 태그 표시 */}
            {selectedTags.length > 0 && (
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm text-gray-900">선택된 태그:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                    >
                      {tag}
                      <button
                        onClick={() => toggleTag(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={() => setSelectedTags([])}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    전체 해제
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <MeetingList 
          searchQuery={searchQuery}
          sortOrder={sortOrder}
          selectedTags={selectedTags}
        />
      </main>
    </div>
  )
}
