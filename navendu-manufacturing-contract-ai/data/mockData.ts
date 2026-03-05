
import { Contract } from '../types';

export const mockContracts: Contract[] = [
  {
    id: "sup-semicon-001",
    fileName: "global_chip_supply_msa.pdf",
    fileUrl: "/docs/global_chip_supply_msa.pdf",
    industryTrack: "Electronics",
    contractTitle: "Strategic Semiconductor Supply MSA",
    contractType: "Master Supply Agreement",
    parties: ["Nexus Mfg", "Taiwan Wafer Co."],
    supplierTier: "Tier 1",
    criticality: "Strategic",
    agreementDate: "2023-01-15",
    effectiveDate: "2023-02-01",
    expirationDate: "2026-01-31",
    governingLaw: "Singapore",
    executiveSummary: "Strategic agreement for the supply of MCU and FPGA units. Includes capacity reservation clauses and quarterly pricing adjustments based on silicon index.",
    riskAnalysis: "High Risk. Single-source dependency for critical MCUs. Geopolitical tension in region poses Force Majeure risk. 'Take-or-pay' clause commits 80% volume.",
    riskScore: 8,
    isConfidential: true,
    renewalTerms: "Auto-renews for 1 year unless 6 months notice given.",
    terminationTerms: "12-month winding down period required for termination without cause.",
    liabilityTerms: "Capped at 2x annual spend. Excludes consequential damages.",
    tags: ["Single Source", "Chip Shortage", "High Spend"],
    industrySpecific: {
      leadTime: "26 Weeks",
      moq: "50,000 units",
      qualityStandard: "ISO 26262 (Auto)"
    },
    renewalReminder: {
      isEnabled: true,
      leadTimeDays: 90,
      recipients: ["legal@nexusmfg.com", "procurement@nexusmfg.com"]
    }
  },
  {
    id: "log-3pl-002",
    fileName: "pan_euro_logistics.pdf",
    fileUrl: "/docs/pan_euro_logistics.pdf",
    industryTrack: "Automotive",
    contractTitle: "Pan-European 3PL Framework",
    contractType: "3PL Logistics",
    parties: ["Nexus Auto Group", "FastFreight Logistics"],
    supplierTier: "Tier 2",
    criticality: "Leverage",
    agreementDate: "2022-05-20",
    effectiveDate: "2022-06-01",
    expirationDate: "2025-05-31",
    governingLaw: "Germany",
    executiveSummary: "Framework for warehousing and distribution across EU. Covers fuel surcharges, KPI penalties for late deliveries, and customs brokerage.",
    riskAnalysis: "Medium Risk. Fuel surcharge mechanism is uncapped, creating cost volatility. KPI penalty clauses are weak (only 1% rebate for <95% OTIF).",
    riskScore: 5,
    isConfidential: false,
    renewalTerms: "Mutual agreement required 90 days prior.",
    terminationTerms: "60 days notice. Immediate termination for loss of AEO certification.",
    liabilityTerms: "Standard limited liability per CMR Convention.",
    tags: ["Logistics", "EU Distribution"],
    industrySpecific: {
      onTimeInFull_Target: "98.5%",
      fuelSurcharge: "Floating (Monthly Index)",
      warehousingLocations: ["Hamburg", "Lyon", "Milan"]
    },
    renewalReminder: {
      isEnabled: false,
      leadTimeDays: 60,
      recipients: []
    }
  },
  {
    id: "mat-steel-003",
    fileName: "raw_steel_framework.pdf",
    fileUrl: "/docs/raw_steel_framework.pdf",
    industryTrack: "General Mfg",
    contractTitle: "Raw Steel & Aluminum Framework",
    contractType: "Raw Material Framework",
    parties: ["Nexus Heavy Ind", "Global Metals Corp"],
    supplierTier: "Tier 1",
    criticality: "Bottleneck",
    agreementDate: "2021-11-10",
    effectiveDate: "2021-11-10",
    expirationDate: "2024-11-09", // Expiring soon
    governingLaw: "New York",
    executiveSummary: "Supply of rolled steel and aluminum sheets. Pricing pegged to LME (London Metal Exchange) with a fixed markup.",
    riskAnalysis: "High Risk. Approaching expiration with volatile market pricing. No guaranteed allocation in case of global shortage.",
    riskScore: 7,
    isConfidential: true,
    renewalTerms: "Evergreen unless terminated.",
    terminationTerms: "90 days written notice.",
    liabilityTerms: "Replacement of defective material only.",
    tags: ["Commodity", "Expiring Soon"],
    industrySpecific: {
      pricingIndex: "LME + 8%",
      origin: "Brazil / USA",
      incoterms: "DDP Factory"
    },
    renewalReminder: {
      isEnabled: true,
      leadTimeDays: 30,
      recipients: ["sourcing.director@nexusmfg.com"]
    }
  },
  {
    id: "qaa-pharma-004",
    fileName: "api_quality_agreement.pdf",
    fileUrl: "/docs/api_quality_agreement.pdf",
    industryTrack: "Pharma/Bio",
    contractTitle: "Quality Assurance Agreement (API)",
    contractType: "Quality Assurance (QAA)",
    parties: ["Nexus BioLabs", "ChemSynth Solutions"],
    supplierTier: "Tier 1",
    criticality: "Strategic",
    agreementDate: "2023-03-01",
    effectiveDate: "2023-03-15",
    expirationDate: "2028-03-14",
    governingLaw: "Switzerland",
    executiveSummary: "Strict quality technical agreement for Active Pharmaceutical Ingredients. Defines change control, audit rights, and deviation reporting timelines.",
    riskAnalysis: "Low Risk. Very robust compliance framework. Audit rights are comprehensive (unannounced audits allowed).",
    riskScore: 2,
    isConfidential: true,
    renewalTerms: "Linked to Supply Agreement duration.",
    terminationTerms: "Survivability of quality obligations for 5 years post-termination.",
    liabilityTerms: "Uncapped for regulatory fines caused by supplier negligence.",
    tags: ["GMP", "Compliance", "Audit Ready"],
    industrySpecific: {
      changeControlNotification: "6 months prior",
      auditFrequency: "Annual",
      regulatoryStandard: "EU GMP / FDA 21 CFR"
    },
    renewalReminder: {
      isEnabled: false,
      leadTimeDays: 90,
      recipients: []
    }
  },
  {
    id: "vmi-fmcg-005",
    fileName: "packaging_vmi_agreement.pdf",
    fileUrl: "/docs/packaging_vmi_agreement.pdf",
    industryTrack: "FMCG",
    contractTitle: "Vendor Managed Inventory (Packaging)",
    contractType: "VMI Agreement",
    parties: ["Nexus Consumer", "PackRight Inc."],
    supplierTier: "Tier 2",
    criticality: "Routine",
    agreementDate: "2022-08-10",
    effectiveDate: "2022-09-01",
    expirationDate: "2025-08-31",
    governingLaw: "California",
    executiveSummary: "VMI setup for cardboard and plastic packaging. Supplier monitors stock levels at Nexus facility and replenishes automatically.",
    riskAnalysis: "Medium Risk. Reliance on supplier's forecasting system. Penalty clauses for stock-outs are present but low impact.",
    riskScore: 4,
    isConfidential: false,
    renewalTerms: "Auto-renew 1 year.",
    terminationTerms: "30 days notice.",
    liabilityTerms: "Limited to value of inventory on hand.",
    tags: ["Inventory Optimization", "Lean"],
    industrySpecific: {
      minMaxLevels: "Min 2 weeks / Max 6 weeks",
      consignment: "Yes (Pay on consumption)",
      stockoutPenalty: "5% of invoice value"
    },
    renewalReminder: {
      isEnabled: false,
      leadTimeDays: 60,
      recipients: []
    }
  },
  {
    id: "equip-aero-006",
    fileName: "cnc_machine_lease.pdf",
    fileUrl: "/docs/cnc_machine_lease.pdf",
    industryTrack: "Aerospace",
    contractTitle: "5-Axis CNC Equipment Lease",
    contractType: "Equipment Lease",
    parties: ["Nexus Aero", "Precision Tooling GmbH"],
    supplierTier: "Indirect",
    criticality: "Bottleneck",
    agreementDate: "2023-06-01",
    effectiveDate: "2023-06-15",
    expirationDate: "2026-06-14",
    governingLaw: "Germany",
    executiveSummary: "Lease of 10 high-precision CNC machines for turbine blade manufacturing. Includes maintenance SLA.",
    riskAnalysis: "Low Risk. Standard lease. Maintenance SLA ensures 98% uptime or rent abatement.",
    riskScore: 3,
    isConfidential: true,
    renewalTerms: "FMV Purchase Option",
    terminationTerms: "Cannot terminate early without full payout.",
    liabilityTerms: "Lessee insures equipment.",
    tags: ["Capex", "Maintenance"],
    industrySpecific: {
      uptimeGuarantee: "98%",
      preventativeMaintenance: "Monthly included",
      responseTime: "4 hours"
    },
    renewalReminder: {
      isEnabled: true,
      leadTimeDays: 90,
      recipients: ["facilities@nexusaero.com"]
    }
  },
  {
    id: "jda-auto-007",
    fileName: "ev_battery_jda.pdf",
    fileUrl: "/docs/ev_battery_jda.pdf",
    industryTrack: "Automotive",
    contractTitle: "Joint Development Agreement (Solid State Battery)",
    contractType: "Joint Development",
    parties: ["Nexus Auto", "Voltaic Cells Ltd"],
    supplierTier: "Tier 1",
    criticality: "Strategic",
    agreementDate: "2023-10-01",
    effectiveDate: "2023-10-01",
    expirationDate: "2028-10-01",
    governingLaw: "Delaware",
    executiveSummary: "Co-development of solid-state battery technology. Includes shared IP rights and exclusive manufacturing rights for Nexus Auto for 5 years.",
    riskAnalysis: "High Risk. Complexity in IP ownership allocation. High R&D spend commitment ($50M). Exit clauses are complex if milestones aren't met.",
    riskScore: 9,
    isConfidential: true,
    renewalTerms: "Negotiable upon completion of Phase 2.",
    terminationTerms: "Material breach or failure to meet technical milestones.",
    liabilityTerms: "Mutual indemnity for IP infringement.",
    tags: ["R&D", "Innovation", "IP Rights"],
    industrySpecific: {
      milestone1: "Prototype by Q4 2024",
      costSharing: "50/50",
      exclusivity: "5 Years post-launch"
    },
    renewalReminder: {
      isEnabled: true,
      leadTimeDays: 90,
      recipients: ["cto@nexusauto.com", "legal.ip@nexusauto.com"]
    }
  },
  {
    id: "ip-license-008",
    fileName: "patent_license_coating.pdf",
    fileUrl: "/docs/patent_license_coating.pdf",
    industryTrack: "General Mfg",
    contractTitle: "Nano-Coating IP License",
    contractType: "IP Licensing",
    parties: ["Nexus Mfg", "NanoTech Research"],
    supplierTier: "Tier 3",
    criticality: "Leverage",
    agreementDate: "2022-01-01",
    effectiveDate: "2022-01-01",
    expirationDate: "2027-01-01",
    governingLaw: "UK",
    executiveSummary: "License to use patented anti-corrosion coating process on Nexus products. Royalty based on unit volume.",
    riskAnalysis: "Medium Risk. Royalty audits permitted. Risk of patent invalidation affecting the value of the license.",
    riskScore: 4,
    isConfidential: true,
    renewalTerms: "Auto-renew for 2 years.",
    terminationTerms: "Breach of royalty payment terms.",
    liabilityTerms: "Licensor indemnifies against third-party patent claims.",
    tags: ["Royalty", "Technology"],
    industrySpecific: {
      royaltyRate: "2% per unit",
      territory: "Global",
      auditRights: "Annual"
    },
    renewalReminder: {
      isEnabled: false,
      leadTimeDays: 60,
      recipients: []
    }
  },
  {
    id: "nda-proto-009",
    fileName: "project_titan_nda.pdf",
    fileUrl: "/docs/project_titan_nda.pdf",
    industryTrack: "Aerospace",
    contractTitle: "Project Titan Mutual NDA",
    contractType: "NDA",
    parties: ["Nexus Aero", "Horizon Dynamics"],
    supplierTier: "Indirect",
    criticality: "Routine",
    agreementDate: "2024-01-15",
    effectiveDate: "2024-01-15",
    expirationDate: "2026-01-15",
    governingLaw: "New York",
    executiveSummary: "Mutual non-disclosure for exploring potential partnership on drone propulsion systems.",
    riskAnalysis: "Low Risk. Standard terms. Definition of 'Confidential Information' is standard.",
    riskScore: 1,
    isConfidential: true,
    renewalTerms: "None.",
    terminationTerms: "30 days notice.",
    liabilityTerms: "Equitable relief enabled.",
    tags: ["Confidentiality", "Partnership"],
    industrySpecific: {
      survivalPeriod: "3 Years",
      purpose: "Business Exploration",
      permittedDisclosures: "Representatives only"
    },
    renewalReminder: {
      isEnabled: false,
      leadTimeDays: 30,
      recipients: []
    }
  }
];
