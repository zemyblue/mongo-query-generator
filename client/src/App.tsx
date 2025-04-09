
import { useEffect, useState } from "react";
import axios from "axios";

type Field = {
  name: string;
  type: string;
};

type Collection = {
  id: string;
  name: string;
  fields: Field[];
};

function App() {
  const [question, setQuestion] = useState("");
  const [command, setCommand] = useState("");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>("");
  const [showRegister, setShowRegister] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newFields, setNewFields] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchCollections = async () => {
    const res = await axios.get("http://localhost:3001/collections");
    setCollections(res.data);
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const generateCommand = async () => {
    setLoading(true);
    setCopied(false);
    const selected = collections.find((c) => c.name === selectedCollection);
    const res = await axios.post("http://localhost:3001/generate", {
      question,
      collection: selected,
    });
    setCommand(res.data.command);
    setLoading(false);
  };

  const registerOrUpdateCollection = async () => {
    const fields: Field[] = newFields.split(",").map((f) => {
      const [name, type] = f.split(":").map((s) => s.trim());
      return { name, type: type || "string" };
    });

    if (editingId) {
      await axios.put(`http://localhost:3001/collections/${editingId}`, {
        name: newCollectionName,
        fields,
      });
    } else {
      await axios.post("http://localhost:3001/collections", {
        name: newCollectionName,
        fields,
      });
    }

    setNewCollectionName("");
    setNewFields("");
    setEditingId(null);
    setShowRegister(false);
    fetchCollections();
  };

  const handleEdit = (col: Collection) => {
    setEditingId(col.id);
    setNewCollectionName(col.name);
    setNewFields(col.fields.map(f => `${f.name}:${f.type}`).join(","));
    setShowRegister(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      await axios.delete(`http://localhost:3001/collections/${id}`);
      fetchCollections();
    }
  };

  const handleCopy = async () => {
    if (!command) return;
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCommand("");
    setCopied(false);
    setQuestion("");
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>MongoDB 쿼리 생성기 (LLaMA3)</h1>

      <h2>자연어 → Mongo 명령어 생성</h2>
      <select onChange={(e) => setSelectedCollection(e.target.value)} value={selectedCollection}>
        <option value="">컬렉션 선택</option>
        {collections.map((c) => (
          <option key={c.id} value={c.name}>{c.name}</option>
        ))}
      </select>
      <br /><br />
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={4}
        cols={60}
        placeholder="예: 이메일이 test@example.com인 유저 찾기"
      />
      <br />
      <button onClick={generateCommand} disabled={loading}>
        {loading ? "생성 중..." : "명령어 생성"}
      </button>
      <button onClick={handleReset} style={{ marginLeft: "1rem" }}>
        결과 초기화
      </button>

      {command && (
        <div style={{ marginTop: "1rem" }}>
          <pre style={{ background: "#f4f4f4", padding: "1rem" }}>
            <code>{command.replace(/^\s*js\s*/i, "").trim()}</code>
          </pre>
          <button onClick={handleCopy}>
            {copied ? "복사됨!" : "명령어 복사"}
          </button>
        </div>
      )}

      <hr style={{ margin: "2rem 0" }} />
      <button onClick={() => setShowRegister(!showRegister)}>
        {showRegister ? "등록 닫기" : "컬렉션 등록하기"}
      </button>

      {showRegister && (
        <div style={{ marginTop: "1rem" }}>
          <h3>{editingId ? "컬렉션 수정" : "새 컬렉션 등록"}</h3>
          <input
            type="text"
            placeholder="컬렉션 이름"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
          />
          <br />
          <input
            type="text"
            placeholder="필드 목록 (예: name:string,email:string,created_at:date)"
            value={newFields}
            onChange={(e) => setNewFields(e.target.value)}
            style={{ width: "400px" }}
          />
          <br />
          <button onClick={registerOrUpdateCollection}>
            {editingId ? "수정 완료" : "컬렉션 추가"}
          </button>

          <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#444" }}>
            <p>📌 <strong>입력 예시:</strong></p>
            <pre style={{ background: "#f8f8f8", padding: "0.5rem" }}>
products
name:string,price:number,stock:number
            </pre>
          </div>
        </div>
      )}

      <h3 style={{ marginTop: "2rem" }}>📂 등록된 컬렉션 목록</h3>
      <ul>
        {collections.map((col) => (
          <li key={col.id}>
            <strong>{col.name}</strong> —{" "}
            {col.fields.map((f) => `${f.name}:${f.type}`).join(", ")}
            <button style={{ marginLeft: "1rem" }} onClick={() => handleEdit(col)}>수정</button>
            <button style={{ marginLeft: "0.5rem", color: "red" }} onClick={() => handleDelete(col.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
