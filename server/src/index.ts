
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import generateRouter from "./routes/generate";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/generate", generateRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
