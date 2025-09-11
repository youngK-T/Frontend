'use client';

import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

const UploadContext = createContext();

export function useUpload() {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error('useUpload must be used within an UploadProvider');
  }
  return context;
}

export function UploadProvider({ children }) {
  const [uploadState, setUploadState] = useState({
    isUploading: false,
    fileName: '',
    title: '',
    progress: 0,
    stage: '', // 'uploading', 'processing', 'stt', 'script', 'analyzing', 'completed', 'error'
    stageText: '',
    error: null,
    result: null
  });
  
  const router = useRouter();

  const startUpload = async (file, title) => {
    setUploadState({
      isUploading: true,
      fileName: file.name,
      title,
      progress: 0,
      stage: 'uploading',
      stageText: '음성 파일 업로드',
      error: null,
      result: null
    });

    try {
      console.log('업로드 시작:', { file: file.name, title });

      // FormData 생성
      const formData = new FormData();
      formData.append('title', title);
      formData.append('file', file);

      // 1단계: 업로드 시작
      setUploadState(prev => ({ 
        ...prev, 
        progress: 1,
        stage: 'uploading',
        stageText: '음성 파일 업로드'
      }));

      // 똑똑한 API URL 감지
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 
        (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
          ? `${window.location.protocol}//${window.location.hostname}` 
          : 'https://scriptcreateservice06-a6buhjcfbnfbcuhz.koreacentral-01.azurewebsites.net');

      // 2단계: STT 변환
      setUploadState(prev => ({ 
        ...prev, 
        progress: 2,
        stage: 'stt',
        stageText: 'STT 변환'
      }));

      // Azure API 호출
      const response = await fetch(`${API_BASE_URL}/api/scripts`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`업로드 실패: ${response.status} ${response.statusText}`);
      }

      // 3단계: 스크립트 저장
      setUploadState(prev => ({ 
        ...prev, 
        progress: 3,
        stage: 'script',
        stageText: '스크립트 저장'
      }));

      const result = await response.json();
      console.log('업로드 성공:', result);

      // 4단계: ReportSource 생성
      setUploadState(prev => ({ 
        ...prev, 
        progress: 4,
        stage: 'analyzing',
        stageText: 'ReportSource 생성'
      }));

      // 5단계: Report 생성
      setUploadState(prev => ({ 
        ...prev, 
        progress: 5,
        stage: 'completed',
        stageText: '완료',
        result
      }));

      // 3초 후 자동으로 meetings 페이지로 이동
      setTimeout(() => {
        router.push('/meetings');
        // 5초 후 상태 초기화
        setTimeout(() => {
          resetUpload();
        }, 5000);
      }, 3000);

    } catch (error) {
      console.error('업로드 중 오류 발생:', error);
      setUploadState(prev => ({
        ...prev,
        stage: 'error',
        stageText: '오류 발생',
        error: error.message
      }));
    }
  };

  const resetUpload = () => {
    setUploadState({
      isUploading: false,
      fileName: '',
      title: '',
      progress: 0,
      stage: '',
      stageText: '',
      error: null,
      result: null
    });
  };

  const dismissUpload = () => {
    if (uploadState.stage === 'completed' || uploadState.stage === 'error') {
      resetUpload();
    }
  };

  return (
    <UploadContext.Provider value={{
      uploadState,
      startUpload,
      resetUpload,
      dismissUpload
    }}>
      {children}
    </UploadContext.Provider>
  );
}
