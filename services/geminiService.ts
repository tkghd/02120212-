
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Type } from "@google/genai";
import { WealthInsight, Transaction } from "../types";

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    mutationName: {
      type: Type.STRING,
      description: "A futuristic name for the current wealth state visualization.",
    },
    analysis: {
      type: Type.STRING,
      description: "A concise, sharp financial analysis based on recent transactions.",
    },
    healthScore: {
      type: Type.NUMBER,
      description: "A score from 0 to 100 representing financial health.",
    },
    recommendation: {
      type: Type.STRING,
      description: "A high-impact recommendation for the user.",
    },
    visualCode: {
      type: Type.STRING,
      description: "A p5.js instance mode function body (accepting 'p') that visualizes financial energy. Use HSB colors. The canvas is 400x400. No backgrounds, use p.clear().",
    },
  },
  required: ["mutationName", "analysis", "healthScore", "recommendation", "visualCode"],
};

export const analyzeWealth = async (
  balance: number,
  transactions: Transaction[],
  onStreamUpdate?: (text: string) => void
): Promise<WealthInsight> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY_MISSING");

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    You are the VAULT FUSION AI, a world-class financial intelligence unit.
    Your tone is sophisticated, sharp, and futuristic.
    Analyze the user's spending patterns and generate a 'Living Wealth Visualization' in p5.js.
    
    VISUAL GUIDELINES:
    - Use p.clear() for transparency.
    - Focus on fluid, organic motion.
    - Higher healthScore should result in more stable, bright, and harmonious visuals.
    - Low score should result in erratic, sharp, and dim visuals.
    - Canvas is 400x400.
    - Output ONLY the body of the function (p.setup and p.draw).
  `;

  const prompt = `
    USER_BALANCE: $${balance}
    RECENT_TRANSACTIONS: ${JSON.stringify(transactions)}
    
    Provide a deep-dive analysis and the next evolutionary state of the Wealth Pulse visual.
  `;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const parsed = JSON.parse(result.text || "{}");
    return {
      mutationName: parsed.mutationName,
      analysis: parsed.analysis,
      healthScore: parsed.healthScore,
      recommendation: parsed.recommendation,
      visualCode: parsed.visualCode,
    };
  } catch (error) {
    console.error("AI Analysis Failed", error);
    throw error;
  }
};
