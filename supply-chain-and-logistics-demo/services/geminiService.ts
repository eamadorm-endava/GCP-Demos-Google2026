import { GoogleGenAI, Type } from "@google/genai";
import type { Message, RiskAnalysisResponse, Shipment, ShipmentSummary } from "../types";

// Assume process.env.API_KEY is configured in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

// FIX: Update fallback documents to use 'es-LA' and add 'pt-BR' to align with LanguageContext types.
const fallbackDocuments: Record<string, Record<string, string[]>> = {
  en: {
    'Colombia': ['Commercial Invoice', 'Air Waybill (AWB)', 'Phytosanitary Certificate', 'Certificate of Origin'],
    'Ecuador': ['Commercial Invoice', 'Air Waybill (AWB)', 'DAE (Documento Aduanero de Exportación)', 'Phytosanitary Certificate'],
    'default': ['Commercial Invoice', 'Air Waybill (AWB)']
  },
  'es-LA': {
    'Colombia': ['Factura Comercial', 'Guía Aérea (AWB)', 'Certificado Fitosanitario', 'Certificado de Origen'],
    'Ecuador': ['Factura Comercial', 'Guía Aérea (AWB)', 'DAE (Documento Aduanero de Exportación)', 'Certificado Fitosanitario'],
    'default': ['Factura Comercial', 'Guía Aérea (AWB)']
  },
  'pt-BR': {
      'Colombia': ['Fatura Comercial', 'Conhecimento de Embarque Aéreo (AWB)', 'Certificado Fitossanitário', 'Certificado de Origem'],
      'Ecuador': ['Fatura Comercial', 'Conhecimento de Embarque Aéreo (AWB)', 'DAE (Documento Aduaneiro de Exportação)', 'Certificado Fitossanitário'],
      'default': ['Fatura Comercial', 'Conhecimento de Embarque Aéreo (AWB)']
  }
};

// FIX: Update function signature to accept languages from LanguageContext.
export async function getSuggestedDocuments(originCountry: string, destinationCountry: string, language: 'en' | 'es-LA' | 'pt-BR'): Promise<string[]> {
  const lang = language || 'en';
  if (!API_KEY) {
    // Fallback for when API key is not available
    return fallbackDocuments[lang]?.[originCountry] || fallbackDocuments[lang]?.['default'] || fallbackDocuments['en']['default'];
  }

  // FIX: Use a map for prompt languages to support all defined types.
  const promptLanguageMap = { 'en': 'English', 'es-LA': 'Latin American Spanish', 'pt-BR': 'Brazilian Portuguese' };
  const promptLanguage = promptLanguageMap[lang];
  const prompt = `List the essential customs and shipping documents required for exporting fresh-cut flowers from ${originCountry} to ${destinationCountry}. Respond in ${promptLanguage}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            documents: {
              type: Type.ARRAY,
              description: "A list of required document names.",
              items: {
                type: Type.STRING
              }
            }
          }
        }
      }
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    if (result && Array.isArray(result.documents)) {
        return result.documents;
    }
    
    return [];

  } catch (error) {
    console.error("Error fetching suggestions from Gemini API:", error);
    // Provide a sensible fallback on API error
    return fallbackDocuments[lang]?.['default']?.concat(['Phytosanitary Certificate']) || [];
  }
}

// FIX: Update function signature to accept languages from LanguageContext.
export async function getRiskAnalysis(shipment: Shipment, language: 'en' | 'es-LA' | 'pt-BR'): Promise<RiskAnalysisResponse> {
  if (!API_KEY) {
    return { riskLevel: 'Low', analysisPoints: ['API key not configured. This is a default low-risk assessment.'] };
  }
  
  const lang = language || 'en';
  // FIX: Use a map for prompt languages to support all defined types.
  const promptLanguageMap = { 'en': 'English', 'es-LA': 'Latin American Spanish', 'pt-BR': 'Brazilian Portuguese' };
  const promptLanguage = promptLanguageMap[lang];

  // Sanitize shipment data for the prompt
  const shipmentData = JSON.stringify({
    origin: shipment.origin,
    destination: shipment.destination,
    status: shipment.status,
    milestones: shipment.milestones.map(({ name, status, details }) => ({ name, status, details })),
  }, null, 2);

  const prompt = `As a supply chain risk analysis expert, analyze the following shipment data. Identify potential risks (e.g., customs issues, transit delays, documentation problems). Provide a risk level ('Low', 'Medium', or 'High') and a concise list of analysis points explaining your assessment. Respond in ${promptLanguage}.

Shipment Data:
${shipmentData}`;

  try {
     const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: {
              type: Type.STRING,
              description: "The assessed risk level, either 'Low', 'Medium', or 'High'.",
            },
            analysisPoints: {
              type: Type.ARRAY,
              description: "A list of strings explaining the risk factors.",
              items: {
                type: Type.STRING
              }
            }
          }
        }
      }
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (result && result.riskLevel && Array.isArray(result.analysisPoints)) {
      return result as RiskAnalysisResponse;
    }
    
    throw new Error('Invalid JSON response format from API.');

  } catch (error) {
    console.error("Error fetching risk analysis from Gemini API:", error);
    throw new Error('Failed to retrieve risk analysis from the AI service.');
  }
}

// FIX: Update function signature to accept languages from LanguageContext.
export async function summarizeChat(messages: Message[], language: 'en' | 'es-LA' | 'pt-BR'): Promise<string> {
    if (!API_KEY) {
        // FIX: Handle all possible languages for the fallback message.
        if (language === 'es-LA') return 'La función de resumen no está disponible sin una clave de API.';
        if (language === 'pt-BR') return 'O recurso de resumo não está disponível sem uma chave de API.';
        return 'Summary feature is unavailable without an API key.';
    }
    if (messages.length === 0) {
        if (language === 'es-LA') return 'No hay mensajes para resumir.';
        if (language === 'pt-BR') return 'Não há mensagens para resumir.';
        return 'No messages to summarize.';
    }

    const lang = language || 'en';
    // FIX: Use a map for prompt languages to support all defined types.
    const promptLanguageMap = { 'en': 'English', 'es-LA': 'Latin American Spanish', 'pt-BR': 'Brazilian Portuguese' };
    const promptLanguage = promptLanguageMap[lang];

    const formattedChat = messages
        .map(msg => `${msg.sender.name} (${msg.sender.role}): ${msg.text}`)
        .join('\n');

    const prompt = `Summarize the following supply chain conversation into a few key bullet points. Highlight any action items, important decisions, or unresolved issues. The summary should be concise and easy to understand. Respond in ${promptLanguage}.

Conversation:
${formattedChat}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text.trim();

    } catch (error) {
        console.error("Error fetching chat summary from Gemini API:", error);
        throw new Error('Failed to generate chat summary.');
    }
}

// FIX: Update function signature to accept languages from LanguageContext.
export async function getShipmentSummary(shipment: Shipment, language: 'en' | 'es-LA' | 'pt-BR'): Promise<ShipmentSummary> {
  if (!API_KEY) {
    return { summary: 'AI summary is unavailable without an API key.', highlights: ['Check API key configuration.'] };
  }

  const lang = language || 'en';
  // FIX: Use a map for prompt languages to support all defined types.
  const promptLanguageMap = { 'en': 'English', 'es-LA': 'Latin American Spanish', 'pt-BR': 'Brazilian Portuguese' };
  const promptLanguage = promptLanguageMap[lang];
  
  const shipmentContext = {
    id: shipment.id,
    status: shipment.status,
    origin: shipment.origin,
    destination: shipment.destination,
    estimatedDelivery: shipment.estimatedDeliveryDate,
    milestones: shipment.milestones.map(m => ({ name: m.name, status: m.status, details: m.details })),
    communications: shipment.communication.slice(-5).map(c => `${c.sender.name}: ${c.text}`) // last 5 messages
  };

  const prompt = `Analyze this shipment's data and provide a concise, natural language summary of its current situation. Also provide 2-3 key highlights or attention points. Be direct and clear. Respond in ${promptLanguage}.

Shipment Data:
${JSON.stringify(shipmentContext, null, 2)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A one or two-sentence summary of the shipment's status.",
            },
            highlights: {
              type: Type.ARRAY,
              description: "A short list of 2-3 important highlights or action items.",
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (result && result.summary && Array.isArray(result.highlights)) {
      return result as ShipmentSummary;
    }

    throw new Error('Invalid JSON response format from API for summary.');

  } catch (error) {
    console.error("Error fetching shipment summary from Gemini API:", error);
    throw new Error('Failed to generate shipment summary.');
  }
}
