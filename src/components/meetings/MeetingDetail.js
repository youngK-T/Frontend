'use client'

import { useState } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { getMeetingScript } from '@/lib/meetings/api'

export default function MeetingDetail({ meeting }) {
  const [activeTab, setActiveTab] = useState('summary')
  const [scriptData, setScriptData] = useState(null)
  const [scriptLoading, setScriptLoading] = useState(false)
  const [scriptError, setScriptError] = useState(null)
  const [copySuccess, setCopySuccess] = useState(false)

  const {
    script_id,
    title,
    created_at,
    speakers,
    script_summaries,
    full_script,
    meeting_minutes,
    minutes, // API에서 minutes로 올 수 있음
    tags,
    one_line_summaries
  } = meeting

  // meeting_minutes가 없으면 minutes 사용
  const actualMeetingMinutes = meeting_minutes || minutes || '회의록 데이터가 없습니다.'

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  // 시간 포맷팅
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  // 참석자 수 계산
  const getParticipantCount = (speakersString) => {
    if (!speakersString) return 0
    return speakersString.split(',').length
  }

  // 화자별 색상 매핑 (블루/에메랄드 파스텔톤으로 구분)
  const getSpeakerColor = (speaker) => {
    // 화자 이름을 기반으로 해시 → 짝/홀로 블루/에메랄드 결정
    let hash = 0
    for (let i = 0; i < speaker.length; i++) {
      hash = speaker.charCodeAt(i) + ((hash << 5) - hash)
    }
    const isBlue = Math.abs(hash) % 2 === 0

    if (isBlue) {
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' }
    }
    return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' }
  }

  // 사이드바용 화자 색상 (블루/에메랄드 파스텔톤)
  const getSpeakerColorClass = (speaker) => {
    let hash = 0
    for (let i = 0; i < speaker.length; i++) {
      hash = speaker.charCodeAt(i) + ((hash << 5) - hash)
    }
    const isBlue = Math.abs(hash) % 2 === 0
    return isBlue ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
  }

  // 스크립트 탭 클릭 시 스크립트 데이터 로드
  const handleScriptTabClick = async () => {
    setActiveTab('script')
    
    // 탭 변경 시 맨 위로 스크롤
    window.scrollTo(0, 0)
    
    if (!scriptData && !scriptLoading) {
      setScriptLoading(true)
      setScriptError(null)
      
      try {
        const data = await getMeetingScript(script_id)
        setScriptData(data)
      } catch (error) {
        setScriptError(error.message)
      } finally {
        setScriptLoading(false)
      }
    }
  }

  // 링크 복사 기능
  const handleShare = async () => {
    try {
      const currentUrl = window.location.href
      await navigator.clipboard.writeText(currentUrl)
      setCopySuccess(true)
      
      // 2초 후 성공 메시지 제거
      setTimeout(() => {
        setCopySuccess(false)
      }, 2000)
    } catch (error) {
      console.error('링크 복사 실패:', error)
      // 폴백: 수동으로 선택할 수 있도록 프롬프트 표시
      const textArea = document.createElement('textarea')
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        setCopySuccess(true)
        setTimeout(() => {
          setCopySuccess(false)
        }, 2000)
      } catch (fallbackError) {
        alert('링크 복사에 실패했습니다. 수동으로 복사해주세요: ' + window.location.href)
      }
      document.body.removeChild(textArea)
    }
  }

  // 회의록 다운로드 기능
  const handleDownload = () => {
    try {
      // 회의록 내용 준비
      const meetingContent = `
${title}
${'='.repeat(title.length)}

회의 일시: ${formatDate(created_at)}
참석자: ${speakers || '정보 없음'}
참석자 수: ${getParticipantCount(speakers)}명

${'-'.repeat(50)}
회의 요약
${'-'.repeat(50)}

${script_summaries || '요약 정보가 없습니다.'}

${'-'.repeat(50)}
회의록
${'-'.repeat(50)}

${actualMeetingMinutes || '회의록 정보가 없습니다.'}

${scriptData && scriptData.segments ? `
${'-'.repeat(50)}
전체 스크립트
${'-'.repeat(50)}

${scriptData.segments.map(segment => `[${segment.speaker}] ${segment.text}`).join('\n\n')}
` : ''}

---
다운로드 일시: ${new Date().toLocaleString('ko-KR')}
      `.trim()

      // 파일명 생성 (날짜와 제목 포함)
      const dateStr = formatDate(created_at).replace(/\./g, '')
      const sanitizedTitle = title.replace(/[^\w\s-가-힣]/g, '').trim()
      const fileName = `회의록_${sanitizedTitle}_${dateStr}.txt`

      // Blob 생성 및 다운로드
      const blob = new Blob([meetingContent], { type: 'text/plain;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      
      // 정리
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      console.log('회의록 다운로드 완료:', fileName)
    } catch (error) {
      console.error('다운로드 실패:', error)
      alert('회의록 다운로드에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <Link 
            href="/meetings"
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ←
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>📅 {formatDate(created_at)}</span>
              <span>👥 {getParticipantCount(speakers)}명 참석</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link 
              href={`/chat?script_id=${script_id}`}
              className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 flex items-center space-x-2 transition-colors"
            >
              <span>🤖</span>
              <span>AI 챗봇으로 질문</span>
            </Link>
            <button 
              onClick={handleShare}
              className={`px-4 py-2 rounded-lg border flex items-center space-x-2 transition-all ${
                copySuccess 
                  ? 'bg-green-100 border-green-300 text-green-700' 
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              <span>{copySuccess ? '✓' : '🔗'}</span>
              <span>{copySuccess ? '복사됨!' : '공유'}</span>
            </button>
            <button 
              onClick={handleDownload}
              className="bg-emerald-500/90 text-white px-4 py-2 rounded-lg hover:bg-emerald-600/90 flex items-center space-x-2"
            >
              <span>⬇</span>
              <span>다운로드</span>
            </button>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('summary')
                window.scrollTo(0, 0)
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'summary'
                  ? 'border-blue-300 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              👁️ 회의 요약본
            </button>
            <button
              onClick={handleScriptTabClick}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'script'
                  ? 'border-blue-300 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📄 전체 스크립트
            </button>
            <button
              onClick={() => {
                setActiveTab('minutes')
                window.scrollTo(0, 0)
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'minutes'
                  ? 'border-blue-300 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📝 회의록
            </button>
          </nav>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex gap-8">
        {/* 왼쪽 메인 컨텐츠 */}
        <div className="flex-1">
          {activeTab === 'summary' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="prose prose-slate max-w-none prose-headings:text-gray-900 prose-p:text-gray-900 prose-strong:text-gray-900 prose-ul:text-gray-900 prose-li:text-gray-900 prose-ol:text-gray-900">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-bold text-gray-900 mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-bold text-gray-900 mb-2">{children}</h3>,
                    h4: ({ children }) => <h4 className="text-base font-bold text-gray-900 mb-2">{children}</h4>,
                    p: ({ children }) => <p className="text-gray-900 mb-3 leading-relaxed">{children}</p>,
                    strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                    ul: ({ children }) => <ul className="list-disc ml-4 mb-3 text-gray-900">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal ml-4 mb-3 text-gray-900">{children}</ol>,
                    li: ({ children }) => <li className="mb-1 text-gray-900">{children}</li>,
                  }}
                >
                  {script_summaries}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {activeTab === 'script' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">전체 스크립트</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                {scriptLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                    <span className="ml-2 text-gray-600">스크립트를 불러오는 중...</span>
                  </div>
                ) : scriptError ? (
                  <div className="text-center py-8">
                    <div className="text-red-600 mb-2">⚠️ 스크립트를 불러오는데 실패했습니다</div>
                    <p className="text-gray-600 text-sm">{scriptError}</p>
                  </div>
                ) : scriptData ? (
                  <div className="space-y-4">
                    {scriptData.segments && scriptData.segments.map((segment, index) => {
                      const colorScheme = getSpeakerColor(segment.speaker)
                      
                      return (
                        <div key={index} className={`border-l-4 ${colorScheme.border} pl-4 py-2`}>
                          <div className="flex items-start space-x-3">
                            <span className={`inline-block ${colorScheme.bg} ${colorScheme.text} text-xs font-medium px-2 py-1 rounded-full min-w-[60px] text-center`}>
                              {segment.speaker}
                            </span>
                            <p className="text-gray-700 flex-1 leading-relaxed">
                              {segment.text}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    스크립트 데이터가 없습니다.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'minutes' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="prose prose-slate max-w-none prose-headings:text-gray-900 prose-p:text-gray-900 prose-strong:text-gray-900 prose-ul:text-gray-900 prose-li:text-gray-900 prose-ol:text-gray-900">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-bold text-gray-900 mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-bold text-gray-900 mb-2">{children}</h3>,
                    h4: ({ children }) => <h4 className="text-base font-bold text-gray-900 mb-2">{children}</h4>,
                    p: ({ children }) => <p className="text-gray-900 mb-3 leading-relaxed">{children}</p>,
                    strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                    ul: ({ children }) => <ul className="list-disc ml-4 mb-3 text-gray-900">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal ml-4 mb-3 text-gray-900">{children}</ol>,
                    li: ({ children }) => <li className="mb-1 text-gray-900">{children}</li>,
                    hr: () => <hr className="my-6 border-gray-300" />,
                  }}
                >
                  {actualMeetingMinutes}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        {/* 오른쪽 사이드바 */}
        <div className="w-80 space-y-6">
          {/* 참석자 정보 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">참석자 정보</h3>
            <div className="space-y-3">
              {speakers && speakers.split(',').map((speaker, index) => {
                const speakerName = speaker.trim()
                const colorClass = getSpeakerColorClass(speakerName)
                
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${colorClass}`}>
                      {speakerName.charAt(0) || (index + 1).toString()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{speakerName}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 태그 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">태그</h3>
            <div className="flex flex-wrap gap-2">
              {tags && tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}