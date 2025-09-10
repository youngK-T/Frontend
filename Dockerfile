# ===============================
# Stage 1: Build Stage (빌드용)
# ===============================
FROM node:18-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사 (캐시 최적화)
COPY package*.json ./

# 의존성 설치 (빌드에 필요한 모든 패키지)
RUN npm ci --frozen-lockfile

# 소스 코드 복사
COPY . .

# Next.js 빌드
RUN npm run build

# ===============================
# Stage 2: Production Stage (실행용)
# ===============================
FROM node:18-alpine AS runner

# curl 설치 (헬스체크용) 및 보안을 위한 non-root 사용자 생성
RUN apk add --no-cache curl \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# 작업 디렉토리 설정
WORKDIR /app

# 프로덕션 의존성만 설치
COPY package*.json ./
RUN npm ci --only=production --frozen-lockfile && npm cache clean --force

# 빌드 결과물 복사 (builder 스테이지에서)
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Next.js 설정 파일 복사 (있다면)
COPY --chown=nextjs:nodejs next.config.* ./

# non-root 사용자로 전환
USER nextjs

# 포트 노출
EXPOSE 3000

# 헬스체크 추가 (안정성)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# 애플리케이션 실행
CMD ["npm", "start"]
