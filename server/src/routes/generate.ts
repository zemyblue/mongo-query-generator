import { Router } from "express";
import fs from "fs";
import path from "path";
import { chatWithLlama, OpenAIChatMessage } from "../llm";

const router = Router();
const collectionsFile = path.join(__dirname, "..", "collections.json");

router.post("/", async (req, res) => {
  const { question, collection } = req.body;

  const formattedCollections = collection
    ? `${collection.name}: ` + collection.fields.map((f: { name: string; type: string }) => `${f.name}(${f.type})`).join(', ')
    : '모든 컬렉션에서 검색';

  const prompt = `다음은 MongoDB 컬렉션 정보를 기반으로 사용자의 자연어 질문을 MongoDB 콘솔 명령어로 변환하는 작업입니다.

💡 전제 조건:
- MongoDB는 하나의 데이터베이스(my_database)를 사용합니다.
- 아래 목록은 이 데이터베이스 내의 컬렉션 이름과 필드 구조입니다.
- 'collection'이라는 컬렉션이 있다면, 이는 일반적인 MongoDB 용어와 혼동되지 않도록 주의해야 합니다.
- 정확한 MongoDB 콘솔 명령어만 출력하세요 (예: \`db.users.find(...)\`).
- 추가 설명은 출력하지 마세요.
- 출력 형식은 반드시 다음을 지켜야 합니다:

\`\`\`js
db.<collectionName>.find({ ... })
\`\`\`

📂 컬렉션 목록:
${formattedCollections}

🧠 사용자 질문:
"${question}"

💬 당신이 생성해야 할 MongoDB 콘솔 명령어는?`;

  const messages: OpenAIChatMessage[] = [
    {
      role: "user",
      content: prompt,
    },
  ];

  try {
    const response = await chatWithLlama(messages);
    res.json({ command: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "LLM 응답 실패" });
  }
});

export default router;