import { ProjectData } from '../types';

const PROJECT_A: ProjectData = {
  id: "1",
  projectId: "DC-ASH-001",
  projectName: "Titan Hyperscale - Ashburn",
  location: "Ashburn, Virginia",
  totalCompletion: 42,
  weeklyProgressTrend: { value: 1.5, direction: 'up', label: "vs last week" },
  lastUpdated: new Date().toISOString().split('T')[0],
  aiForecast: {
    riskLevel: 'High',
    summary: "Steel erection rate is 15% slower than plan. At this pace, T202 will delay the 'Enclosure' milestone by 12 days.",
    probability: 85,
    affectedTaskIds: ['T202', 'T301']
  },
  schedule: [
    { id: "T101", name: "Site Excavation", startDate: "2023-10-01", endDate: "2023-11-15", status: "Completed", progress: 100, criticalPath: true, assignedTo: "EarthWorks Inc." },
    { id: "T102", name: "Foundation Pour", startDate: "2023-11-16", endDate: "2024-01-30", status: "Completed", progress: 100, criticalPath: true, assignedTo: "Concrete Masters" },
    { id: "T201", name: "Steel Erection - Zone A", startDate: "2024-02-01", endDate: "2024-04-15", status: "In Progress", progress: 85, criticalPath: true, assignedTo: "IronStrong" },
    { id: "T202", name: "Steel Erection - Zone B", startDate: "2024-03-01", endDate: "2024-05-15", status: "Delayed", progress: 40, criticalPath: true, assignedTo: "IronStrong" },
    { id: "T301", name: "HVAC Ductwork Installation", startDate: "2024-04-01", endDate: "2024-07-30", status: "In Progress", progress: 15, criticalPath: false, assignedTo: "CoolAir Systems" },
    { id: "T305", name: "Electrical Switchgear Install", startDate: "2024-05-01", endDate: "2024-08-15", status: "Not Started", progress: 0, criticalPath: true, assignedTo: "VoltTech" },
  ],
  rfis: [
    { id: "RFI-1042", subject: "Steel Beam Clash with HVAC", dateCreated: "2024-03-15", status: "Open", priority: "High", discipline: "Structural", impact: "Blocking T202 completion.", assignedTo: "StructEng Co." },
    { id: "RFI-1050", subject: "Switchgear Lead Time", dateCreated: "2024-04-02", status: "Open", priority: "High", discipline: "Electrical", impact: "Supply chain delay.", assignedTo: "PowerGrid Suppliers" },
  ],
  financials: [
    { category: "Site Work", budget: 5000000, actual: 4800000, forecast: 5000000, variance: 0 },
    { category: "Concrete", budget: 8000000, actual: 8500000, forecast: 8500000, variance: -500000 },
    { category: "Steel", budget: 12000000, actual: 6000000, forecast: 13500000, variance: -1500000 },
    { category: "MEP", budget: 25000000, actual: 2000000, forecast: 26000000, variance: -1000000 },
  ],
  inspections: [
    { id: "INSP-55", date: "2024-03-10", location: "Zone A Foundation", result: "Pass", notes: "All rebar spacing verified." },
    { id: "INSP-59", date: "2024-03-28", location: "Zone B Steel Welds", result: "Fail", notes: "3 welds failed NDT." },
  ],
  workforce: { activeWorkers: 142, trend: { value: 12, direction: 'up', label: "vs last week" } },
  safety: { incidents: 0, daysWithoutIncident: 145 },
  agentAlerts: [
    { id: "AGT-001", agentType: "Safety Sentinel", title: "Potential PPE Violation", description: "Computer vision detected worker without helmet in Zone B camera feed.", severity: "High", confidenceScore: 92, status: "New", dateDetected: "2024-04-12", source: "Cam-04 Feed" },
    { id: "AGT-005", agentType: "Productivity Benchmarker", title: "Trade Underperformance", description: "Drywall crew productivity in Zone C is 20% below baseline. Daily logs show only 400 sqft installed vs plan of 500 sqft.", severity: "High", confidenceScore: 89, status: "New", dateDetected: "2024-04-13", source: "Procore Daily Logs" },
    { id: "AGT-006", agentType: "RFI Bottleneck Detector", title: "Design Approval Stall", description: "RFI-1042 (Structural) has been open for 14 days (Avg: 5 days). This bottleneck is projected to delay T202 by 1 week.", severity: "Critical", confidenceScore: 95, status: "New", dateDetected: "2024-04-14", source: "Autodesk Construction Cloud" },
    { id: "AGT-002", agentType: "Budget Watchdog", title: "Invoice Discrepancy", description: "Invoice #9902 from Concrete Masters is 15% higher than PO #4421.", severity: "Medium", confidenceScore: 88, status: "New", dateDetected: "2024-04-11", source: "ERP System" },
  ],
  documents: [
    { id: "DOC-001", name: "Project_Charter_Signed.pdf", type: "PDF", category: "Contracts", date: "2023-09-01", size: "2.4 MB" },
    { id: "DOC-002", name: "Structural_Drawings_Rev3.dwg", type: "DWG", category: "Drawings", date: "2024-01-15", size: "45 MB" },
    { id: "DOC-003", name: "March_Financial_Report.xlsx", type: "XLSX", category: "Reports", date: "2024-04-01", size: "1.1 MB" },
  ]
};

const PROJECT_B: ProjectData = {
  id: "2",
  projectId: "DC-PHX-042",
  projectName: "Helios Solar Park - Phoenix",
  location: "Phoenix, Arizona",
  totalCompletion: 12,
  weeklyProgressTrend: { value: 0.5, direction: 'down', label: "vs last week" },
  lastUpdated: new Date().toISOString().split('T')[0],
  aiForecast: {
    riskLevel: 'Medium',
    summary: "Extreme heat warning next week may reduce workforce productivity by 20%. Consider shifting to night shifts for excavation.",
    probability: 60,
    affectedTaskIds: ['T101']
  },
  schedule: [
    { id: "T101", name: "Site Grading", startDate: "2024-03-01", endDate: "2024-04-30", status: "In Progress", progress: 35, criticalPath: true, assignedTo: "Desert Diggers" },
    { id: "T102", name: "Perimeter Security", startDate: "2024-03-15", endDate: "2024-05-15", status: "In Progress", progress: 20, criticalPath: false, assignedTo: "SecureCo" },
  ],
  rfis: [
    { id: "RFI-005", subject: "Soil Compaction Variance", dateCreated: "2024-04-05", status: "Open", priority: "Medium", discipline: "Civil", impact: "Minor rework needed.", assignedTo: "GeoTech Labs" },
  ],
  financials: [
    { category: "Site Work", budget: 15000000, actual: 2000000, forecast: 14500000, variance: 500000 },
    { category: "Security", budget: 3000000, actual: 500000, forecast: 3000000, variance: 0 },
  ],
  inspections: [
    { id: "INSP-01", date: "2024-04-01", location: "North Quadrant", result: "Pass", notes: "Compaction meets spec." },
  ],
  workforce: { activeWorkers: 45, trend: { value: -5, direction: 'down', label: "vs last week" } },
  safety: { incidents: 0, daysWithoutIncident: 32 },
  agentAlerts: [
    { id: "AGT-004", agentType: "Schedule Guardian", title: "Weather Delay Risk", description: "Heat wave forecast >110F for 3 consecutive days.", severity: "High", confidenceScore: 95, status: "Verified", dateDetected: "2024-04-12", source: "Weather API" },
    { id: "AGT-007", agentType: "Supply Chain Scout", title: "Inverter Shipment Delay", description: "Logistics partner reports 2-week delay on solar inverters due to global chip shortage.", severity: "Medium", confidenceScore: 82, status: "New", dateDetected: "2024-04-14", source: "Logistics Portal" },
    { id: "AGT-008", agentType: "Safety Sentinel", title: "Heat Stress Warning", description: "AI suggests halting outdoor manual labor between 12pm-4pm next Tuesday due to extreme heat index.", severity: "High", confidenceScore: 98, status: "New", dateDetected: "2024-04-14", source: "Safety Protocol AI" }
  ],
  documents: [
    { id: "DOC-004", name: "Geotech_Report.pdf", type: "PDF", category: "Reports", date: "2023-12-10", size: "5.6 MB" },
  ]
};

const PROJECT_C: ProjectData = {
  id: "3",
  projectId: "DC-LDN-009",
  projectName: "Nordic Edge Hub - London",
  location: "London, UK",
  totalCompletion: 88,
  weeklyProgressTrend: { value: 2.0, direction: 'up', label: "vs last week" },
  lastUpdated: new Date().toISOString().split('T')[0],
  aiForecast: {
    riskLevel: 'Low',
    summary: "Project is tracking ahead of schedule. Opportunity to pull forward 'Commissioning' by 1 week.",
    probability: 90,
    affectedTaskIds: ['T501']
  },
  schedule: [
    { id: "T405", name: "Cooling Tower Install", startDate: "2023-11-01", endDate: "2024-02-28", status: "Completed", progress: 100, criticalPath: true, assignedTo: "ArcticFlow" },
    { id: "T501", name: "L5 Commissioning", startDate: "2024-04-01", endDate: "2024-05-15", status: "In Progress", progress: 40, criticalPath: true, assignedTo: "TechOps" },
  ],
  rfis: [],
  financials: [
    { category: "Mechanical", budget: 18000000, actual: 17500000, forecast: 17800000, variance: 200000 },
    { category: "Commissioning", budget: 2000000, actual: 500000, forecast: 2000000, variance: 0 },
  ],
  inspections: [
    { id: "INSP-102", date: "2024-04-10", location: "Roof", result: "Pass", notes: "Ready for commissioning." },
  ],
  workforce: { activeWorkers: 85, trend: { value: 0, direction: 'neutral', label: "vs last week" } },
  safety: { incidents: 0, daysWithoutIncident: 210 },
  agentAlerts: [
    { id: "AGT-C01", agentType: "Quality Control", title: "Acoustic Compliance Risk", description: "Cooling tower testing logs indicate decibel levels 5% above local council ordinance during peak load.", severity: "Medium", confidenceScore: 88, status: "New", dateDetected: "2024-04-12", source: "IoT Sound Sensors" },
    { id: "AGT-C02", agentType: "RFI Bottleneck Detector", title: "BIM Clash Detected", description: "Automated clash detection found interference between Fire Suppression and L5 Cable Trays.", severity: "Low", confidenceScore: 99, status: "Verified", dateDetected: "2024-04-10", source: "Navisworks" }
  ],
  documents: [
    { id: "DOC-005", name: "Commissioning_Checklist.xlsx", type: "XLSX", category: "Reports", date: "2024-04-10", size: "0.5 MB" },
  ]
};

const PROJECT_D: ProjectData = {
  id: "4",
  projectId: "DC-SIN-002",
  projectName: "Asia Pacific Gateway - Singapore",
  location: "Singapore, SG",
  totalCompletion: 95,
  weeklyProgressTrend: { value: 0.8, direction: 'up', label: "vs last week" },
  lastUpdated: new Date().toISOString().split('T')[0],
  aiForecast: {
    riskLevel: 'Medium',
    summary: "Fiber termination is critical path. A delay in fiber delivery from Malaysia observed in supply chain reports.",
    probability: 70,
    affectedTaskIds: ['T901']
  },
  schedule: [
    { id: "T801", name: "Server Rack Installation", startDate: "2024-01-10", endDate: "2024-03-30", status: "Completed", progress: 100, criticalPath: true, assignedTo: "RackEmUp" },
    { id: "T901", name: "Fiber Backbone Termination", startDate: "2024-04-01", endDate: "2024-04-20", status: "In Progress", progress: 60, criticalPath: true, assignedTo: "NetLink" },
    { id: "T999", name: "Final Handover", startDate: "2024-04-25", endDate: "2024-04-30", status: "Not Started", progress: 0, criticalPath: true, assignedTo: "BuildIntel Ops" },
  ],
  rfis: [],
  financials: [
    { category: "IT Infrastructure", budget: 22000000, actual: 21500000, forecast: 22100000, variance: -100000 },
  ],
  inspections: [
    { id: "INSP-204", date: "2024-04-12", location: "Server Hall 3", result: "Pass", notes: "Cleanliness approved." }
  ],
  workforce: { activeWorkers: 40, trend: { value: -10, direction: 'down', label: "Ramping down" } },
  safety: { incidents: 0, daysWithoutIncident: 365 },
  agentAlerts: [
    { id: "AGT-006", agentType: "Supply Chain Scout", title: "Customs Delay", description: "Fiber shipment stuck at Johor causeway customs due to paperwork mismatch.", severity: "High", confidenceScore: 89, status: "New", dateDetected: "2024-04-14", source: "Logistics API" },
    { id: "AGT-D02", agentType: "Productivity Benchmarker", title: "Night Shift Efficiency", description: "Night shift fiber termination rate is 40% lower than day shift. Daily logs cite 'poor lighting conditions'.", severity: "Medium", confidenceScore: 92, status: "New", dateDetected: "2024-04-13", source: "Daily Reports" }
  ],
  documents: [
    { id: "DOC-S01", name: "Handover_Protocol.pdf", type: "PDF", category: "Reports", date: "2024-03-01", size: "1.2 MB" }
  ]
};

const PROJECT_E: ProjectData = {
  id: "5",
  projectId: "DC-FRA-101",
  projectName: "Rhine Data Fortress - Frankfurt",
  location: "Frankfurt, Germany",
  totalCompletion: 5,
  weeklyProgressTrend: { value: 0.2, direction: 'neutral', label: "vs last week" },
  lastUpdated: new Date().toISOString().split('T')[0],
  aiForecast: {
    riskLevel: 'High',
    summary: "Permitting delays for groundwater discharge are stalling excavation start. Regulatory review period extended.",
    probability: 95,
    affectedTaskIds: ['T001']
  },
  schedule: [
    { id: "T001", name: "Groundwater Permit Approval", startDate: "2024-02-01", endDate: "2024-03-01", status: "Delayed", progress: 80, criticalPath: true, assignedTo: "Legal Team" },
    { id: "T002", name: "Site Mobilization", startDate: "2024-03-15", endDate: "2024-03-30", status: "Not Started", progress: 0, criticalPath: true, assignedTo: "EuroBuild" },
  ],
  rfis: [
     { id: "RFI-E01", subject: "Water Table Clarification", dateCreated: "2024-02-20", status: "Open", priority: "High", discipline: "Civil", impact: "Blocking Permit", assignedTo: "HydroConsult GmbH" },
  ],
  financials: [
    { category: "Preliminaries", budget: 2000000, actual: 500000, forecast: 2500000, variance: -500000 },
  ],
  inspections: [],
  workforce: { activeWorkers: 10, trend: { value: 0, direction: 'neutral', label: "Skeleton crew" } },
  safety: { incidents: 0, daysWithoutIncident: 45 },
  agentAlerts: [
    { id: "AGT-E01", agentType: "Schedule Guardian", title: "Regulatory Delay", description: "Municipal office announced 2-week backlog on environmental permits.", severity: "Critical", confidenceScore: 99, status: "Verified", dateDetected: "2024-04-01", source: "Gov Portal Scraper" },
    { id: "AGT-E02", agentType: "Budget Watchdog", title: "Utility Fee Spike", description: "Local power authority increased connection fees by 12% effective next month. Unbudgeted variance: €150k.", severity: "Medium", confidenceScore: 95, status: "New", dateDetected: "2024-04-11", source: "Utility Provider API" }
  ],
  documents: [
      { id: "DOC-E01", name: "Environmental_Impact_Study.pdf", type: "PDF", category: "Reports", date: "2024-01-10", size: "15 MB" }
  ]
};

const PROJECT_F: ProjectData = {
  id: "6",
  projectId: "DC-TYO-088",
  projectName: "Sakura Stream - Tokyo",
  location: "Tokyo, Japan",
  totalCompletion: 65,
  weeklyProgressTrend: { value: 2.1, direction: 'up', label: "vs last week" },
  lastUpdated: new Date().toISOString().split('T')[0],
  aiForecast: {
    riskLevel: 'Low',
    summary: "Seismic retrofitting ahead of schedule. Budget slightly over due to expedited steel delivery, but within contingency.",
    probability: 20,
    affectedTaskIds: []
  },
  schedule: [
    { id: "T601", name: "Seismic Dampener Install", startDate: "2024-01-01", endDate: "2024-04-30", status: "In Progress", progress: 90, criticalPath: true, assignedTo: "Kajima Corp" },
    { id: "T602", name: "Exterior Cladding", startDate: "2024-03-01", endDate: "2024-06-01", status: "In Progress", progress: 40, criticalPath: false, assignedTo: "FacadePros" },
  ],
  rfis: [],
  financials: [
    { category: "Structural", budget: 45000000, actual: 46000000, forecast: 46000000, variance: -1000000 },
    { category: "Facade", budget: 12000000, actual: 4000000, forecast: 12000000, variance: 0 },
  ],
  inspections: [
      { id: "INSP-F10", date: "2024-04-10", location: "Base Isolators", result: "Pass", notes: "All specs met." }
  ],
  workforce: { activeWorkers: 210, trend: { value: 5, direction: 'up', label: "Peak workforce" } },
  safety: { incidents: 0, daysWithoutIncident: 500 },
  agentAlerts: [
      { id: "AGT-F01", agentType: "Supply Chain Scout", title: "Typhoon Logistics Impact", description: "Typhoon approaching shipping lane. Steel dampers likely delayed by 5 days.", severity: "High", confidenceScore: 85, status: "New", dateDetected: "2024-04-15", source: "Maritime Weather API" },
      { id: "AGT-F02", agentType: "Schedule Guardian", title: "Crane Resource Conflict", description: "Tower Crane 2 double-booked for Cladding and Roof loads next Tuesday.", severity: "Medium", confidenceScore: 80, status: "New", dateDetected: "2024-04-13", source: "Schedule Optimization AI" }
  ],
  documents: [
       { id: "DOC-F01", name: "Seismic_Calcs_Final.pdf", type: "PDF", category: "Drawings", date: "2023-11-05", size: "8.8 MB" }
  ]
};

const PROJECT_G: ProjectData = {
  id: "7",
  projectId: "DC-SYD-303",
  projectName: "Southern Cross Hub - Sydney",
  location: "Sydney, Australia",
  totalCompletion: 25,
  weeklyProgressTrend: { value: -0.5, direction: 'down', label: "vs last week" },
  lastUpdated: new Date().toISOString().split('T')[0],
  aiForecast: {
    riskLevel: 'Medium',
    summary: "Union labor dispute rumored for next month could impact electrical rough-in. Suggest contingency staffing plan.",
    probability: 65,
    affectedTaskIds: ['T301', 'T302']
  },
  schedule: [
    { id: "T301", name: "L1 Electrical Rough-in", startDate: "2024-04-01", endDate: "2024-05-30", status: "In Progress", progress: 10, criticalPath: true, assignedTo: "SparkyAus" },
    { id: "T302", name: "Plumbing Rough-in", startDate: "2024-04-10", endDate: "2024-06-10", status: "Not Started", progress: 0, criticalPath: true, assignedTo: "FlowMasters" },
  ],
  rfis: [
      { id: "RFI-G05", subject: "Cable Tray Routing Conflict", dateCreated: "2024-04-12", status: "Open", priority: "Medium", discipline: "Electrical", impact: "Minor rework", assignedTo: "DesignConnect" }
  ],
  financials: [
    { category: "Electrical", budget: 15000000, actual: 1000000, forecast: 15500000, variance: -500000 },
  ],
  inspections: [],
  workforce: { activeWorkers: 65, trend: { value: -2, direction: 'down', label: "Absenteeism up" } },
  safety: { incidents: 1, daysWithoutIncident: 5 },
  agentAlerts: [
    { id: "AGT-G01", agentType: "Safety Sentinel", title: "Near Miss Reported", description: "Worker slipped on wet concrete on L1. No injury, but housekeeping flagged.", severity: "Medium", confidenceScore: 100, status: "Verified", dateDetected: "2024-04-10", source: "Safety App" },
    { id: "AGT-G02", agentType: "Schedule Guardian", title: "Labor Strike Risk", description: "Local union voting on strike action for electrical trades.", severity: "High", confidenceScore: 75, status: "New", dateDetected: "2024-04-14", source: "News API" },
    { id: "AGT-G03", agentType: "RFI Bottleneck Detector", title: "Electrical Schematic Stall", description: "Critical electrical schematics pending consultant review for 12 days. Blocking rough-in start.", severity: "Critical", confidenceScore: 91, status: "New", dateDetected: "2024-04-13", source: "Procore" }
  ],
  documents: [
       { id: "DOC-G01", name: "Safety_Incident_Report_001.pdf", type: "PDF", category: "Reports", date: "2024-04-10", size: "0.2 MB" }
  ]
};

const PROJECT_H: ProjectData = {
  id: "8",
  projectId: "DC-SAO-005",
  projectName: "Amazonia Connect - Sao Paulo",
  location: "Sao Paulo, Brazil",
  totalCompletion: 18,
  weeklyProgressTrend: { value: 1.0, direction: 'up', label: "vs last week" },
  lastUpdated: new Date().toISOString().split('T')[0],
  aiForecast: {
    riskLevel: 'High',
    summary: "Currency fluctuation impacting imported generator costs. Budget variance likely to exceed 10% for mechanical equipment.",
    probability: 90,
    affectedTaskIds: []
  },
  schedule: [
    { id: "T205", name: "Substructure Concrete", startDate: "2024-02-01", endDate: "2024-05-01", status: "In Progress", progress: 60, criticalPath: true, assignedTo: "ConstrucaoBR" },
  ],
  rfis: [],
  financials: [
    { category: "Equipment Procurement", budget: 30000000, actual: 5000000, forecast: 34000000, variance: -4000000 },
  ],
  inspections: [
      { id: "INSP-H01", date: "2024-03-30", location: "Piles", result: "Pass", notes: "Load test passed." }
  ],
  workforce: { activeWorkers: 90, trend: { value: 5, direction: 'up', label: "Ramping up" } },
  safety: { incidents: 0, daysWithoutIncident: 110 },
  agentAlerts: [
    { id: "AGT-H01", agentType: "Budget Watchdog", title: "Forex Exposure", description: "BRL depreciated 5% against USD this week. Generator payments are in USD.", severity: "High", confidenceScore: 98, status: "New", dateDetected: "2024-04-13", source: "Finance API" },
    { id: "AGT-H02", agentType: "Safety Sentinel", title: "Proximity Breach", description: "IoT wearables detected 3 instances of workers within swing radius of excavator.", severity: "High", confidenceScore: 95, status: "New", dateDetected: "2024-04-12", source: "IoT Safety Net" },
    { id: "AGT-H03", agentType: "Productivity Benchmarker", title: "Concrete Cure Time", description: "High humidity extending concrete cure times by 24h. Schedule adjustment recommended.", severity: "Low", confidenceScore: 85, status: "New", dateDetected: "2024-04-14", source: "Weather + Schedule AI" }
  ],
  documents: [
      { id: "DOC-H01", name: "Procurement_Log.xlsx", type: "XLSX", category: "Reports", date: "2024-04-01", size: "0.8 MB" }
  ]
};

const PROJECT_I: ProjectData = {
  id: "9",
  projectId: "DC-DUB-771",
  projectName: "Emerald Isle Data - Dublin",
  location: "Dublin, Ireland",
  totalCompletion: 55,
  weeklyProgressTrend: { value: 0.0, direction: 'neutral', label: "vs last week" },
  lastUpdated: new Date().toISOString().split('T')[0],
  aiForecast: {
    riskLevel: 'Medium',
    summary: "Heavy rainfall forecasted for next 10 days will likely slow down roof waterproofing works. Schedule slip of 5 days projected.",
    probability: 80,
    affectedTaskIds: ['T550']
  },
  schedule: [
    { id: "T500", name: "Steel Structure", startDate: "2023-11-01", endDate: "2024-03-01", status: "Completed", progress: 100, criticalPath: true, assignedTo: "Irish Steel" },
    { id: "T550", name: "Roof Waterproofing", startDate: "2024-03-15", endDate: "2024-05-15", status: "In Progress", progress: 30, criticalPath: true, assignedTo: "RainProof Ltd" },
  ],
  rfis: [],
  financials: [
    { category: "Shell & Core", budget: 25000000, actual: 24000000, forecast: 25000000, variance: 0 },
  ],
  inspections: [],
  workforce: { activeWorkers: 120, trend: { value: 0, direction: 'neutral', label: "Stable" } },
  safety: { incidents: 0, daysWithoutIncident: 88 },
  agentAlerts: [
      { id: "AGT-I01", agentType: "Schedule Guardian", title: "Weather Alert", description: "Storm front approaching. Roof works unsafe for 3 days.", severity: "Medium", confidenceScore: 92, status: "Verified", dateDetected: "2024-04-14", source: "Met Éireann" },
      { id: "AGT-I02", agentType: "Supply Chain Scout", title: "Generator Delivery Hold", description: "Generators held at port due to missing emission certification paperwork.", severity: "Critical", confidenceScore: 99, status: "New", dateDetected: "2024-04-12", source: "Customs API" },
      { id: "AGT-I03", agentType: "Quality Control", title: "Membrane Thickness Fail", description: "Drone scan indicates waterproofing membrane in Zone C is below 2mm spec.", severity: "High", confidenceScore: 95, status: "New", dateDetected: "2024-04-13", source: "Drone Deploy" }
  ],
  documents: [
      { id: "DOC-I01", name: "Safety_Plan_Rain.pdf", type: "PDF", category: "Reports", date: "2023-10-01", size: "3.5 MB" }
  ]
};

export const PROJECTS = [PROJECT_A, PROJECT_B, PROJECT_C, PROJECT_D, PROJECT_E, PROJECT_F, PROJECT_G, PROJECT_H, PROJECT_I];