import MeetingCard from './MeetingCard'

export default function MeetingList() {
  // 임시 데이터 - 실제로는 API에서 가져올 데이터
  const meetings = [
    {
      id: 1,
      title: '제품 개발 팀 회의',
      date: '2024-03-15',
      participants: 4,
      duration: '1시간 30분',
      description: 'Q1 로드맵 논의 및 주요 기능 개발 우선순위 결정. 새로운 기능 스펙 검토와 일정 조정.',
      tags: ['제품개발', '로드맵', 'Q1'],
      status: '완료'
    },
    {
      id: 2,
      title: '마케팅 전략 검토 회의',
      date: '2024-03-14',
      participants: 3,
      duration: '1시간',
      description: '디지털 마케팅 캠페인 성과 분석 및 다음 분기 전략 수립. 예산 배분 및 채널별 성과 검토.',
      tags: ['마케팅', '전략', '분석'],
      status: '완료'
    },
    {
      id: 3,
      title: '주간 스탠드업 미팅',
      date: '2024-03-13',
      participants: 6,
      duration: '30분',
      description: '이번 주 진행사항 공유 및 다음 주 계획 수립. 블로커 이슈 논의 및 계획 방안 모색.',
      tags: ['스탠드업', '진행사항', '계획'],
      status: '완료'
    },
    {
      id: 4,
      title: '분기 성과 리뷰',
      date: '2024-03-12',
      participants: 2,
      duration: '2시간',
      description: 'Q1 성과 검토 및 Q2 목표 설정. 각 팀별 성과 분석과 개선사항 도출.',
      tags: ['성과', '리뷰', '분기'],
      status: '완료'
    }
  ]

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
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}
      </div>
    </div>
  )
}
