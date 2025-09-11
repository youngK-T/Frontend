'use client';

import { useState, useRef } from 'react';
import { useUpload } from '@/contexts/UploadContext';

export default function SimpleUploadModal({ isOpen, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const { startUpload } = useUpload();

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

  // 업로드 시작
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('파일을 선택해주세요.');
      return;
    }
    if (!meetingTitle.trim()) {
      alert('회의 제목을 입력해주세요.');
      return;
    }

    // 업로드할 데이터를 미리 저장
    const fileToUpload = selectedFile;
    const titleToUpload = meetingTitle.trim();
    
    // 모달 닫기 및 폼 초기화
    handleCancel();
    
    // 전역 상태로 업로드 시작
    startUpload(fileToUpload, titleToUpload);
  };

  // 취소
  const handleCancel = () => {
    setSelectedFile(null);
    setMeetingTitle('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">새 회의 업로드</h2>
            <p className="text-gray-600 text-sm">음성 파일을 업로드하여 AI 분석을 시작하세요</p>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* 파일 업로드 영역 */}
        <div className="mb-4">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleFileInputClick}
          >
            <div className="flex justify-center mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-gray-600 mb-1">파일을 드래그하거나 클릭하여 선택</p>
            <p className="text-xs text-gray-500">WAV, MP3, M4A, AAC (최대 100MB)</p>
            
            {selectedFile && (
              <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
                <p className="text-green-800 text-sm font-medium">✓ {selectedFile.name}</p>
                <p className="text-green-600 text-xs">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            ({meetingTitle.length}/100자)
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || !meetingTitle.trim()}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedFile && meetingTitle.trim()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            업로드 시작
          </button>
        </div>
      </div>
    </div>
  );
}
