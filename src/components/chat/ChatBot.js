'use client';

import { useRef, useState } from 'react';
import MessageInput from './MessageInput';

const DEFAULT_API_URL =
  process.env.NEXT_PUBLIC_CHAT_API_URL ||
  'https://chat-bot001-dbcredbkhqbsc4fn.koreacentral-01.azurewebsites.net/api/chat/query';

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      id: 'sys-1',
      role: 'system',
      content:
        '안녕하세요! Summit입니다. 회의에 대한 질문을 해주세요.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedScriptIds] = useState([]); // 추후 외부 선택 UI와 연동 예정
  const [usedScriptIds, setUsedScriptIds] = useState([]);
  const scrollRef = useRef(null);

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
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: data?.answer ?? '응답이 비어있습니다.',
          sources: Array.isArray(data?.sources) ? data.sources : [],
        },
      ]);
      setUsedScriptIds(Array.isArray(data?.used_script_ids) ? data.used_script_ids : []);
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
      <div ref={scrollRef} className="h-[60vh] p-4 md:p-6 overflow-y-auto space-y-4">
        {messages.map((m) => {
          if (m.role === 'system') {
            return (
              <div key={m.id} className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                <div className="text-sm font-semibold text-indigo-700 mb-1">시스템</div>
                <p className="text-gray-800">{m.content}</p>
              </div>
            );
          }
          if (m.role === 'user') {
            return (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[80%] bg-blue-600 text-white rounded-2xl rounded-br-sm px-4 py-3 shadow whitespace-pre-wrap">
                  {m.content}
                </div>
              </div>
            );
          }
          if (m.role === 'assistant') {
            return (
              <div key={m.id} className="flex flex-col items-start space-y-2">
                <div className="max-w-[80%] bg-gray-50 border rounded-2xl rounded-bl-sm px-4 py-3 whitespace-pre-wrap">
                  {m.content}
                </div>
                {(m.sources?.length ?? 0) > 0 && (
                  <div className="max-w-[80%] text-xs text-gray-600 space-y-1">
                    <div className="font-medium">참고 소스</div>
                    <ul className="list-disc pl-4">
                      {m.sources.slice(0, 5).map((s, i) => (
                        <li key={i}>
                          {s.meeting_title || '회의'} ({s.meeting_date || '날짜 미상'}) - 스크립트 {s.script_id} - 관련도 {s.relevance_score}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          }
          return (
            <div key={m.id} className="text-sm text-red-600">{m.content}</div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="text-gray-500 text-sm">답변 생성 중...</div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-300 bg-white p-4">
        <MessageInput onSubmit={handleSend} loading={isLoading} />
        {usedScriptIds.length > 0 && (
          <div className="text-xs text-gray-500 mt-2">
            사용된 스크립트 IDs: {usedScriptIds.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}
// 챗봇 메인 컴포넌트
