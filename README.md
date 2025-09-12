# Summit - 회의 분석 어시스턴트

Summit은 AI 기반 회의 분석 및 검색 시스템의 프론트엔드 애플리케이션입니다. 음성 회의록을 업로드하고, AI를 통해 분석하며, 자연어로 회의 내용을 검색할 수 있는 웹 애플리케이션입니다.

## 🚀 주요 기능

### 📝 회의 관리
- **음성 파일 업로드**: WAV, MP3, M4A, AAC 형식 지원
- **회의록 자동 생성**: AI 기반 음성 인식 및 요약
- **회의록 수정**: 마크다운 형식으로 회의록 편집 및 다운로드
- **태그 관리**: 회의 분류 및 검색을 위한 태그 시스템

### 🤖 AI 셰르파 (챗봇)
- **전사 검색**: 모든 회의록에서 통합 검색
- **단일 회의 검색**: 특정 회의에 대한 집중 분석
- **다중 회의 검색**: 선택된 여러 회의에 대한 통합 분석
- **근거 자료 제공**: 답변의 출처와 인용문 표시
- **신뢰도 점수**: AI 답변의 신뢰도 시각화

### 📊 회의 분석
- **요약 생성**: 회의 내용 자동 요약
- **화자 식별**: 발언자별 내용 구분
- **키워드 추출**: 중요 키워드 및 태그 자동 생성
- **검색 기능**: 제목, 내용, 태그 기반 검색

## 🛠 기술 스택

- **Frontend**: Next.js 15.5.2, React 18
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with responsive design
- **State Management**: React Hooks (useState, useEffect, useContext)
- **Routing**: Next.js App Router
- **Build Tool**: Turbopack (Next.js 15)

## 🏗 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   ├── chat/              # AI 챗봇 페이지
│   ├── meetings/          # 회의 관리 페이지
│   └── globals.css        # 전역 스타일
├── components/            # 재사용 가능한 컴포넌트
│   ├── chat/             # 챗봇 관련 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   ├── meetings/         # 회의 관련 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트
│   └── upload/           # 파일 업로드 컴포넌트
├── contexts/             # React Context
├── hooks/                # 커스텀 훅
├── lib/                  # 유틸리티 라이브러리
└── types/                # TypeScript 타입 정의
```

## 🚀 시작하기

### 개발 환경 설정

1. **의존성 설치**
```bash
npm install
```

2. **개발 서버 실행**
```bash
npm run dev
```

3. **브라우저에서 확인**
[http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

### 빌드 및 배포

1. **프로덕션 빌드**
```bash
npm run build
```

2. **프로덕션 서버 실행**
```bash
npm start
```

## 🔧 환경 변수

다음 환경 변수들을 설정해야 합니다:

```env
NEXT_PUBLIC_CHAT_API_URL=https://your-chat-api-endpoint.com/api/chat/query
```

## 📱 주요 페이지

### 1. 홈 페이지 (`/`)
- 서비스 소개 및 주요 기능 안내

### 2. 회의 목록 (`/meetings`)
- 업로드된 회의록 목록 및 검색
- 태그 필터링 및 정렬 기능

### 3. 회의 상세 (`/meetings/[id]`)
- 회의 요약, 전체 스크립트, 회의록 탭
- 회의록 수정 및 다운로드
- AI 챗봇으로 바로 질문

### 4. AI 셰르파 (`/chat`)
- 전사/단일/다중 검색 모드
- 실시간 AI 답변 및 근거 자료 제공
- 답변 신뢰도 표시

## 🎨 주요 컴포넌트

### ChatBot
- AI 챗봇 인터페이스
- 메시지 히스토리 관리
- 근거 자료 표시 (더보기/접기 기능)

### EvidenceQuote
- AI 답변의 근거 자료 표시
- 회의 세부 페이지로 직접 연결
- 화자, 회의명, 날짜 정보 포함

### MeetingDetail
- 회의 상세 정보 표시
- 탭 기반 내용 구성 (요약/스크립트/회의록)
- 청크 하이라이트 기능

### EditMinutesModal
- 회의록 편집 인터페이스
- 마크다운 형식 지원
- 실시간 미리보기 및 다운로드

## 🔍 검색 기능

### 전사 검색
- 모든 회의록에서 통합 검색
- 키워드 기반 의미론적 검색

### 단일 회의 검색
- 특정 회의에 집중된 질의응답
- 해당 회의의 맥락 내에서 정확한 답변

### 다중 회의 검색
- 선택된 여러 회의에 대한 비교 분석
- 회의간 연관성 및 차이점 분석

## 🤝 기여 방법

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🆘 문제 해결

### 일반적인 문제들

1. **빌드 오류**: `npm run build` 실행 시 오류가 발생하면 `node_modules` 삭제 후 재설치
2. **API 연결 오류**: 환경 변수 설정 확인
3. **스타일 문제**: Tailwind CSS 설정 및 캐시 확인

