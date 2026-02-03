
import { GoogleGenAI, Type } from "@google/genai";
import { Message } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const complianceExpertChat = async (history: Message[], userInput: string) => {
  const model = ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      { role: 'user', parts: [{ text: `You are the Lead Supervisory Agent (Agent 4) in a 4-agent compliance system. Your knowledge base covers:
      - Banking: OCC, FDIC, Reg E, Z, D, TILA, RESPA, FCRA.
      - Securities: FINRA, SEC Trade Surveillance.
      - Privacy: GLBA, CCPA/CPRA.
      - Frameworks: COSO, ERM.

      The other agents in your team are:
      1. DocBot (Retrieval/Validation)
      2. EffBot (TOE/Anomaly Detection)
      3. DesignBot (TOD/Gap Analysis)

      When a user asks a question, orchestrate the response as if you are leading this team. Provide expert, high-fidelity compliance advice.

      Current user query: ${userInput}` }]}
    ],
    config: {
      temperature: 0.7,
      topP: 0.95,
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });

  const response = await model;
  return response.text;
};

export const analyzeRiskReport = async (data: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following risk and compliance data and generate a summary report including Risk Score (0-100), Top 3 Compliance Gaps, and Recommended Next Steps. 
    Data: ${data}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.NUMBER },
          gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING }
        },
        required: ["riskScore", "gaps", "recommendations", "summary"]
      }
    }
  });
  
  return JSON.parse(response.text || '{}');
};
