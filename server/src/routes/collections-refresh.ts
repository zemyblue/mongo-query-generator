
import { Router } from "express";
import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const router = Router();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.MONGODB_DB || "test";
const filePath = path.join(__dirname, "..", "collections.json");

function inferType(value: any): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (value instanceof Date) return "date";
  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  if (value?._bsontype === "ObjectId") return "ObjectId";
  if (typeof value === "object") return "object";
  return typeof value;
}

router.get("/refresh", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();

    const results = [];

    for (const col of collections) {
      const collection = db.collection(col.name);
      const doc = await collection.findOne();

      if (!doc) continue;

      const fields = Object.entries(doc).map(([key, value]) => ({
        name: key,
        type: inferType(value),
      }));

      results.push({
        id: col.name,
        name: col.name,
        fields,
      });
    }

    fs.writeFileSync(filePath, JSON.stringify(results, null, 2), "utf-8");

    res.json({ message: "컬렉션 정보를 새로 고침했습니다.", collections: results });
  } catch (error) {
    console.error("MongoDB 연결 오류:", error);
    res.status(500).json({ error: "MongoDB에 연결할 수 없습니다." });
  } finally {
    await client.close();
  }
});

export default router;
