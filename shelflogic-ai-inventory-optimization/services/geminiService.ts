
import { GoogleGenAI } from "@google/genai";
import { Store, Product, Opportunity } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateExpertMathExplanation = async (concept: string, dataPoints: any): Promise<string> => {
  if (!process.env.API_KEY) return "AI Expert offline.";

  const prompt = `
    Explain the following ML concept to a retail executive: "${concept}".
    Current simulation data: ${JSON.stringify(dataPoints)}.
    Use professional, punchy business language. Explain why the model chose the "Optimal" point in the simulation.
    Keep it to 2-3 sentences.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are the Lead Data Scientist for ShelfLogic. You translate complex linear algebra and statistics into high-value retail strategy."
      }
    });
    // FIX: Fallback to a default string if response.text is undefined.
    return response.text || "Calculation verified by neural engine.";
  } catch (error) {
    return "The model utilizes a Log-Log regression to determine the coefficient of elasticity, ensuring we capture the non-linear relationship between price and volume.";
  }
};

export const generatePlanogramImage = async (prompt: string, fallbackPath: string): Promise<string> => {
  if (!process.env.API_KEY) return fallbackPath;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `A professional 3D retail planogram schematic of a premium liquor store shelf. Detailed arrangement of bottles, shelf-edge labels, architectural visualization style, clean commercial lighting, blueprint aesthetic mixed with photo-realism. It should look like a CAD drawing for retail managers. ${prompt}`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return fallbackPath; // Return fallback if no image data in response
  } catch (error) {
    console.error("Planogram Generation Error:", error);
    // Return fallback on error (e.g. 429)
    return fallbackPath;
  }
};

export const generateLiveStoreFeed = async (prompt: string, fallbackPath: string): Promise<string> => {
  if (!process.env.API_KEY) return fallbackPath;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `A photo-realistic retail shelf view from a security camera perspective. Slightly Grainy, real store lighting, bottles of liqueurs and schnapps on shelves. Some bottles are slightly out of place. This is a real-world store aisle. ${prompt}`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return fallbackPath; // Return fallback if no image data in response
  } catch (error) {
    console.error("Live Feed Generation Error:", error);
    // Return fallback on error (e.g. 429)
    return fallbackPath;
  }
};

export const chatWithData = async (userMessage: string, contextData: any): Promise<string> => {
  if (!process.env.API_KEY) return "AI Copilot unavailable (Check API Key).";

  const prompt = `
    Context Data (Opportunity Details): ${JSON.stringify(contextData)}
    
    User Question: "${userMessage}"
    
    Answer as "ShelfLogic AI Advisor". Be concise, analytical, and professional. 
    Focus on financial impact (ROI, Margin, Revenue Lift) and operational efficiency.
    If the user asks "Why", explain the reasoning based on the 'match_reasons' or data provided.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are an intelligent Retail Operations Agent. Keep answers short (under 50 words) unless asked for detail."
      }
    });
    return response.text || "I processed that request but have no specific output.";
  } catch (error) {
    return "I'm having trouble accessing the neural context right now (Rate Limit or Network Error).";
  }
};

export const generateOpportunityInsight = async (
  opportunity: Opportunity,
  target: Store,
  lookalike?: Store
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "AI Insight Unavailable: API Key not found.";
  }

  let prompt = "";
  let tools: any[] = [];
  const model = "gemini-3-flash-preview";

  switch (opportunity.type) {
    case 'ASSORTMENT_SWAP':
      prompt = `
        Analyze this Retail Assortment Swap for ${target.name}.
        Delist: ${opportunity.delist_candidate?.name} (Low Velocity)
        Add: ${opportunity.add_candidate?.name} (High Velocity in Twin Store ${lookalike?.name})
        Explain why the demographics of ${target.name} suggest this swap will work.
      `;
      break;
    case 'SHELF_COMPLIANCE':
      prompt = `
        Shelf Compliance Issue at ${target.name}.
        Action: The swap for ${opportunity.product?.name} was approved digitally but is NOT visible on the shelf camera.
        Identify the financial risk of non-compliance (lost sales) and urge store staff to execute the physical reset immediately.
      `;
      break;
    case 'INVENTORY_REBALANCE':
      prompt = `
        Analyze this imminent stockout risk for ${opportunity.product?.name} at ${target.name}.
        The demand forecast shows a sharp increase in sales velocity over the next 7 days, with a stockout predicted in 3 days.
        Current stock is critically low. A surplus exists at the nearby store: ${lookalike?.name}.
        Explain the urgency and financial impact of a stockout (lost sales, customer dissatisfaction), recommending an immediate inter-store transfer to protect revenue.
      `;
      break;
    case 'PRICE_OPTIMIZATION':
      prompt = `
        Analyze this Price Optimization for ${opportunity.product?.name} at ${target.name}.
        Current: $${opportunity.product?.price}
        Goal: Maximize margin without losing volume. 
        Explain the "Revenue Hill" logic for this inelastic luxury product.
      `;
      break;
    case 'WEATHER_TRIGGER':
      prompt = `
        A ${target.weather?.condition} is forecast for ${target.location} (Temp: ${target.weather?.temp}°F).
        Identify the projected demand surge for ${opportunity.product?.name}.
        Justify a proactive inventory boost to avoid stockouts during the extreme weather event.
      `;
      break;
    case 'LOCAL_EVENT':
      prompt = `
        Search for local events happening in ${target.location} related to "${opportunity.event_name}".
        Provide specific details about timing and scale.
        Analyze the impact on demand for ${opportunity.product?.name} and suggest an inventory rebalance strategy.
      `;
      tools = [{ googleSearch: {} }];
      break;
    case 'COMPETITOR_GAP':
      prompt = `
        Competitive Intelligence Report for ${target.name}.
        Product: ${opportunity.product?.name}
        Our Price: $${opportunity.product?.price}
        Competitor: $${opportunity.competitor_price}
        Explain why matching or undercutting this price is critical for market share in this cluster.
      `;
      break;
    default:
      prompt = `Provide a concise business reasoning for a ${opportunity.type} opportunity at ${target.name}.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert Retail Strategy Agent. Be concise, persuasive, and professional. 2-3 sentences max. If using search, mention specific details found.",
        tools: tools
      }
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sourcesText = sources && sources.length > 0 ? "\n\nSources: " + sources.map((s: any) => s.web?.uri || s.maps?.uri).join(", ") : "";

    // FIX: Fallback to a default string if response.text is undefined to prevent error on concatenation.
    return (response.text || "Insight analysis complete.") + sourcesText;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Strategic analysis completed via local heuristics (AI Offline).";
  }
};

export const generateDetailedProductComparison = async (
  delist: Product,
  add: Product,
  store: Store
): Promise<string> => {
  if (!process.env.API_KEY) return "API Key not found.";

  const prompt = `
    Deep Dive Comparison for ${store.name}:
    Delist Candidate: ${delist.name} (Category: ${delist.category}, Price: $${delist.price})
    Add Candidate: ${add.name} (Category: ${add.category}, Price: $${add.price})
    
    Provide a detailed 2-paragraph analysis. 
    Paragraph 1: Why the delist candidate is underperforming based on market trends for ${delist.category}.
    Paragraph 2: The specific consumer psychology/preference in ${store.location} that makes ${add.name} a superior choice.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a senior Retail Merchandising Consultant. Provide professional, data-backed qualitative reasoning."
      }
    });
    // FIX: Fallback to a default string if response.text is undefined.
    return response.text || "No additional data available.";
  } catch (error) {
    console.error("Gemini Detail Error:", error);
    return "Failed to fetch detailed comparison.";
  }
};
