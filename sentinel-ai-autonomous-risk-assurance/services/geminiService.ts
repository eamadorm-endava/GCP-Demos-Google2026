import { GoogleGenAI } from "@google/genai";
import { Risk, RiskSeverity, AgentCapability } from '../types';
import { getAgentSystemInstruction } from './prompts';

const getAiClient = () => {
  // TypeScript ahora reconocerá esto gracias al cambio en tsconfig.json
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("⚠️ API Key missing. Ensure VITE_GEMINI_API_KEY is set in .env or Dockerfile.");
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

// --- Mock Data Generator ---
export const generateInitialRisks = async (domain: string): Promise<Risk[]> => {
  try {
    const ai = getAiClient();
    const prompt = `
    Generate 3 high-fidelity organizational risks for a Modern Enterprise (${domain}).
    Output a strictly valid JSON array of objects. Do not wrap in markdown code blocks.
    Structure:
    [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "severity": "Low" | "Medium" | "High" | "Critical",
        "category": "string",
        "scoring": number (0-100),
        "controls": [
          {
            "id": "string",
            "name": "string",
            "description": "string",
            "type": "Preventative" | "Detective" | "Corrective",
            "agentCapability": "IAM_ASSURANCE" | "EVIDENCE_COLLECTION" | "ANOMALY_DETECTION" | "GENERIC_AUDIT",
            "frameworkMappings": ["string"]
          }
        ]
      }
    ]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    // CORRECCIÓN 1: TypeScript dice que .text es una propiedad getter, no una función.
    // Usamos 'response.text' sin paréntesis, o una cadena vacía si es null.
    const jsonText = response.text || '[]'; 
    
    return JSON.parse(jsonText) as Risk[];
  } catch (e) {
    console.error("Failed to generate risks, using fallback.", e);
    // Fallback Data
    return [
      {
        id: 'r-1',
        title: 'Toxic Access Combinations (SoD)',
        description: 'Risk of users holding conflicting permissions (e.g., create vendor + pay vendor) leading to fraud.',
        severity: RiskSeverity.CRITICAL,
        category: 'Identity & Access',
        scoring: 95,
        controls: [
          { 
            id: 'c-1', 
            name: 'Continuous SoD Analysis', 
            description: 'Automated verification of conflicting roles across ERP and Identity Provider.', 
            type: 'Detective',
            agentCapability: 'IAM_ASSURANCE',
            frameworkMappings: ['COSO Principle 11', 'SOX ITGC: Logical Access', 'ISO 27001: A.9.2']
          }
        ]
      },
      {
        id: 'r-2',
        title: 'Incomplete Audit Trails (SOX)',
        description: 'Risk that required evidence for change management is not retained, leading to regulatory findings.',
        severity: RiskSeverity.HIGH,
        category: 'Compliance',
        scoring: 88,
        controls: [
          { 
            id: 'c-2', 
            name: 'Automated Evidence Repository', 
            description: 'Systematic collection and hashing of approval logs for all production deployments.', 
            type: 'Preventative',
            agentCapability: 'EVIDENCE_COLLECTION',
            frameworkMappings: ['SOX Sec 404', 'ISO 27001: A.12.4', 'COSO Principle 10']
          }
        ]
      },
      {
        id: 'r-3',
        title: 'Procurement Fraud Patterns',
        description: 'Risk of anomalous payments to shell vendors or duplicate invoices bypassing standard checks.',
        severity: RiskSeverity.CRITICAL,
        category: 'Financial Crime',
        scoring: 92,
        controls: [
          { 
            id: 'c-3', 
            name: 'AI Transaction Forensics', 
            description: 'Real-time statistical anomaly detection on outgoing wire transfers and vendor master updates.', 
            type: 'Detective',
            agentCapability: 'ANOMALY_DETECTION',
            frameworkMappings: ['COSO Principle 8', 'SOX Sec 302', 'ISO 27001: A.16.1']
          }
        ]
      }
    ];
  }
};

// --- Streaming Agent Simulation ---
export async function* streamAuditSimulation(risk: Risk, controlName: string, agentCapability: AgentCapability) {
  let useFallback = false;
  // Usamos 'any' temporalmente aquí porque el tipo AsyncGenerator inferido es complejo
  let resultStream: any;

  try {
    const ai = getAiClient();
    const systemInstruction = getAgentSystemInstruction(risk, controlName, agentCapability);

    // En la versión @google/genai ^1.x, generateContentStream devuelve un objeto iterable directamente
    // o un wrapper dependiendo de la sub-versión.
    const result = await ai.models.generateContentStream({
      model: 'gemini-1.5-pro',
      contents: `Initialize Agent: ${agentCapability}. Target Control: ${controlName}. Begin autonomous verification sequence.`,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    
    // CORRECCIÓN 2: TypeScript dice que 'result' ya es el AsyncGenerator.
    // No existe la propiedad .stream en este objeto result según el error TS2339.
    resultStream = result; 

  } catch (e) {
    console.warn("Gemini API unavailable or key invalid, using simulation fallback.", e);
    useFallback = true;
  }

  if (!useFallback && resultStream) {
    try {
      // Iteramos directamente sobre el resultado
      for await (const chunk of resultStream) {
        // CORRECCIÓN 3: Igual que arriba, tratamos .text como propiedad si es necesario
        // @ts-ignore: Manejo defensivo por diferencias de versión
        const text = typeof chunk.text === 'function' ? chunk.text() : chunk.text;
        
        if (text) {
            yield text;
        }
      }
    } catch (e) {
      console.warn("Stream interrupted, switching to fallback.", e);
      useFallback = true;
    }
  }

  if (useFallback) {
     const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
     
     const mockLogs = [
       JSON.stringify({ type: "log", action: "INIT_CONNECTION", detail: `Establishing secure mTLS connection to ${agentCapability === 'CIAM_ATTESTATION' ? 'GitHub Enterprise & SonarQube' : 'Enterprise Data Lake'}...`, status: "info" }),
       JSON.stringify({ type: "log", action: "CONTEXT_LOAD", detail: "Retrieving architecture maps and security policies from VectorDB...", status: "info" }),
       JSON.stringify({ type: "log", action: "DISCOVERY_SCAN", detail: `Scanning target scope for control: ${controlName}. Found 14 active endpoints.`, status: "success" }),
       JSON.stringify({ type: "log", action: "AST_ANALYSIS", detail: "Parsing Abstract Syntax Tree (AST) to identify authentication gates in legacy code modules...", status: "info" }),
       JSON.stringify({ type: "log", action: "TRACE_EXECUTION", detail: "Stitched execution path: Mobile_App -> API_Gateway -> Auth_Service -> Core_Banking.", status: "success" }),
       JSON.stringify({ type: "log", action: "VULNERABILITY_CHECK", detail: "Analyzing 'StepUpAuth' logic in TransactionController.java against policy threshold ($10,000).", status: "warning" }),
       JSON.stringify({ type: "log", action: "REPORT_GEN", detail: "Compiling deficiency report and generating sequence diagram...", status: "success" }),
       JSON.stringify({ 
         type: "result", 
         data: { 
           score: 45, 
           effective: false, 
           summary: "The agent detected a logic flaw where step-up authentication is bypassed.", 
           gaps: ["MFA Bypass on Internal Subnets"], 
           recommendations: ["Enforce adaptive MFA globally"], 
           scenario: "CIAM_LOGIC_GAP" 
         } 
       })
     ];

     for (const log of mockLogs) {
       await delay(500);
       yield log + "\n";
     }
  }
}