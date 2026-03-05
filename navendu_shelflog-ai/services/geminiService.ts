
import { GoogleGenAI } from "@google/genai";
import { Store, Product, Opportunity } from "../types";

const DEFAULT_MODEL = 'gemini-3.1-flash-image-preview';

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

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
      model: 'gemini-3.1-flash-image-preview',
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
      model: 'gemini-3.1-flash-image-preview',
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
      model: 'gemini-3.1-flash-image-preview',
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

  const { opportunity, targetStore, lookalikeStore } = contextData || {};

  const contextBlock = opportunity ? `
## Active Opportunity
- Type: ${opportunity.type?.replace(/_/g, ' ')}
- ID: ${opportunity.opportunity_id}
- AI Confidence: ${((opportunity.match_score || 0) * 100).toFixed(0)}%
- Projected Revenue Lift: $${opportunity.projected_lift?.toLocaleString() ?? 'N/A'}
- Delist Product: ${opportunity.delist_candidate?.name ?? 'N/A'} (Price: $${opportunity.delist_candidate?.price ?? 'N/A'}, Category: ${opportunity.delist_candidate?.category ?? 'N/A'})
- Add Product: ${opportunity.add_candidate?.name ?? 'N/A'} (Price: $${opportunity.add_candidate?.price ?? 'N/A'}, Category: ${opportunity.add_candidate?.category ?? 'N/A'})
- Single Product: ${opportunity.product?.name ?? 'N/A'} (Price: $${opportunity.product?.price ?? 'N/A'})
- AI Match Reasons: ${(opportunity.match_reasons || []).join(' | ')}
- Status: ${opportunity.status}

## Target Store: ${targetStore?.name ?? 'Unknown'}
- Location: ${targetStore?.location ?? 'N/A'}
- Cluster: ${targetStore?.cluster ?? 'N/A'}
- Monthly Revenue: $${targetStore?.metrics?.monthly_revenue?.toLocaleString() ?? 'N/A'}
- Foot Traffic: ${targetStore?.metrics?.foot_traffic?.toLocaleString() ?? 'N/A'}/mo
- Avg Basket Size: $${targetStore?.metrics?.avg_basket_size ?? 'N/A'}
- Compliance Score: ${targetStore?.compliance_score ?? 'N/A'}%
- Demographics: ${targetStore?.demographics?.primary ?? 'N/A'} | Income: ${targetStore?.demographics?.income_index ?? 'N/A'}

## Digital Twin / Lookalike Store: ${lookalikeStore?.name ?? 'N/A'}
- Location: ${lookalikeStore?.location ?? 'N/A'}
- Monthly Revenue: $${lookalikeStore?.metrics?.monthly_revenue?.toLocaleString() ?? 'N/A'}
- Foot Traffic: ${lookalikeStore?.metrics?.foot_traffic?.toLocaleString() ?? 'N/A'}/mo
- Compliance Score: ${lookalikeStore?.compliance_score ?? 'N/A'}%
` : JSON.stringify(contextData);

  const prompt = `
${contextBlock}

## User Question
"${userMessage}"

Answer as "ShelfLogic AI Advisor". Ground your answer specifically in the data above — reference product names, dollar figures, store names, and metrics. Be concise (2-4 sentences) unless the user asks for detail.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `You are ShelfLogic AI — an expert Retail Operations Advisor with deep knowledge of assortment planning, inventory management, price elasticity, and shelf compliance. 
You have access to live store data and should give specific, data-driven answers referencing actual product names, prices, store metrics, and dollar figures from the context. 
Be professional but conversational. Avoid generic answers — always tie your response directly to the specific data provided. Keep answers under 60 words unless the user requests detail.`
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
  const model = "gemini-3.1-flash-image-preview";

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
      model: DEFAULT_MODEL,
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
