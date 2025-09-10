import Link from 'next/link'

export default function MeetingCard({ meeting }) {
  const { id, title, date, participants, duration, description, tags, status } = meeting

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* 카드 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <input 
            type="checkbox" 
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
            <Link href={`/meetings/${id}`}>
              {title}
            </Link>
          </h3>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {status}
        </span>
      </div>

      {/* 회의 정보 */}
      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
        <div className="flex items-center space-x-1">
          <span>📅</span>
          <span>{date}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>👥</span>
          <span>{participants}명</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>⏱️</span>
          <span>{duration}</span>
        </div>
      </div>

      {/* 회의 설명 */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {description}
      </p>

      {/* 태그 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-3">
          <button className="text-gray-400 hover:text-gray-600">
            <span>👁️</span>
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <span>📥</span>
          </button>
        </div>
        <Link 
          href={`/meetings/${id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          자세히 보기 →
        </Link>
      </div>
    </div>
  )
}
