import Link from 'next/link'

export default function MeetingCard({ meeting, isSelected, onSelect }) {
  const { 
    script_id, 
    title, 
    created_at, 
    speakers, 
    script_summaries, 
    tags, 
    one_line_summaries 
  } = meeting

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  // 참석자 수 계산
  const getParticipantCount = (speakersString) => {
    if (!speakersString) return 0
    return speakersString.split(',').length
  }

  // 요약문에서 설명 추출
  const getDescription = (summaries) => {
    if (!summaries) return ''
    // 첫 번째 주요 내용 부분만 추출
    const match = summaries.match(/\*\*주요 내용 및 핵심 메시지\*\*:\s*([^-\n]+)/)
    return match ? match[1].trim() : summaries.slice(0, 150) + '...'
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-all ${
      isSelected ? 'border-gray-500 ring-2 ring-gray-200 bg-gray-50' : 'border-gray-200'
    }`}>
      {/* 카드 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <input 
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(script_id)}
            className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
          />
          <h3 className="text-lg font-semibold text-gray-900 hover:text-gray-700 cursor-pointer">
            <Link href={`/meetings/${script_id}`}>
              {title}
            </Link>
          </h3>
        </div>
      </div>

      {/* 회의 정보 */}
      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
        <div className="flex items-center space-x-1">
          <span>📅</span>
          <span>{formatDate(created_at)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>👥</span>
          <span>{getParticipantCount(speakers)}명</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>🗣️</span>
          <span>{speakers || '발화자 정보 없음'}</span>
        </div>
      </div>

      {/* 회의 설명 */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {one_line_summaries ? 
          one_line_summaries.replace(/^-\s*"?|"?$/g, '') : 
          getDescription(script_summaries)
        }
      </p>

      {/* 태그 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags && tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center justify-end pt-4 border-t border-gray-100">
        <Link 
          href={`/meetings/${script_id}`}
          className="text-gray-600 hover:text-gray-800 text-sm font-medium"
        >
          자세히 보기 →
        </Link>
      </div>
    </div>
  )
}
