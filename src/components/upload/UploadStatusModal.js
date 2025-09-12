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

  // 각 단계별 상태 확인 함수
  const getStepStatus = (stepNumber) => {
    if (uploadState.stage === 'error') {
      // 오류가 발생한 경우, 현재 진행 중이던 단계에서 오류 발생
      if (stepNumber < uploadState.progress) {
        return 'completed'; // 이미 완료된 단계
      } else if (stepNumber === uploadState.progress) {
        return 'error'; // 오류가 발생한 단계
      } else {
        return 'pending'; // 아직 시작되지 않은 단계
      }
    } else if (stepNumber < uploadState.progress) {
      return 'completed';
    } else if (stepNumber === uploadState.progress && uploadState.stage !== 'completed') {
      return 'loading';
    } else if (uploadState.stage === 'completed' && stepNumber <= 5) {
      return 'completed';
    } else {
      return 'pending';
    }
  };

  // 단계별 아이콘 렌더링 함수
  const renderStepIcon = (stepStatus) => {
    switch (stepStatus) {
      case 'completed':
        return (
          <div className="w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center">
            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'loading':
        return (
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        );
      default: // pending
        return (
          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
        );
    }
  };

  // 단계별 텍스트 색상
  const getStepTextColor = (stepStatus) => {
    switch (stepStatus) {
      case 'completed': return 'text-emerald-700 font-medium';
      case 'error': return 'text-red-700 font-medium';
      case 'loading': return 'text-blue-700 font-medium';
      default: return 'text-gray-500';
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
          {/* 1단계: 음성 파일 업로드 */}
          <div className="flex items-center space-x-2">
            {renderStepIcon(getStepStatus(1))}
            <span className={`text-sm ${getStepTextColor(getStepStatus(1))}`}>
              음성 파일 업로드
            </span>
            {getStepStatus(1) === 'error' && (
              <span className="text-xs text-red-600 ml-2">← 여기서 오류 발생</span>
            )}
          </div>

          {/* 2단계: STT 변환 */}
          <div className="flex items-center space-x-2">
            {renderStepIcon(getStepStatus(2))}
            <span className={`text-sm ${getStepTextColor(getStepStatus(2))}`}>
              STT 변환
            </span>
            {getStepStatus(2) === 'error' && (
              <span className="text-xs text-red-600 ml-2">← 여기서 오류 발생</span>
            )}
          </div>

          {/* 3단계: 스크립트 저장 */}
          <div className="flex items-center space-x-2">
            {renderStepIcon(getStepStatus(3))}
            <span className={`text-sm ${getStepTextColor(getStepStatus(3))}`}>
              스크립트 저장
            </span>
            {getStepStatus(3) === 'error' && (
              <span className="text-xs text-red-600 ml-2">← 여기서 오류 발생</span>
            )}
          </div>

          {/* 4단계: ReportSource 생성 */}
          <div className="flex items-center space-x-2">
            {renderStepIcon(getStepStatus(4))}
            <span className={`text-sm ${getStepTextColor(getStepStatus(4))}`}>
              ReportSource 생성
            </span>
            {getStepStatus(4) === 'error' && (
              <span className="text-xs text-red-600 ml-2">← 여기서 오류 발생</span>
            )}
          </div>

          {/* 5단계: Report 생성 */}
          <div className="flex items-center space-x-2">
            {renderStepIcon(getStepStatus(5))}
            <span className={`text-sm ${getStepTextColor(getStepStatus(5))}`}>
              Report 생성
            </span>
            {getStepStatus(5) === 'error' && (
              <span className="text-xs text-red-600 ml-2">← 여기서 오류 발생</span>
            )}
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
