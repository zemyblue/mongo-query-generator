import axios from "axios";

export type OpenAIChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function chatWithLlama(messages: OpenAIChatMessage[]): Promise<string> {
  try {
    const res = await axios.post("http://localhost:11434/api/chat", {
      model: "llama3",
      messages,
      stream: false,
    });

    const text = res.data.message?.content || "";
    return text.trim();
  } catch (error) {
    console.error("LLaMA3 호출 실패:", error);
    throw new Error("LLaMA3 호출 실패");
  }
}
