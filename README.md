# Mongo Query Generator (with LLaMA3 via Ollama)

이 프로젝트는 자연어로 MongoDB 콘솔 명령어를 생성하는 도구입니다.  
로컬에서 실행되는 LLaMA3 (Ollama 기반)를 통해 비용 없이 사용 가능합니다.

---

## 🤩 기능
- 자연어 → MongoDB 명령어 자동 변환
- Ollama + LLaMA3 기반 로컬 LLM 사용 (OpenAI 비용 無)
- Frontend: Vite + React + TypeScript
- Backend: Express + TypeScript

---

## 🛠️ 처기 설정 및 실행 방법

### 1. GitHub 클론
```bash
git clone https://github.com/zemyblue/mongo-query-generator.git
cd mongo-query-generator
```

### 2. Ollama 설치 (Mac/Linux)
```bash
# Mac
brew install ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh
```

### 3. LLaMA3 모델 설치 및 실행 확인
```bash
# background에서 수동 실행하고 싶다면
nohup ollama serve > logs/ollama.log 2>&1 &
# 또는 자동 실행
brew services start ollama

# 모델 다운로드 (ollama가 실행되어 있어야 한다)
ollama pull llama3

# 실행 상태 확인 (정상일 경우 JSON 응답)
curl http://localhost:11434
```

> 프로젝트에서는 `./run.sh` 실행 시 Ollama가 켜져 있지 않으면 자동으로 Background에서 실행됩니다.

---

### 4. MongoDB 접속 설정 (.env)
MongoDB에서 컬렉션 정보를 자동으로 불러오려면 `.env` 파일에 아래 정보를 설정해야 합니다:

`.env.example` 예시:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=your_database_name
# 인증이 필요한 경우:
# MONGODB_URI=mongodb://username:password@localhost:27017
```

> 복사하여 `.env` 파일로 만들어 사용하세요:
```bash
cp server/.env.example server/.env
```

---

### 5. Backend 실행
```bash
cd server
cp .env.example .env  # 또는 직접 PORT 설정
npm install
npm run dev
```

> 서버는 `http://localhost:3001`에서 실행됩니다.

---

### 6. Frontend 실행
```bash
cd ../client
npm install
npm run dev
```

> 브라우저에서 `http://localhost:5173` 접속

---

## 📦 MongoDB 컬렉션 정보 자동 업데이트

프론트엔드의 `🔄 컬렉션 동기화` 버튼을 클릭하면 MongoDB에 접속하여 다음 동작을 수행합니다:
- 모든 컬렉션 목록 불러오기
- 각 컬렉션에서 샘플 문서 하나 추출
- 키와 값을 분석하여 필드명 및 타입 추론
- `collections.json` 파일 자동 갱신

> `.env`에 MongoDB 접속 정보가 정확히 설정되어 있어야 작동합니다.

---

## 🚀 실행 방법 요약

### ✅ 1. Local 개발 모드 실행 (스크립트 하나로 실행)

```bash
chmod +x run.sh
./run.sh
```

> 클라이언트 빌드 후 서버가 자동 실행됩니다. 브라우저에서 [http://localhost:5173](http://localhost:5173) 로 접속하세요.

---

### ✅ 2. Docker로 실행하기

```bash
docker-compose build
docker-compose up
```

- 서버 URL: http://localhost:3001
- 클라이언트 URL: http://localhost:5173

> collections.json은 volume으로 링크되어 있어 데이터가 유지됩니다.

---

## 🛠 TypeScript 오류 해결 가이드

`uuid` 관련 오류 발생 시 아래 명령어로 타입 패키지를 설치하세요:

```bash
cd server
npm install --save-dev @types/uuid
```

> TypeScript는 외부 라이브러리의 타입 정보를 필요로 하며, 위 명령어는 `uuid`의 타입 정의를 추가합니다.

