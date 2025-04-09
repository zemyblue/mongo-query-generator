
import { Router } from "express";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const router = Router();
const filePath = path.join(__dirname, "..", "collections.json");

function readCollections() {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeCollections(data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

router.get("/", (req, res) => {
  const data = readCollections();
  res.json(data);
});

router.post("/", (req, res) => {
  const { name, fields } = req.body;
  if (!name || !Array.isArray(fields)) {
    return res.status(400).json({ error: "name과 fields가 필요합니다." });
  }

  const data = readCollections();
  const newEntry = { id: uuidv4(), name, fields };
  const updated = [...data, newEntry];
  writeCollections(updated);
  res.status(201).json({ message: "컬렉션이 추가되었습니다." });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, fields } = req.body;

  if (!name || !Array.isArray(fields)) {
    return res.status(400).json({ error: "name과 fields가 필요합니다." });
  }

  const data = readCollections();
  const updated = data.map((c: any) => c.id === id ? { ...c, name, fields } : c);
  writeCollections(updated);
  res.json({ message: "컬렉션이 수정되었습니다." });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const data = readCollections();
  const filtered = data.filter((c: any) => c.id !== id);
  writeCollections(filtered);
  res.json({ message: "컬렉션이 삭제되었습니다." });
});

export default router;
