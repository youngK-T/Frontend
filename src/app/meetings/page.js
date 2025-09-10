import MeetingList from '@/components/meetings/MeetingList'

export default function MeetingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <button className="text-gray-400 hover:text-gray-600">
              <span className="text-xl">←</span>
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">회의 리포트 목록</h2>
              <p className="text-gray-600">과거 회의 기록들을 확인하고 관리하세요</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <span>💬</span>
              <span>AI 챗봇</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <span>🔍</span>
              <span>고급 검색</span>
            </button>
          </div>

          {/* 검색 및 필터 섹션 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="제목, 내용, 참석자로 검색..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>날짜순</option>
                <option>제목순</option>
                <option>참석자순</option>
              </select>
            </div>

            {/* 태그 필터 */}
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-sm text-gray-600 mr-2">🏷️ 태그 필터</span>
              <div className="flex flex-wrap gap-2">
                {['제품개발', '로드맵', 'Q1', '우선순위', '마케팅', '전략', '분석', '예산', '스탠드업', '진행사항', '계획', '이슈', '성과', '리뷰', '분기', '목표', '고객', '피드백', 'UX', '개선', '기술', '아키텍처', '스택'].map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <MeetingList />
      </main>
    </div>
  )
}
