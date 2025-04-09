# Mongo Query Generator (with LLaMA3 via Ollama)

이 프로젝트는 자연어로 MongoDB 콘솔 명령어를 생성하는 도구입니다.  
로컬에서 실행되는 LLaMA3 (Ollama 기반)를 통해 비용 없이 사용 가능합니다.

---

## 🧩 기능
- 자연어 → MongoDB 명령어 자동 변환
- Ollama + LLaMA3 기반 로컬 LLM 사용 (OpenAI 비용 無)
- 프론트엔드: Vite + React + TypeScript
- 백엔드: Express + TypeScript

---

## 🛠️ 초기 설정 및 실행 방법

### 1. GitHub 클론
```bash
git clone https://github.com/your-username/mongo-query-generator.git
cd mongo-query-generator
```

### 2. Ollama 설치 (Mac/Linux)
```bash
# Mac
brew install ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh
```

### 3. LLaMA3 모델 설치
```bash
ollama run llama3
```

---

### 4. 백엔드 실행
```bash
cd server
cp .env.example .env  # 또는 직접 PORT 설정
npm install
npm run dev
```

> 서버는 `http://localhost:3001`에서 실행됩니다.

---

### 5. 프론트엔드 실행
```bash
cd ../client
npm install
npm run dev
```

> 브라우저에서 `http://localhost:5173` 접속

---

## 📦 MongoDB 컬렉션 정보 업데이트

현재 `server/src/routes/generate.ts` 파일에 컬렉션 정보가 하드코딩되어 있습니다.

예: 
```ts
컬렉션 이름은 'users'이고, 필드는 email(string), name(string), created_at(date)
```

이 부분을 추후 다음 방식으로 확장할 수 있습니다:
- JSON 파일에서 컬렉션 목록을 불러오도록 변경
- 또는 `/collections` API를 추가하여 프론트에서 등록/편집 가능하게 구성

필요 시 해당 기능도 추가로 지원 가능합니다.

---

## 🚀 실행 방법 요약

### ✅ 1. 로컬 개발 모드 실행 (스크립트 하나로 실행)

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

> collections.json은 volume으로 마운트되어 있어 데이터가 유지됩니다.

---

## 🛠 TypeScript 오류 해결 가이드

`uuid` 관련 오류 발생 시 아래 명령어로 타입 패키지를 설치하세요:

```bash
cd server
npm install --save-dev @types/uuid
```

> TypeScript는 외부 라이브러리의 타입 정보를 필요로 하며, 위 명령어는 `uuid`의 타입 정의를 추가합니다.
