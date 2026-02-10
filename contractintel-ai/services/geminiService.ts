import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalyzedContract } from "../types";

const apiKey = process.env.API_KEY || '';
// In a real scenario, we handle missing API key gracefully in the UI.
const ai = new GoogleGenAI({ apiKey });

// Define the schema for the Gemini response
const contractAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "The official title of the contract" },
    type: { type: Type.STRING, description: "The category of the contract (e.g., MSA, NDA, Software License)" },
    parties: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of entities or parties involved in the contract"
    },
    effectiveDate: { type: Type.STRING, description: "Effective date in YYYY-MM-DD format, or null if not found" },
    expirationDate: { type: Type.STRING, description: "Expiration date in YYYY-MM-DD format, or null if not found" },
    riskScore: { type: Type.INTEGER, description: "A calculated risk score from 1 (Safe) to 10 (High Risk)" },
    riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"], description: "Risk classification" },
    summary: { type: Type.STRING, description: "A brief executive summary of the contract obligations and risks" },
    missingClauses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of standard clauses that are missing (e.g., Data Breach, Renewal Opt-out)"
    },
    flaggedTerms: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of ambiguous or high-risk terms identified"
    },
    governingLaw: { type: Type.STRING, description: "The jurisdiction governing the contract" }
  },
  required: ["title", "type", "parties", "riskScore", "riskLevel", "summary", "governingLaw"]
};

export const analyzeContractFile = async (file: File): Promise<AnalyzedContract> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = (reader.result as string).split(',')[1];
        const mimeType = file.type;

        // Gemini 2.5 Flash is efficient for this
        const model = "gemini-2.5-flash";

        const prompt = `
          You are an expert Legal Risk Analyst AI for a Financial Services firm.
          Analyze the attached contract document.
          
          Focus on identifying risks as described in financial compliance guidelines:
          1. Identify if auto-renewal clauses exist without clear opt-outs.
          2. Check for missing mandatory clauses like AML/KYC or GDPR if relevant.
          3. Flag non-standard indemnification or liability caps.
          4. Identify the governing law jurisdiction.
          
          Return the analysis in a structured JSON format.
        `;

        const response = await ai.models.generateContent({
          model,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data
                }
              },
              { text: prompt }
            ]
          },
          config: {
            responseMimeType: "application/json",
            responseSchema: contractAnalysisSchema
          }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");
        
        const data = JSON.parse(text);

        // Map to our app's type
        const result: AnalyzedContract = {
          id: crypto.randomUUID(),
          ...data,
          status: data.riskLevel === 'High' ? 'Review Required' : 'Active'
        };

        resolve(result);

      } catch (error) {
        console.error("Error analyzing contract:", error);
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
