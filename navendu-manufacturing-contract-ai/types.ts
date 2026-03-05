
export type IndustryTrack = "Automotive" | "Electronics" | "Aerospace" | "Pharma/Bio" | "FMCG" | "General Mfg";

export interface RenewalReminderConfig {
  isEnabled: boolean;
  leadTimeDays: 30 | 60 | 90;
  recipients: string[];
}

export type ContractType = 
  | "Master Supply Agreement" 
  | "Quality Assurance (QAA)" 
  | "3PL Logistics" 
  | "VMI Agreement" 
  | "Equipment Lease" 
  | "Raw Material Framework" 
  | "Distributor Agreement" 
  | "Software/SaaS" 
  | "Facility Lease"
  | "IP Licensing"
  | "Joint Development"
  | "NDA"
  | "Consulting Services";

export interface Contract {
  id: string;
  fileName: string;
  fileUrl: string;
  industryTrack: IndustryTrack;
  contractTitle: string;
  contractType: ContractType;
  parties: string[];
  supplierTier: "Tier 1" | "Tier 2" | "Tier 3" | "Indirect";
  criticality: "Strategic" | "Bottleneck" | "Leverage" | "Routine";
  agreementDate: string;
  effectiveDate: string;
  expirationDate: string;
  governingLaw: string;
  executiveSummary: string;
  riskAnalysis: string;
  riskScore: number;
  isConfidential: boolean;
  renewalTerms: string;
  terminationTerms: string;
  liabilityTerms: string;
  tags: string[];
  industrySpecific: { [key: string]: any };
  renewalReminder?: RenewalReminderConfig;
}
