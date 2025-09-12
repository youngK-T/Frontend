'use client';

import { useRef, useState, useEffect } from 'react';
import MessageInput from './MessageInput';
import EvidenceQuote from './EvidenceQuote';

const DEFAULT_API_URL =
  process.env.NEXT_PUBLIC_CHAT_API_URL ||
  'https://chat-bot001-dbcredbkhqbsc4fn.koreacentral-01.azurewebsites.net/api/chat/query';

export default function ChatBot({ initialScriptIds = [], selectedMeeting = null }) {
  const [messages, setMessages] = useState([
    {
      id: 'sys-1',
      role: 'system',
      content: '안녕하세요! 셰르파입니다. 회의에 대한 질문을 해주세요.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedScriptIds, setSelectedScriptIds] = useState(initialScriptIds); // 외부에서 전달받은 script_ids 사용
  const [expandedEvidence, setExpandedEvidence] = useState({}); // 확장된 근거 자료 관리
  const scrollRef = useRef(null);

  // initialScriptIds가 변경될 때 챗봇 초기화
  useEffect(() => {
    setSelectedScriptIds(initialScriptIds);
    setExpandedEvidence({}); // 확장 상태 초기화
    // 메시지를 초기 시스템 메시지만 남기고 초기화
    setMessages([
      {
        id: 'sys-1',
        role: 'system',
        content: '안녕하세요! 셰르파입니다. 회의에 대한 질문을 해주세요.',
      },
    ]);
  }, [initialScriptIds.join(',')]); // 배열 내용이 변경되었는지 확인

  // selectedMeeting이 변경될 때 시스템 메시지 업데이트
  useEffect(() => {
    let systemMessage;
    
    if (selectedMeeting) {
      if (selectedMeeting.isMultiple) {
        systemMessage = `안녕하세요! 회의 분석 AI 가이드 셰르파입니다. 선택하신 ${selectedMeeting.script_ids.length}개 회의에 대한 질문을 해주세요.`;
      } else {
        systemMessage = `안녕하세요! 회의 분석 AI 가이드 셰르파입니다. 선택하신 회의에 대한 질문을 해주세요.`;
      }
    } else if (initialScriptIds.length > 1) {
      systemMessage = `안녕하세요! 회의 분석 AI 가이드 셰르파입니다. 선택하신 ${initialScriptIds.length}개 회의에 대한 질문을 해주세요.`;
    } else if (initialScriptIds.length === 1) {
      systemMessage = `안녕하세요! 회의 분석 AI 가이드 셰르파입니다. 선택하신 회의에 대한 질문을 해주세요.`;
    } else {
      systemMessage = '안녕하세요! 회의 분석 AI 가이드 셰르파입니다.전사적 차원의 회의 검색을 통해 궁금한 내용을 질문해주세요.';
    }

    setMessages(prev => [
      { ...prev[0], content: systemMessage },
      ...prev.slice(1)
    ]);
  }, [selectedMeeting, initialScriptIds]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }
    });
  };

  const handleSend = async (question) => {
    const trimmed = (question || '').trim();
    if (!trimmed || isLoading) return;

    const userMsg = { id: `u-${Date.now()}`, role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    scrollToBottom();

    try {
      const res = await fetch(DEFAULT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed, user_selected_script_ids: selectedScriptIds }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
      }
      const data = await res.json();
      console.log('챗봇 API 응답:', data);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: data?.final_answer ?? data?.answer ?? '응답이 비어있습니다.',
          userQuestion: data?.user_question,
          evidenceQuotes: Array.isArray(data?.evidence_quotes) ? data.evidence_quotes : [],
          confidenceScore: data?.confidence_score,
          sources: Array.isArray(data?.sources) ? data.sources : [],
          usedScriptIds: Array.isArray(data?.used_script_ids) ? data.used_script_ids : [],
          totalChunksAnalyzed: data?.total_chunks_analyzed,
          selectedChunksCount: data?.selected_chunks_count,
          memoryContext: data?.memory_context,
        },
      ]);
      scrollToBottom();
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: `e-${Date.now()}`, role: 'error', content: `에러가 발생했습니다: ${err.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden">
      <div ref={scrollRef} className="h-[60vh] p-4 md:p-6 overflow-y-auto space-y-5">
        {messages.map((m) => {
          if (m.role === 'system') {
            return (
              <div key={m.id} className="bg-blue-50 rounded-2xl p-4">
                <div className="text-sm font-semibold text-blue-700 mb-1">AI 셰르파</div>
                <p className="text-gray-900">{m.content}</p>
              </div>
            );
          }
          if (m.role === 'user') {
            return (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[80%] bg-gray-100 text-gray-800 rounded-2xl rounded-br-sm px-4 py-3 shadow whitespace-pre-wrap">
                  {m.content}
                </div>
              </div>
            );
          }
          if (m.role === 'assistant') {
            return (
              <div key={m.id} className="flex flex-col items-start space-y-3 w-full">
                {/* 메인 답변 */}
                <div className="max-w-[85%] bg-sky-50 rounded-2xl rounded-bl-sm px-5 py-4 whitespace-pre-wrap text-sky-900 shadow-sm">
                  {m.content}
                </div>

                {/* 신뢰도 점수 */}
                {m.confidenceScore && (
                  <div className="text-xs text-gray-600 flex items-center space-x-1">
                    <span className="font-medium">신뢰도:</span>
                    <span className={`px-2 py-1 rounded ${
                      m.confidenceScore >= 0.8 ? 'bg-green-100 text-green-800' :
                      m.confidenceScore >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {(m.confidenceScore * 100).toFixed(1)}%
                    </span>
                  </div>
                )}

                {/* Evidence Quotes - 배열이 존재하고 비어있지 않은 경우만 표시 */}
                {Array.isArray(m.evidenceQuotes) && m.evidenceQuotes.length > 0 && (
                  <div className="max-w-[90%] space-y-2">
                    <div className="text-sm font-medium text-gray-700 mb-2">📝 근거 자료</div>
                    <div className="space-y-2">
                      {(() => {
                        const isExpanded = expandedEvidence[m.id];
                        const displayCount = isExpanded ? m.evidenceQuotes.length : Math.min(3, m.evidenceQuotes.length);
                        
                        return (
                          <>
                            {m.evidenceQuotes.slice(0, displayCount).map((evidence, i) => (
                              <EvidenceQuote
                                key={i}
                                quote={evidence.quote}
                                speaker={evidence.speaker}
                                scriptId={evidence.script_id}
                                meetingTitle={evidence.meeting_title}
                                meetingDate={evidence.meeting_date}
                                chunkIndex={evidence.chunk_index}
                                relevanceScore={evidence.relevance_score}
                              />
                            ))}
                            {m.evidenceQuotes.length > 3 && (
                              <div className="text-center py-2">
                                <button
                                  onClick={() => setExpandedEvidence(prev => ({
                                    ...prev,
                                    [m.id]: !prev[m.id]
                                  }))}
                                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                >
                                  {isExpanded 
                                    ? '접기' 
                                    : `더보기 (${m.evidenceQuotes.length - 3}개 더)`
                                  }
                                </button>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}


              </div>
            );
          }
          return (
            <div key={m.id} className="bg-red-50 rounded-2xl p-4">
              <div className="text-sm font-semibold text-red-700 mb-1">오류</div>
              <p className="text-red-800">{m.content}</p>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 text-gray-700 text-sm flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sky-300"></div>
              <span>답변 생성 중...</span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-300 bg-white p-4">
        <MessageInput onSubmit={handleSend} loading={isLoading} />
      </div>
    </div>
  );
}