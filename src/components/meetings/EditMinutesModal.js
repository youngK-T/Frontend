'use client';
import { useState, useEffect } from 'react';

export default function EditMinutesModal({ isOpen, onClose, meeting }) {
  const [editedContent, setEditedContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');

  useEffect(() => {
    if (meeting && isOpen) {
      // 회의록 내용 조합
      const content = `# ${meeting.title}\n\n## 회의 요약\n\n${meeting.script_summaries || ''}\n\n## 회의록\n\n${meeting.minutes || meeting.meeting_minutes || ''}`;
      setOriginalContent(content);
      setEditedContent(content);
    }
  }, [meeting, isOpen]);

  const handleDownload = () => {
    if (!editedContent.trim()) return;

    const blob = new Blob([editedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${meeting?.title || '회의록'}_수정본.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setEditedContent(originalContent);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl h-[95vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">회의록 수정</h2>
            <p className="text-gray-600 text-sm">{meeting?.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* 편집 영역 */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-gray-700">
                회의록 내용 (마크다운 형식)
              </label>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-500">
                  {editedContent.length}자
                </span>
                <button
                  onClick={handleReset}
                  className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  원본으로 되돌리기
                </button>
              </div>
            </div>
            
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="flex-1 w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm leading-relaxed text-gray-900 placeholder-gray-500"
              placeholder="회의록 내용을 수정하세요..."
            />
          </div>
        </div>

        {/* 푸터 */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              💡 수정된 내용은 텍스트 파일로 다운로드됩니다
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleDownload}
              disabled={!editedContent.trim()}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                editedContent.trim()
                  ? 'bg-emerald-500/90 text-white hover:bg-emerald-600/90'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>수정본 다운로드</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
