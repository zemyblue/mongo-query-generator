#!/bin/bash

# ollama 체크 및 실행
if ! curl -s http://localhost:11434 > /dev/null; then
  echo "🧠 Ollama가 실행되어 있지 않습니다. 백그라운드로 실행합니다..."
  nohup ollama serve > ../logs/ollama.log 2>&1 &
  sleep 2
else
  echo "✅ Ollama는 이미 실행 중입니다."
fi

echo "📦 서버 의존성 설치 중..."
cd server && npm install && cd ..

echo "📦 클라이언트 의존성 설치 중..."
cd client && npm install && cd ..

echo "🛠 클라이언트 빌드 중..."
cd client && npm run build && cd ..

echo "🚀 서버와 클라이언트를 동시에 실행 중..."

# 실행 로그용 폴더 생성
mkdir -p logs

# 백그라운드에서 서버 실행
cd server
npx ts-node src/index.ts > ../logs/server.log 2>&1 &
SERVER_PID=$!
cd ..

# 백그라운드에서 클라이언트 실행
cd client
npm run dev > ../logs/client.log 2>&1 &
CLIENT_PID=$!
cd ..

# 종료 핸들링
trap "echo '🛑 종료 중...'; kill $SERVER_PID $CLIENT_PID; exit 0" SIGINT

# 프로세스 대기
wait
