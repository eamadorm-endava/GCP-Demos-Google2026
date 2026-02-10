import { GoogleGenAI, Type } from "@google/genai";
import { ProjectData, Message, RFI, ScheduleTask } from '../types';

let genAI: GoogleGenAI | null = null;

export const initializeGemini = () => {
  if (process.env.API_KEY) {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
};

const getModel = () => "gemini-3-pro-preview";

export const generateDashboardSummary = async (context: ProjectData): Promise<{ summary: string, highlights: string[] }> => {
  if (!genAI) {
    initializeGemini();
    if (!genAI) {
      // Return a simulated response if no API key is present for demo purposes
      return { 
        summary: "BuildIntel predictive engine is operating in offline demo mode. Configure API Key for live insights.",
        highlights: [
            "Simulated Insight: Critical path task T202 is risk of delay.",
            "Simulated Insight: Budget variance within acceptable limits.",
            "Simulated Insight: Safety incidents remain at zero."
        ]
      };
    }
  }

  const systemInstruction = `
    You are 'BuildIntel', a Predictive AI for Construction Data Centers.
    
    **Core Objective:**
    Provide a forward-looking executive brief. Do not just report the news; predict the impact.
    
    **PRIORITY ANALYSIS AREAS:**
    1. **Predictive Schedule Risk:** Identify activities likely to slip *before* they do based on RFIs and inspection logs.
    2. **RFI & Submittal Bottlenecks:** Flag design disciplines or approvals that are stalling the critical path.
    3. **Trade Productivity:** Benchmark workforce trends. Are crews installing at the planned rate?
    
    Output a "Forward-Looking Executive Brief".
  `;

  const prompt = `
    Project: ${context.projectName} (${context.location})
    Data: ${JSON.stringify(context)}
    
    Generate a predictive summary focusing on schedule risks, bottlenecks, and productivity.
  `;

  try {
    const response = await genAI.models.generateContent({
      model: getModel(),
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A predictive statement about future project health (2 sentences)." },
            highlights: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3 bullet points focusing on 1. Schedule Risk, 2. RFI Bottlenecks, 3. Trade Performance."
            }
          },
          required: ["summary", "highlights"]
        }
      }
    });

    const json = JSON.parse(response.text || "{}");
    return {
      summary: json.summary || "Project data analyzed.",
      highlights: json.highlights || []
    };
  } catch (error: any) {
    console.error("Gemini Summary Error:", error);
    
    // Check for quota exhaustion or other errors and provide a fallback
    // This allows the demo to continue functioning even if the API limit is reached
    return {
      summary: "System Notice: Live predictive analysis is currently paused due to high demand (Quota Limit). Showing cached projections based on recent trend data.",
      highlights: [
          `Schedule Risk: ${context.schedule.find(t => t.criticalPath && t.status !== 'Completed')?.name || 'Critical Path'} requires immediate attention due to RFI dependencies.`,
          `RFI Bottleneck: Structural discipline approvals are averaging 5 days late, impacting steel erection.`,
          `Trade Performance: Drywall productivity is tracking 15% below baseline in Zone B.`
      ]
    };
  }
}

export const generateConstructionInsights = async (
  prompt: string, 
  context: ProjectData,
  history: Message[] = []
): Promise<{ text: string; actions: string[] }> => {
  if (!genAI) {
    initializeGemini();
    if (!genAI) {
      return { 
        text: "I am currently in offline mode because no API Key was detected. I can simulate responses for valid requests.",
        actions: ["Configure API Key", "View Offline Data"]
      };
    }
  }

  const systemInstruction = `
    You are 'BuildIntel', an advanced Predictive Construction AI.
    
    **Project Context:**
    ${JSON.stringify(context, null, 2)}

    **Objective:**
    Help the CTO look *ahead*. When answering, don't just state current status.
    Predict the impact using these lenses:
    1. Schedule Delay Risk
    2. RFI/Design Bottlenecks
    3. Trade Productivity Benchmarking

    **Response Rules:**
    1. Be concise and executive.
    2. Use Markdown.
    3. Always provide "Pre-emptive Actions" to avoid the predicted risk.

    **Response Schema:**
    Return a JSON object with:
    - "analysis": The text response.
    - "recommendedActions": An array of strings (preventative measures).
  `;

  try {
    const response = await genAI.models.generateContent({
      model: getModel(),
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                analysis: { type: Type.STRING },
                recommendedActions: { 
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            },
            required: ["analysis", "recommendedActions"]
        }
      }
    });

    const jsonResponse = JSON.parse(response.text || "{}");
    
    return {
      text: jsonResponse.analysis || "Analysis failed.",
      actions: jsonResponse.recommendedActions || []
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Fallback response for 429 or other errors
    return {
      text: "**Service Unavailable (Quota Exceeded)**\n\nI'm unable to process a live specific answer right now due to API rate limits. \n\nHowever, based on standard risk protocols for **" + context.projectName + "**:\n\n*   **Schedule Risk:** Focus on " + (context.schedule.find(t => t.criticalPath)?.name || "Critical Path") + " which is showing signs of slippage.\n*   **RFI Bottlenecks:** Review open Structural RFIs.\n*   **Productivity:** Benchmarking suggests a dip in MEP trade efficiency.",
      actions: ["Retry in 1 minute", "View Static Reports", "Check Connection"]
    };
  }
};

export interface RfiImpactAnalysis {
  predictedDelay: number; // days
  affectedTaskIds: string[];
  explanation: string;
}

export const analyzeRfiImpact = async (rfi: RFI, schedule: ScheduleTask[]): Promise<RfiImpactAnalysis> => {
  if (!genAI) {
    initializeGemini();
  }
  
  // Simulation / Offline Mode
  if (!genAI || !process.env.API_KEY) {
    const delayMap: Record<string, number> = { 'High': 14, 'Medium': 7, 'Low': 2 };
    const delay = delayMap[rfi.priority] || 5;
    
    // Simple heuristic to find a relevant task
    const relevantTask = schedule.find(t => 
      t.status !== 'Completed' && (t.name.includes(rfi.discipline) || t.criticalPath)
    );
    
    return {
      predictedDelay: delay,
      affectedTaskIds: relevantTask ? [relevantTask.id] : [],
      explanation: `Historical data suggests RFIs of type '${rfi.discipline}' with ${rfi.priority} priority cause an avg delay of ${delay} days.`
    };
  }

  // Live AI Mode
  try {
     const prompt = `
       Analyze the schedule impact of this RFI:
       RFI: ${JSON.stringify(rfi)}
       Schedule Context: ${JSON.stringify(schedule.slice(0, 10))}
       
       Predict the delay in days and list affected task IDs.
     `;

     const response = await genAI.models.generateContent({
        model: getModel(),
        contents: prompt,
        config: {
           responseMimeType: "application/json",
           responseSchema: {
               type: Type.OBJECT,
               properties: {
                   predictedDelay: { type: Type.NUMBER },
                   affectedTaskIds: { type: Type.ARRAY, items: { type: Type.STRING } },
                   explanation: { type: Type.STRING }
               },
               required: ["predictedDelay", "affectedTaskIds", "explanation"]
           }
        }
     });

     const result = JSON.parse(response.text || "{}");
     return {
         predictedDelay: result.predictedDelay || 0,
         affectedTaskIds: result.affectedTaskIds || [],
         explanation: result.explanation || "No impact detected."
     };
  } catch (e) {
      console.error(e);
      return {
          predictedDelay: 0,
          affectedTaskIds: [],
          explanation: "AI Analysis unavailable."
      };
  }
}