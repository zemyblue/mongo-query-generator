
import { Router } from "express";
import { spawn } from "child_process";

const router = Router();

router.post("/", async (req, res) => {
  const { question } = req.body;

  const prompt = `
너는 MongoDB 콘솔 명령어 생성기야.
컬렉션 이름은 'users'이고, 필드는 email(string), name(string), created_at(date)야.
아래 요청에 대해 MongoDB 콘솔 명령어를 생성해줘. 설명 없이 명령어만 아래 형식으로:
\\`\\`\\`js
db.users.find({ ... })
\\`\\`\\`

요청: ${question}
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
    res.json({
      command: match ? match[1].trim() : output.trim(),
    });
  });

  ollama.stderr.on("data", (err) => {
    console.error("Ollama error:", err.toString());
  });
});

export default router;
