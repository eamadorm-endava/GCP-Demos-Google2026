
import { GoogleGenAI, Type } from "@google/genai";
import { Vendor, MetricLog, Invoice, GovernanceEvent } from './types';

// Helper to create a fresh AI instance with the current API key
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQBRContent = async (vendor: Vendor, metrics: MetricLog[], events: GovernanceEvent[]) => {
  const ai = getAI();
  const prompt = `
    Generate a high-level executive summary for a Quarterly Business Review (QBR) for vendor "${vendor.name}".
    
    Performance Data (Metric Logs):
    ${JSON.stringify(metrics, null, 2)}
    
    Historical Governance Events & Past Action Items:
    ${JSON.stringify(events, null, 2)}
    
    Tasks:
    1. Analyze trends in the metrics, specifically looking for correlations between "Velocity", "Bug Count", and "Response Time". 
       Is high velocity coming at the cost of quality?
    2. Review past action items and meeting summaries to determine if the vendor is adhering to commitments.
    3. Identify 3 major successes, 3 key risks (data-backed), and 3 strategic recommendations.
    
    The response must be in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    // FIX: For single text prompts, `contents` should be a string.
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          executiveSummary: { type: Type.STRING },
          keySuccesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          risks: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["executiveSummary", "keySuccesses", "risks", "recommendations"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateSlidesJSON = async (qbrResult: any) => {
  const ai = getAI();
  const prompt = `
    You are the 'Workspace Agent'. Convert the following QBR data into a structured format for a Presentation Deck (Google Slides / PowerPoint).
    
    QBR Data:
    ${JSON.stringify(qbrResult, null, 2)}
    
    Create a set of 5-6 slides. For each slide, define:
    1. Title
    2. Bullet points
    3. The best type of data visualization to accompany this slide.
    
    Visual Type Logic:
    - If talking about finances/budget, use "CHART_SPEND".
    - If talking about velocity, bugs, or efficiency, use "CHART_VELOCITY".
    - If talking about SLAs or uptime, use "CHART_SLA".
    - If talking about risks or scores, use "SCORECARD".
    - Otherwise, use "NONE".
    
    The output must be a JSON array of slide objects.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    // FIX: For single text prompts, `contents` should be a string.
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.ARRAY, items: { type: Type.STRING } },
            visualType: { 
              type: Type.STRING, 
              enum: ["CHART_SPEND", "CHART_VELOCITY", "CHART_SLA", "SCORECARD", "NONE"] 
            }
          },
          required: ["title", "content", "visualType"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const transcribeAndSummarizeMeeting = async (audioBase64: string, mimeType: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    // FIX: Use a multimodal model appropriate for audio input and JSON output.
    model: 'gemini-3-pro-preview',
    // FIX: `contents` should be an array of Content objects.
    contents: [{
      parts: [
        {
          inlineData: {
            data: audioBase64,
            mimeType: mimeType
          }
        },
        {
          text: "You are the 'Agentic Scribe'. Listen to this vendor governance meeting. Provide a concise executive summary of the discussion and extract a list of specific action items. Return the result in JSON format."
        }
      ]
    }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "A high-level summary of the meeting." },
          actionItems: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific tasks or decisions made." }
        },
        required: ["summary", "actionItems"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const parseInvoiceAndAudit = async (fileBase64: string, mimeType: string, rateCard: any) => {
  const ai = getAI();
  const prompt = `
    You are the 'Auditor Agent'. Extract data from this invoice file and audit it against the provided rate card.
    
    Rate Card: ${JSON.stringify(rateCard)}
    
    Tasks:
    1. Extract Invoice Number, Date, Total Amount, and Vendor Name.
    2. Extract all line items (Role, Hours, Rate, Total).
    3. Cross-reference rates against the rate card.
    4. Flag line items if the rate is higher than the card or if hours for a single person/role exceed 45 hours/week.
    
    Return the result in structured JSON.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    // FIX: `contents` should be an array of Content objects.
    contents: [{
      parts: [
        {
          inlineData: {
            data: fileBase64,
            mimeType: mimeType
          }
        },
        { text: prompt }
      ]
    }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          invoiceNumber: { type: Type.STRING },
          vendorName: { type: Type.STRING },
          date: { type: Type.STRING },
          amount: { type: Type.NUMBER },
          status: { type: Type.STRING, enum: ["Passed", "Flagged", "Rejected"] },
          agentNotes: { type: Type.STRING },
          lineItems: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING },
                hours: { type: Type.NUMBER },
                rate: { type: Type.NUMBER },
                total: { type: Type.NUMBER },
                discrepancy: { type: Type.BOOLEAN }
              },
              required: ["role", "hours", "rate", "total"]
            }
          }
        },
        required: ["invoiceNumber", "vendorName", "date", "amount", "status", "agentNotes", "lineItems"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const auditInvoice = async (invoice: Invoice, rateCard: any) => {
  const ai = getAI();
  const prompt = `
    Audit the following invoice against the MSA Rate Card.
    Invoice: ${JSON.stringify(invoice)}
    Rate Card: ${JSON.stringify(rateCard)}
    
    Flag any line items where the rate exceeds the card or where hours seem excessive (e.g. > 50 hours/week).
    Return a JSON response with status (Passed/Flagged), flags (array of strings), and agentNotes (string).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    // FIX: For single text prompts, `contents` should be a string.
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          status: { type: Type.STRING },
          flags: { type: Type.ARRAY, items: { type: Type.STRING } },
          agentNotes: { type: Type.STRING },
        },
        propertyOrdering: ["status", "flags", "agentNotes"]
      }
    }
  });

  return JSON.parse(response.text);
};
