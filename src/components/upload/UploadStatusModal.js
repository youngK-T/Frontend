'use client';

import { useUpload } from '@/contexts/UploadContext';

export default function UploadStatusModal() {
  const { uploadState, dismissUpload } = useUpload();

  if (!uploadState.isUploading) {
    return null;
  }

  const getProgressColor = (stage) => {
    switch (stage) {
      case 'completed': return 'text-emerald-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-500';
    }
  };

  const getProgressBgColor = (stage) => {
    switch (stage) {
      case 'completed': return 'bg-emerald-50 border-emerald-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-white rounded-lg shadow-xl border p-4 w-80 ${getProgressBgColor(uploadState.stage)}`}>
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-medium">M</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">셰르파 분석 중</h3>
              <p className="text-xs text-gray-600">셰르파 처리 중</p>
            </div>
          </div>
          {(uploadState.stage === 'completed' || uploadState.stage === 'error') && (
            <button
              onClick={dismissUpload}
              className="text-gray-400 hover:text-gray-600 text-lg"
            >
              ×
            </button>
          )}
        </div>

        {/* 파일명 */}
        <div className="mb-3">
          <p className="font-medium text-gray-900 text-sm truncate">{uploadState.fileName}</p>
        </div>

        {/* 진행 상황 */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>진행 상황</span>
            <span>{uploadState.progress}/5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                uploadState.stage === 'error' ? 'bg-red-500' : 
                uploadState.stage === 'completed' ? 'bg-emerald-500' : 'bg-blue-400'
              }`}
              style={{ width: `${(uploadState.progress / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 현재 단계 */}
        <div className="space-y-2">
          {/* 스크립트 저장 */}
          <div className="flex items-center space-x-2">
            {uploadState.progress >= 1 ? (
              uploadState.stage === 'uploading' && uploadState.progress === 1 ? (
                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )
            ) : (
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            )}
            <span className={`text-sm ${uploadState.progress >= 1 ? 'text-gray-900' : 'text-gray-500'}`}>
              음성 파일 업로드
            </span>
          </div>

          {/* STT 변환 */}
          <div className="flex items-center space-x-2">
            {uploadState.progress >= 2 ? (
              uploadState.stage === 'stt' && uploadState.progress === 2 ? (
                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )
            ) : (
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            )}
            <span className={`text-sm ${uploadState.progress >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>
              STT 변환
            </span>
          </div>

          {/* 스크립트 저장 */}
          <div className="flex items-center space-x-2">
            {uploadState.progress >= 3 ? (
              uploadState.stage === 'script' && uploadState.progress === 3 ? (
                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )
            ) : (
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            )}
            <span className={`text-sm ${uploadState.progress >= 3 ? 'text-gray-900' : 'text-gray-500'}`}>
              스크립트 저장
            </span>
          </div>

          {/* ReportSource 생성 */}
          <div className="flex items-center space-x-2">
            {uploadState.progress >= 4 ? (
              uploadState.stage === 'analyzing' && uploadState.progress === 4 ? (
                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )
            ) : (
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            )}
            <span className={`text-sm ${uploadState.progress >= 4 ? 'text-gray-900' : 'text-gray-500'}`}>
              ReportSource 생성
            </span>
          </div>

          {/* Report 생성 */}
          <div className="flex items-center space-x-2">
            {uploadState.progress >= 5 ? (
              <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            ) : (
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            )}
            <span className={`text-sm ${uploadState.progress >= 5 ? 'text-gray-900' : 'text-gray-500'}`}>
              Report 생성
            </span>
          </div>
        </div>

        {/* 상태 메시지 */}
        {uploadState.stage === 'completed' && (
          <div className="mt-3 p-2 bg-emerald-100 rounded text-sm text-emerald-800">
            ✓ 회의 분석이 완료되었습니다! 3초 후 회의 목록으로 이동합니다.
          </div>
        )}

        {uploadState.error && (
          <div className="mt-3 p-2 bg-red-100 rounded text-sm text-red-800">
            ❌ 오류: {uploadState.error}
          </div>
        )}
      </div>
    </div>
  );
}
