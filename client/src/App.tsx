
import { useState } from "react";
import axios from "axios";

function App() {
  const [question, setQuestion] = useState("");
  const [command, setCommand] = useState("");

  const generateCommand = async () => {
    const res = await axios.post("http://localhost:3001/generate", { question });
    setCommand(res.data.command);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>MongoDB 쿼리 생성기 (LLaMA3)</h1>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={4}
        cols={60}
        placeholder="예: 이메일이 test@example.com인 유저 찾기"
      />
      <br />
      <button onClick={generateCommand}>명령어 생성</button>
      {command && (
        <pre style={{ marginTop: "1rem", background: "#f4f4f4", padding: "1rem" }}>
          {command}
        </pre>
      )}
    </div>
  );
}

export default App;
