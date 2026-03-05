
import { GoogleGenAI, Type } from "@google/genai";
import { Contract } from "../types.ts";

const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.warn('[SupplyLens] ⚠️ Gemini API key is missing. Set API_KEY in your .env file.');
}
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// ─── Models ──────────────────────────────────────────────
const TEXT_MODEL = 'gemini-3.1-flash-image-preview';
const IMAGE_MODEL = 'gemini-3.1-flash-image-preview';

export interface SmartFilterResponse {
  filterReasoning: string;
  filteredIds: string[];
  answer: string;
}

export interface KeyClause {
  type: string;
  originalText: string;
  summary: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface PortfolioInsight {
  title: string;
  description: string;
  category: 'risk' | 'milestone' | 'compliance' | 'optimization';
  priority: 'High' | 'Medium' | 'Low';
}

// ─── Document Image Analysis (gemini-3.1-flash-image-preview) ───────────────

export interface DocumentPageAnalysis {
  pageNumber: number;
  pageType: 'cover' | 'terms' | 'schedule' | 'signature' | 'exhibit' | 'amendment';
  summary: string;
  keyPoints: string[];
  riskFlags: string[];
  confidence: number;
}

export interface DocumentAnalysisResult {
  documentTitle: string;
  documentType: string;
  parties: string[];
  effectiveDate: string;
  totalValue: string;
  governingLaw: string;
  overallRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  pages: DocumentPageAnalysis[];
  executiveSummary: string;
  redFlags: string[];
  recommendations: string[];
}

/**
 * Analyzes a document image using gemini-3.1-flash-image-preview.
 * @param imageBase64 - Base64-encoded image data (without the data: prefix)
 * @param mimeType - MIME type of the image (e.g. 'image/png', 'image/jpeg', 'image/pdf')
 */
export const analyzeDocumentImage = async (
  imageBase64: string,
  mimeType: string = 'image/png'
): Promise<DocumentAnalysisResult> => {
  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType
            }
          },
          {
            text: `You are a senior contract analyst reviewing a supply chain/manufacturing contract document image.

Analyze this document image and extract all visible contract information. If the image is not a contract, simulate a realistic supply chain contract analysis based on any visible text or structure.

Return a comprehensive JSON analysis with:
- documentTitle, documentType, parties (array), effectiveDate, totalValue, governingLaw
- overallRisk: 'Low' | 'Medium' | 'High' | 'Critical'
- pages: array of { pageNumber, pageType, summary, keyPoints (array), riskFlags (array), confidence (0-1) }
- executiveSummary: 2-3 sentence analysis
- redFlags: array of critical issues found
- recommendations: array of action items

Be specific about supply chain risks (single source dependencies, force majeure, SLA penalties, IP rights).`
          }
        ]
      }
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          documentTitle: { type: Type.STRING },
          documentType: { type: Type.STRING },
          parties: { type: Type.ARRAY, items: { type: Type.STRING } },
          effectiveDate: { type: Type.STRING },
          totalValue: { type: Type.STRING },
          governingLaw: { type: Type.STRING },
          overallRisk: { type: Type.STRING },
          pages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                pageNumber: { type: Type.INTEGER },
                pageType: { type: Type.STRING },
                summary: { type: Type.STRING },
                keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                riskFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
                confidence: { type: Type.NUMBER }
              },
              required: ['pageNumber', 'pageType', 'summary', 'keyPoints', 'riskFlags', 'confidence']
            }
          },
          executiveSummary: { type: Type.STRING },
          redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['documentTitle', 'documentType', 'parties', 'effectiveDate', 'totalValue', 'governingLaw', 'overallRisk', 'pages', 'executiveSummary', 'redFlags', 'recommendations']
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}') as DocumentAnalysisResult;
  } catch (e) {
    console.error('[SupplyLens] Failed to parse document analysis', e);
    throw new Error('Failed to analyze document image');
  }
};

/**
 * Generates a simulated multi-page document preview using gemini-3.1-flash-image-preview
 * when no image is uploaded (demo mode).
 */
export const generateDocumentPreview = async (contract: Contract): Promise<DocumentAnalysisResult> => {
  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: `
You are a supply chain legal expert. Generate a realistic, detailed simulated contract analysis for:

Contract Title: ${contract.contractTitle}
Type: ${contract.contractType}
Parties: ${contract.parties.join(', ')}
Value: ${contract.industrySpecific?.contractValue ? `$${Number(contract.industrySpecific.contractValue).toLocaleString()}` : 'Undisclosed'}
Risk Score: ${contract.riskScore}/10
Criticality: ${contract.criticality}
Governing Law: ${contract.governingLaw}
Expiry: ${contract.expirationDate}
Summary: ${contract.executiveSummary}

Simulate a 4-page contract document analysis with realistic clause text, realistic risk flags.
Return a full DocumentAnalysisResult JSON.
    `,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          documentTitle: { type: Type.STRING },
          documentType: { type: Type.STRING },
          parties: { type: Type.ARRAY, items: { type: Type.STRING } },
          effectiveDate: { type: Type.STRING },
          totalValue: { type: Type.STRING },
          governingLaw: { type: Type.STRING },
          overallRisk: { type: Type.STRING },
          pages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                pageNumber: { type: Type.INTEGER },
                pageType: { type: Type.STRING },
                summary: { type: Type.STRING },
                keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                riskFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
                confidence: { type: Type.NUMBER }
              },
              required: ['pageNumber', 'pageType', 'summary', 'keyPoints', 'riskFlags', 'confidence']
            }
          },
          executiveSummary: { type: Type.STRING },
          redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['documentTitle', 'documentType', 'parties', 'effectiveDate', 'totalValue', 'governingLaw', 'overallRisk', 'pages', 'executiveSummary', 'redFlags', 'recommendations']
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}') as DocumentAnalysisResult;
  } catch (e) {
    console.error('[SupplyLens] Failed to generate document preview', e);
    throw new Error('Failed to generate document preview');
  }
};

export const queryContracts = async (query: string, contracts: Contract[]): Promise<SmartFilterResponse> => {
  const context = contracts.map(c => ({
    id: c.id,
    title: c.contractTitle,
    type: c.contractType,
    tier: c.supplierTier,
    criticality: c.criticality,
    risk: c.riskScore,
    summary: c.executiveSummary,
    industryDetails: c.industrySpecific
  }));

  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: `
      Role: You are a Supply Chain Contract Intelligence Agent.
      User Query: "${query}"
      
      Contract Data: ${JSON.stringify(context)}
      
      Task:
      1. Analyze the user query against the supply chain contract data.
      2. Identify relevant contracts based on Contract Type (e.g., JDAs, NDAs, Licensing), Supplier Tier, Criticality, Risk, or Lead Times.
      3. Provide a concise operational answer (e.g., impact on production, inventory risk, IP exposure).
      4. Explain your reasoning.
      
      Return the result strictly in JSON format.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          filterReasoning: { type: Type.STRING },
          filteredIds: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          answer: { type: Type.STRING }
        },
        required: ["filterReasoning", "filteredIds", "answer"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as SmartFilterResponse;
};

export const getContractInsights = async (contracts: Contract[]): Promise<PortfolioInsight[]> => {
  const summary = contracts.map(c =>
    `${c.contractTitle} [${c.contractType}, ${c.supplierTier}, ${c.criticality}]: Risk ${c.riskScore}`
  ).join(', ');

  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: `
    Act as a Global Supply Chain Director. Provide 3 strategic insights based on this supplier contract portfolio: ${summary}. 
    
    Focus on:
    1. Supply Continuity & Disruption Risk (Single source, geopolitics).
    2. Operational Efficiency (VMI, Logistics, Lead times).
    3. Innovation & IP (Joint Development, Licensing).
    4. Compliance & Tier Management.

    Each insight should have a short punchy title and a one-sentence description. Use categories: risk, milestone, compliance, or optimization.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING, enum: ['risk', 'milestone', 'compliance', 'optimization'] },
            priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] }
          },
          required: ["title", "description", "category", "priority"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse portfolio insights", e);
    return [];
  }
};

export const extractKeyClauses = async (contract: Contract): Promise<KeyClause[]> => {
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: `
      Analyze this supply chain contract and extract realistic simulated clauses for:
      1. Force Majeure (Specific to supply chain disruption, pandemics, war)
      2. Service Level Agreement (SLA) / KPI Penalties
      3. Price Adjustment / Indexation Mechanisms
      4. IP Rights / Exclusivity (if applicable for JDAs or Licensing)
      
      Contract Details:
      Title: ${contract.contractTitle}
      Type: ${contract.contractType}
      Industry: ${contract.industryTrack}
      Criticality: ${contract.criticality}
      
      Return a JSON array of objects with 'type', 'originalText' (legal text), 'summary' (plain english), and 'riskLevel'.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            originalText: { type: Type.STRING },
            summary: { type: Type.STRING },
            riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }
          },
          required: ["type", "originalText", "summary", "riskLevel"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse clauses", e);
    return [];
  }
};
