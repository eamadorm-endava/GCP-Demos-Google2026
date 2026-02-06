export interface AnalyzedContract {
  id: string;
  title: string;
  type: string;
  parties: string[];
  effectiveDate: string | null;
  expirationDate: string | null;
  riskScore: number; // 1-10
  riskLevel: 'Low' | 'Medium' | 'High';
  summary: string;
  missingClauses: string[];
  flaggedTerms: string[];
  governingLaw: string;
  status: 'Active' | 'Review Required' | 'Expired';
}

export interface RiskMetric {
  category: string;
  avgRisk: number;
}

export interface JurisdictionMetric {
  name: string;
  value: number;
  color: string;
}
