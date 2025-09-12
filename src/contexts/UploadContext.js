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
      console.log('🚀 업로드 시작:', { 
        fileName: file.name, 
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        fileType: file.type,
        title 
      });

      // FormData 생성
      console.log('📦 1단계: FormData 생성 중...');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('file', file);
      console.log('✅ FormData 생성 완료');

      // 1단계: 업로드 시작
      console.log('📤 1단계: 음성 파일 업로드 시작');
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
      
      console.log('🌐 API URL:', API_BASE_URL);

      // 2단계: STT 변환
      console.log('🎤 2단계: STT 변환 시작');
      setUploadState(prev => ({ 
        ...prev, 
        progress: 2,
        stage: 'stt',
        stageText: 'STT 변환'
      }));

      // Azure API 호출
      console.log('📡 API 호출 시작:', `${API_BASE_URL}/api/scripts`);
      const startTime = Date.now();
      
      const response = await fetch(`${API_BASE_URL}/api/scripts`, {
        method: 'POST',
        body: formData,
      });

      const responseTime = Date.now() - startTime;
      console.log(`📡 API 응답 수신 (${responseTime}ms):`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API 오류 응답:', {
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText
        });
        throw new Error(`업로드 실패: ${response.status} ${response.statusText} - ${errorText}`);
      }

      // 3단계: 스크립트 저장
      console.log('💾 3단계: 스크립트 저장 시작');
      setUploadState(prev => ({ 
        ...prev, 
        progress: 3,
        stage: 'script',
        stageText: '스크립트 저장'
      }));

      console.log('📄 응답 데이터 파싱 중...');
      const result = await response.json();
      console.log('✅ 업로드 성공:', {
        scriptId: result.script_id || result.id,
        title: result.title,
        responseKeys: Object.keys(result)
      });

      // 4단계: ReportSource 생성
      console.log('📊 4단계: ReportSource 생성 시작');
      setUploadState(prev => ({ 
        ...prev, 
        progress: 4,
        stage: 'analyzing',
        stageText: 'ReportSource 생성'
      }));

      // 5단계: Report 생성
      console.log('📋 5단계: Report 생성 시작');
      setUploadState(prev => ({ 
        ...prev, 
        progress: 5,
        stage: 'completed',
        stageText: '완료',
        result
      }));

      console.log('🎉 모든 단계 완료!');

      // 3초 후 자동으로 meetings 페이지로 이동
      setTimeout(() => {
        router.push('/meetings');
        // 5초 후 상태 초기화
        setTimeout(() => {
          resetUpload();
        }, 5000);
      }, 3000);

    } catch (error) {
      const currentProgress = uploadState.progress || 0;
      const currentStage = uploadState.stage || 'unknown';
      
      console.error('💥 업로드 중 오류 발생:', {
        stage: currentStage,
        progress: currentProgress,
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack,
        timestamp: new Date().toISOString()
      });

      // 단계별 오류 분석
      let errorDetail = '';
      switch (currentProgress) {
        case 0:
        case 1:
          errorDetail = '파일 업로드 준비 중 오류';
          console.error('🔍 1단계 오류 분석:', {
            possibleCauses: [
              'FormData 생성 실패',
              '파일 크기 초과',
              '파일 형식 문제'
            ]
          });
          break;
        case 2:
          errorDetail = 'STT 변환 중 오류';
          console.error('🔍 2단계 오류 분석:', {
            possibleCauses: [
              'API 서버 연결 실패',
              '네트워크 타임아웃',
              'API 인증 문제',
              '서버 내부 오류'
            ]
          });
          break;
        case 3:
          errorDetail = '스크립트 저장 중 오류';
          console.error('🔍 3단계 오류 분석:', {
            possibleCauses: [
              'JSON 파싱 실패',
              '응답 데이터 형식 오류',
              '데이터베이스 저장 실패'
            ]
          });
          break;
        case 4:
          errorDetail = 'ReportSource 생성 중 오류';
          console.error('🔍 4단계 오류 분석:', {
            possibleCauses: [
              'AI 분석 서비스 오류',
              '처리 시간 초과',
              '메모리 부족'
            ]
          });
          break;
        case 5:
          errorDetail = 'Report 생성 중 오류';
          console.error('🔍 5단계 오류 분석:', {
            possibleCauses: [
              '최종 보고서 생성 실패',
              '템플릿 처리 오류',
              '파일 저장 실패'
            ]
          });
          break;
        default:
          errorDetail = '알 수 없는 단계에서 오류';
          console.error('🔍 알 수 없는 오류:', {
            currentState: uploadState
          });
      }

      console.error('📋 오류 요약:', {
        단계: `${currentProgress}/5 - ${currentStage}`,
        상세: errorDetail,
        메시지: error.message,
        시간: new Date().toLocaleString('ko-KR')
      });

      setUploadState(prev => ({
        ...prev,
        stage: 'error',
        stageText: '오류 발생',
        error: `${errorDetail}: ${error.message}`
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
