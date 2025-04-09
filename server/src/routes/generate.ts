
import { Router } from "express";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const router = Router();

router.post("/", async (req, res) => {
  const { question } = req.body;
  const collectionsFile = path.join(__dirname, "..", "collections.json");

  const collections = JSON.parse(fs.readFileSync(collectionsFile, "utf-8"));

  const formattedCollections = collections.map((col: any, i: number) => {
    const fieldList = col.fields
      .map((f: any) => typeof f === "string" ? f : `${f.name} (${f.type})`)
      .join(", ");
    return `${i + 1}. ${col.name}: ${fieldList}`;
  }).join("\n");

  const prompt = `
다음은 MongoDB 컬렉션 목록입니다:
${formattedCollections}

사용자의 질문에 따라 MongoDB 콘솔 명령어를 생성해 주세요.
가능하다면 aggregation, lookup도 활용하세요.
명령어만 아래와 같은 형태로 반환하세요:

\`\`\`js
db.<collection>.find(...)
\`\`\`

질문: ${question}
`;

  const ollama = spawn("ollama", ["run", "llama3"]);

  let output = "";
  ollama.stdout.on("data", (data) => {
    output += data.toString();
  });

  ollama.stdin.write(prompt);
  ollama.stdin.end();

  ollama.on("close", () => {
    const match = output.match(/```js\n([\s\S]*?)\n```/);
    const fallback = output.replace(/```.*?\n?/g, "").trim();
    res.json({
      command: match ? match[1].trim() : fallback,
    });
  });

  ollama.stderr.on("data", (err) => {
    console.error("Ollama error:", err.toString());
  });
});

export default router;
