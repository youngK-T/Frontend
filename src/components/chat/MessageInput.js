'use client';

import { useState } from 'react';

export default function MessageInput({ onSubmit, loading }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() || loading) return;
    onSubmit?.(value);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="회의에 대해 질문해보세요..."
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
      />
      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-3 rounded-lg text-white ${loading ? 'bg-gray-400' : 'bg-sky-300 hover:bg-sky-400'}`}
      >
        {loading ? '전송 중...' : '전송'}
      </button>
    </form>
  );
}
// 메시지 입력 컴포넌트
