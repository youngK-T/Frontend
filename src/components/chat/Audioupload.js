'use client';

import { useState, useRef } from 'react';

export default function AudioUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // 파일 업로드 핸들러
  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      console.log('선택된 파일:', file.name);
    } else {
      alert('오디오 파일만 업로드 가능합니다.');
    }
  };

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // 파일 선택 클릭 핸들러
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // 업로드 및 분석 시작
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('파일을 선택해주세요.');
      return;
    }
    if (!meetingTitle.trim()) {
      alert('회의 제목을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setUploadResult(null);

    try {
      console.log('업로드 시작:', {
        file: selectedFile.name,
        title: meetingTitle
      });

      // FormData 생성
      const formData = new FormData();
      formData.append('title', meetingTitle);
      formData.append('file', selectedFile);

      // Azure API 호출 (프록시 사용)
      const response = await fetch('/api/scripts', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`업로드 실패: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('업로드 성공:', result);
      
      setUploadResult(result);
      
    } catch (error) {
      console.error('업로드 중 오류 발생:', error);
      setError(error.message);
      alert(`업로드 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 취소
  const handleCancel = () => {
    setSelectedFile(null);
    setMeetingTitle('');
    setUploadResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">새 회의 분석</h1>
          <p className="text-gray-600">음성 파일을 업로드하여 AI가 자동으로 회의록을 생성하고 분석합니다.</p>
        </div>

        {/* 파일 업로드 영역 */}
        <div className="mb-6">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleFileInputClick}
          >
            <div className="flex justify-center space-x-4 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-600 mb-2">파일을 드래그하여 놓거나 클릭하여 선택하세요</p>
            <p className="text-sm text-gray-500">WAV, MP3, M4A, AAC (최대 100MB)</p>
            
            {selectedFile && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">✓ {selectedFile.name}</p>
                <p className="text-green-600 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {/* 회의 제목 입력 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            회의 제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            placeholder="예: 제품 개발 팀 회의, 주간 스탠드업 등"
            maxLength={100}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            이 제목으로 회의 레포트가 생성됩니다. ({meetingTitle.length}/100자)
          </p>
        </div>


        {/* 버튼 영역 */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || !meetingTitle.trim() || isLoading}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${
              selectedFile && meetingTitle.trim() && !isLoading
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                업로드 중...
              </>
            ) : (
              '업로드 및 분석 시작'
            )}
          </button>
        </div>

        {/* 업로드 결과 표시 */}
        {uploadResult && (
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-4">업로드 완료!</h3>
            <div className="space-y-2">
              <p><span className="font-medium">스크립트 ID:</span> {uploadResult.scriptId}</p>
              <p><span className="font-medium">제목:</span> {uploadResult.title}</p>
              <p><span className="font-medium">생성 시간:</span> {new Date(uploadResult.timestamp).toLocaleString('ko-KR')}</p>
              <p><span className="font-medium">세그먼트 수:</span> {uploadResult.segments?.length || 0}개</p>
            </div>
            
            {uploadResult.segments && uploadResult.segments.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-green-800 mb-2">회의 내용 미리보기:</h4>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {uploadResult.segments.slice(0, 5).map((segment, index) => (
                    <div key={index} className="text-sm bg-white p-2 rounded border">
                      <span className="font-medium text-blue-600">{segment.speaker}:</span> {segment.text}
                    </div>
                  ))}
                  {uploadResult.segments.length > 5 && (
                    <p className="text-sm text-gray-500">... 및 {uploadResult.segments.length - 5}개 더</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 에러 표시 */}
        {error && (
          <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-semibold text-red-900 mb-2">업로드 실패</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
