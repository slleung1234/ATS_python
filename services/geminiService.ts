import { GoogleGenAI } from "@google/genai";
import { Level } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in env");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getGeminiHint = async (code: string, error: string | null, level: Level): Promise<string> => {
  const ai = createClient();
  if (!ai) return "請先設定 API Key 才能使用 AI 助教功能。";

  const prompt = `
    你是一位友善的香港中學電腦科老師，正在教導中二學生 Python。
    
    情境：
    學生正在玩一個類似 CodeCombat 的遊戲。
    當前關卡：${level.title}
    關卡目標：${level.objective}
    學習重點：${level.pythonConcept}
    
    學生代碼：
    \`\`\`python
    ${code}
    \`\`\`
    
    運行錯誤/狀態：${error ? error : "代碼語法正確，但邏輯可能未完成目標"}
    
    請用繁體中文（廣東話口語風格親切一點）給學生一個簡短的提示或解釋錯誤。
    不要直接給出完整答案，而是引導他們思考。
    如果代碼看起來很亂，提醒他們注意縮排。
    限制在 80 字以內。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "AI 助教暫時休息中，請稍後再試。";
  } catch (e) {
    console.error("Gemini API Error:", e);
    return "連線錯誤，無法取得提示。";
  }
};
