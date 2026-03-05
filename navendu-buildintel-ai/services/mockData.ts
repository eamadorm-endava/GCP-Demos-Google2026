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
    { id: "T102", name: "Perimeter Security Fencing", startDate: "2024-03-15", endDate: "2024-05-15", status: "In Progress", progress: 20, criticalPath: false, assignedTo: "SecureCo" },
    { id: "T103", name: "Underground Conduit & Trenching", startDate: "2024-04-15", endDate: "2024-06-30", status: "Not Started", progress: 0, criticalPath: true, assignedTo: "SunWire Electric" },
    { id: "T104", name: "Substation Foundation", startDate: "2024-05-01", endDate: "2024-06-15", status: "Not Started", progress: 0, criticalPath: true, assignedTo: "Concrete Masters" },
    { id: "T105", name: "Solar Panel Racking Install", startDate: "2024-06-01", endDate: "2024-09-30", status: "Not Started", progress: 0, criticalPath: true, assignedTo: "SolarEdge Installers" },
    { id: "T106", name: "Inverter & Transformer Install", startDate: "2024-08-01", endDate: "2024-10-30", status: "Not Started", progress: 0, criticalPath: true, assignedTo: "PowerGrid Suppliers" },
  ],
  rfis: [
    { id: "RFI-005", subject: "Soil Compaction Variance", dateCreated: "2024-04-05", status: "Open", priority: "Medium", discipline: "Civil", impact: "Minor rework needed.", assignedTo: "GeoTech Labs" },
    { id: "RFI-006", subject: "Conduit Depth vs Rock Layer", dateCreated: "2024-04-10", status: "Open", priority: "High", discipline: "Civil", impact: "May require blasting — cost & schedule impact.", assignedTo: "Desert Diggers" },
    { id: "RFI-007", subject: "Panel Tilt Angle Clarification", dateCreated: "2024-04-08", status: "Closed", priority: "Low", discipline: "Electrical", impact: "None — resolved per spec sheet.", assignedTo: "SolarEdge Installers" },
  ],
  financials: [
    { category: "Site Work", budget: 15000000, actual: 2000000, forecast: 14500000, variance: 500000 },
    { category: "Electrical", budget: 8000000, actual: 200000, forecast: 8500000, variance: -500000 },
    { category: "Security", budget: 3000000, actual: 500000, forecast: 3000000, variance: 0 },
    { category: "Equipment Procurement", budget: 22000000, actual: 1500000, forecast: 23000000, variance: -1000000 },
  ],
  inspections: [
    { id: "INSP-01", date: "2024-04-01", location: "North Quadrant", result: "Pass", notes: "Compaction meets spec." },
    { id: "INSP-02", date: "2024-04-08", location: "South Quadrant", result: "Pass with Conditions", notes: "Compaction 92% — retest after next roller pass." },
    { id: "INSP-03", date: "2024-04-14", location: "Perimeter Fence Line", result: "Pass", notes: "Post embedment depth verified." },
  ],
  workforce: { activeWorkers: 45, trend: { value: -5, direction: 'down', label: "vs last week" } },
  safety: { incidents: 0, daysWithoutIncident: 32 },
  agentAlerts: [
    { id: "AGT-004", agentType: "Schedule Guardian", title: "Weather Delay Risk", description: "Heat wave forecast >110F for 3 consecutive days. Site grading crew efficiency expected to drop 30%.", severity: "High", confidenceScore: 95, status: "Verified", dateDetected: "2024-04-12", source: "Weather API" },
    { id: "AGT-007", agentType: "Supply Chain Scout", title: "Inverter Shipment Delay", description: "Logistics partner reports 2-week delay on solar inverters due to global chip shortage. 480 units affected.", severity: "Medium", confidenceScore: 82, status: "New", dateDetected: "2024-04-14", source: "Logistics Portal" },
    { id: "AGT-008", agentType: "Safety Sentinel", title: "Heat Stress Warning", description: "AI suggests halting outdoor manual labor between 12pm-4pm next Tuesday due to extreme heat index of 118°F.", severity: "High", confidenceScore: 98, status: "New", dateDetected: "2024-04-14", source: "Safety Protocol AI" },
    { id: "AGT-009", agentType: "Budget Watchdog", title: "Rock Blasting Cost Risk", description: "RFI-006 suggests rock layer at 4ft depth across 60% of conduit route. Blasting could add $800K to site work budget.", severity: "High", confidenceScore: 87, status: "New", dateDetected: "2024-04-15", source: "Geotech Report + Cost Model" },
  ],
  documents: [
    { id: "DOC-004", name: "Geotech_Report.pdf", type: "PDF", category: "Reports", date: "2023-12-10", size: "5.6 MB" },
    { id: "DOC-B02", name: "Solar_Panel_Layout_Rev2.dwg", type: "DWG", category: "Drawings", date: "2024-02-15", size: "32 MB" },
    { id: "DOC-B03", name: "EPC_Contract_Signed.pdf", type: "PDF", category: "Contracts", date: "2024-01-20", size: "4.2 MB" },
    { id: "DOC-B04", name: "Utility_Interconnect_Agreement.pdf", type: "PDF", category: "Contracts", date: "2024-02-28", size: "1.8 MB" },
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
    { id: "T401", name: "Structural Steel Erection", startDate: "2023-08-01", endDate: "2023-10-31", status: "Completed", progress: 100, criticalPath: true, assignedTo: "BritSteel Ltd" },
    { id: "T402", name: "Roof & Envelope", startDate: "2023-10-15", endDate: "2024-01-15", status: "Completed", progress: 100, criticalPath: true, assignedTo: "WeatherSeal UK" },
    { id: "T403", name: "MEP Rough-In", startDate: "2023-12-01", endDate: "2024-03-15", status: "Completed", progress: 100, criticalPath: false, assignedTo: "M&E Partners" },
    { id: "T405", name: "Cooling Tower Install", startDate: "2023-11-01", endDate: "2024-02-28", status: "Completed", progress: 100, criticalPath: true, assignedTo: "ArcticFlow" },
    { id: "T450", name: "Fire Suppression System", startDate: "2024-02-01", endDate: "2024-04-15", status: "In Progress", progress: 75, criticalPath: false, assignedTo: "FireGuard Systems" },
    { id: "T501", name: "L5 Commissioning & Testing", startDate: "2024-04-01", endDate: "2024-05-15", status: "In Progress", progress: 40, criticalPath: true, assignedTo: "TechOps" },
  ],
  rfis: [
    { id: "RFI-C01", subject: "Fire Suppression Nozzle Spacing", dateCreated: "2024-03-10", status: "Closed", priority: "Medium", discipline: "Mechanical", impact: "Resolved — spacing adjusted per NFPA 13.", assignedTo: "FireGuard Systems" },
    { id: "RFI-C02", subject: "Cooling Tower Acoustic Enclosure", dateCreated: "2024-03-25", status: "Open", priority: "High", discipline: "Mechanical", impact: "Council noise ordinance compliance at risk.", assignedTo: "ArcticFlow" },
    { id: "RFI-C03", subject: "UPS Battery Room Ventilation", dateCreated: "2024-04-02", status: "Open", priority: "Medium", discipline: "Electrical", impact: "H2 gas accumulation risk if undersized.", assignedTo: "M&E Partners" },
  ],
  financials: [
    { category: "Structural", budget: 12000000, actual: 11800000, forecast: 11800000, variance: 200000 },
    { category: "Mechanical", budget: 18000000, actual: 17500000, forecast: 17800000, variance: 200000 },
    { category: "Electrical", budget: 9000000, actual: 8200000, forecast: 9000000, variance: 0 },
    { category: "Commissioning", budget: 2000000, actual: 500000, forecast: 2000000, variance: 0 },
  ],
  inspections: [
    { id: "INSP-102", date: "2024-04-10", location: "Roof", result: "Pass", notes: "Ready for commissioning." },
    { id: "INSP-103", date: "2024-04-05", location: "L5 Server Hall", result: "Pass", notes: "Raised floor levelness within spec." },
    { id: "INSP-104", date: "2024-03-28", location: "Cooling Tower Pad", result: "Pass with Conditions", notes: "Vibration isolation pads need re-shimming." },
  ],
  workforce: { activeWorkers: 85, trend: { value: 0, direction: 'neutral', label: "vs last week" } },
  safety: { incidents: 0, daysWithoutIncident: 210 },
  agentAlerts: [
    { id: "AGT-C01", agentType: "Quality Control", title: "Acoustic Compliance Risk", description: "Cooling tower testing logs indicate decibel levels 5% above local council ordinance during peak load. Enclosure RFI-C02 pending.", severity: "Medium", confidenceScore: 88, status: "New", dateDetected: "2024-04-12", source: "IoT Sound Sensors" },
    { id: "AGT-C02", agentType: "RFI Bottleneck Detector", title: "BIM Clash Detected", description: "Automated clash detection found interference between Fire Suppression and L5 Cable Trays in Grid Lines E4-E7.", severity: "Low", confidenceScore: 99, status: "Verified", dateDetected: "2024-04-10", source: "Navisworks" },
    { id: "AGT-C03", agentType: "Schedule Guardian", title: "Commissioning Acceleration Opportunity", description: "All prerequisites for L5 commissioning are 5 days ahead. Pulling forward saves £45K in contractor demob costs.", severity: "Low", confidenceScore: 94, status: "New", dateDetected: "2024-04-14", source: "Schedule Optimizer AI" },
  ],
  documents: [
    { id: "DOC-005", name: "Commissioning_Checklist.xlsx", type: "XLSX", category: "Reports", date: "2024-04-10", size: "0.5 MB" },
    { id: "DOC-C02", name: "MEP_Coordination_Drawings.dwg", type: "DWG", category: "Drawings", date: "2024-01-20", size: "58 MB" },
    { id: "DOC-C03", name: "Noise_Assessment_Report.pdf", type: "PDF", category: "Reports", date: "2024-03-15", size: "2.1 MB" },
    { id: "DOC-C04", name: "O&M_Manual_Draft.pdf", type: "PDF", category: "Contracts", date: "2024-04-05", size: "12 MB" },
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
    { id: "T701", name: "Raised Floor Installation", startDate: "2023-10-01", endDate: "2024-01-15", status: "Completed", progress: 100, criticalPath: false, assignedTo: "FloorTech Asia" },
    { id: "T750", name: "UPS & Battery System", startDate: "2023-11-01", endDate: "2024-02-28", status: "Completed", progress: 100, criticalPath: true, assignedTo: "PowerSecure SG" },
    { id: "T801", name: "Server Rack Installation", startDate: "2024-01-10", endDate: "2024-03-30", status: "Completed", progress: 100, criticalPath: true, assignedTo: "RackEmUp" },
    { id: "T850", name: "CRAC Unit Commissioning", startDate: "2024-03-01", endDate: "2024-04-10", status: "Completed", progress: 100, criticalPath: false, assignedTo: "CoolTech" },
    { id: "T901", name: "Fiber Backbone Termination", startDate: "2024-04-01", endDate: "2024-04-20", status: "In Progress", progress: 60, criticalPath: true, assignedTo: "NetLink" },
    { id: "T950", name: "Security & Access Control", startDate: "2024-04-10", endDate: "2024-04-25", status: "In Progress", progress: 30, criticalPath: false, assignedTo: "SecurIT SG" },
    { id: "T999", name: "Final Handover & Acceptance", startDate: "2024-04-25", endDate: "2024-04-30", status: "Not Started", progress: 0, criticalPath: true, assignedTo: "BuildIntel Ops" },
  ],
  rfis: [
    { id: "RFI-D01", subject: "Fiber Tray Load Rating", dateCreated: "2024-04-05", status: "Closed", priority: "Medium", discipline: "Electrical", impact: "Resolved — upgraded to 200kg/m trays.", assignedTo: "NetLink" },
    { id: "RFI-D02", subject: "Access Floor Tile Grounding", dateCreated: "2024-04-08", status: "Open", priority: "High", discipline: "Electrical", impact: "ESD risk if not bonded properly.", assignedTo: "FloorTech Asia" },
    { id: "RFI-D03", subject: "Generator Fuel Tank Bunding", dateCreated: "2024-04-12", status: "Open", priority: "Medium", discipline: "Mechanical", impact: "NEA compliance requirement.", assignedTo: "PowerSecure SG" },
  ],
  financials: [
    { category: "IT Infrastructure", budget: 22000000, actual: 21500000, forecast: 22100000, variance: -100000 },
    { category: "MEP Systems", budget: 15000000, actual: 14800000, forecast: 15000000, variance: 0 },
    { category: "Security", budget: 3000000, actual: 2200000, forecast: 3000000, variance: 0 },
    { category: "Commissioning", budget: 1500000, actual: 800000, forecast: 1500000, variance: 0 },
  ],
  inspections: [
    { id: "INSP-204", date: "2024-04-12", location: "Server Hall 3", result: "Pass", notes: "Cleanliness approved." },
    { id: "INSP-205", date: "2024-04-08", location: "UPS Room", result: "Pass", notes: "Battery string voltage balanced." },
    { id: "INSP-206", date: "2024-04-14", location: "CRAC Units Row A", result: "Pass with Conditions", notes: "Condensate drain slope marginal — monitor." },
  ],
  workforce: { activeWorkers: 40, trend: { value: -10, direction: 'down', label: "Ramping down" } },
  safety: { incidents: 0, daysWithoutIncident: 365 },
  agentAlerts: [
    { id: "AGT-006", agentType: "Supply Chain Scout", title: "Customs Delay", description: "Fiber shipment stuck at Johor causeway customs due to paperwork mismatch. 48-hour hold expected.", severity: "High", confidenceScore: 89, status: "New", dateDetected: "2024-04-14", source: "Logistics API" },
    { id: "AGT-D02", agentType: "Productivity Benchmarker", title: "Night Shift Efficiency", description: "Night shift fiber termination rate is 40% lower than day shift. Daily logs cite 'poor lighting conditions' in Hall 3.", severity: "Medium", confidenceScore: 92, status: "New", dateDetected: "2024-04-13", source: "Daily Reports" },
    { id: "AGT-D03", agentType: "Quality Control", title: "OTDR Test Failures", description: "12 of 96 fiber strands failed OTDR loss budget test. Re-termination required before handover.", severity: "High", confidenceScore: 96, status: "New", dateDetected: "2024-04-15", source: "Test Results DB" },
  ],
  documents: [
    { id: "DOC-S01", name: "Handover_Protocol.pdf", type: "PDF", category: "Reports", date: "2024-03-01", size: "1.2 MB" },
    { id: "DOC-D02", name: "Fiber_Test_Results.xlsx", type: "XLSX", category: "Reports", date: "2024-04-14", size: "0.6 MB" },
    { id: "DOC-D03", name: "As-Built_Drawings_Rev4.dwg", type: "DWG", category: "Drawings", date: "2024-04-10", size: "42 MB" },
    { id: "DOC-D04", name: "ESD_Compliance_Certificate.pdf", type: "PDF", category: "Contracts", date: "2024-04-08", size: "0.3 MB" },
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
    { id: "T003", name: "Temporary Works & Hoarding", startDate: "2024-03-20", endDate: "2024-04-10", status: "Not Started", progress: 0, criticalPath: false, assignedTo: "BarrierWorks GmbH" },
    { id: "T004", name: "Piling & Deep Foundations", startDate: "2024-04-15", endDate: "2024-07-30", status: "Not Started", progress: 0, criticalPath: true, assignedTo: "GrundBau AG" },
    { id: "T005", name: "Dewatering System", startDate: "2024-04-01", endDate: "2024-05-15", status: "Not Started", progress: 0, criticalPath: true, assignedTo: "HydroConsult GmbH" },
    { id: "T006", name: "Utility Diversions", startDate: "2024-05-01", endDate: "2024-06-30", status: "Not Started", progress: 0, criticalPath: false, assignedTo: "StadtWerke Frankfurt" },
  ],
  rfis: [
    { id: "RFI-E01", subject: "Water Table Clarification", dateCreated: "2024-02-20", status: "Open", priority: "High", discipline: "Civil", impact: "Blocking Permit", assignedTo: "HydroConsult GmbH" },
    { id: "RFI-E02", subject: "Piling Rig Access Route", dateCreated: "2024-03-05", status: "Open", priority: "Medium", discipline: "Civil", impact: "Road closure permit needed.", assignedTo: "EuroBuild" },
    { id: "RFI-E03", subject: "Noise Barrier Height", dateCreated: "2024-03-12", status: "Draft", priority: "Low", discipline: "Architectural", impact: "Neighbor complaint risk.", assignedTo: "BarrierWorks GmbH" },
  ],
  financials: [
    { category: "Preliminaries", budget: 2000000, actual: 500000, forecast: 2500000, variance: -500000 },
    { category: "Legal & Permits", budget: 800000, actual: 600000, forecast: 950000, variance: -150000 },
    { category: "Piling", budget: 6000000, actual: 0, forecast: 6000000, variance: 0 },
    { category: "Utility Works", budget: 1500000, actual: 0, forecast: 1800000, variance: -300000 },
  ],
  inspections: [
    { id: "INSP-E01", date: "2024-03-15", location: "Borehole BH-07", result: "Pass", notes: "Groundwater sample within pH limits." },
    { id: "INSP-E02", date: "2024-03-20", location: "Site Boundary", result: "Pass with Conditions", notes: "Hoarding alignment needs 0.5m adjustment at NW corner." },
  ],
  workforce: { activeWorkers: 10, trend: { value: 0, direction: 'neutral', label: "Skeleton crew" } },
  safety: { incidents: 0, daysWithoutIncident: 45 },
  agentAlerts: [
    { id: "AGT-E01", agentType: "Schedule Guardian", title: "Regulatory Delay", description: "Municipal office announced 2-week backlog on environmental permits. Earliest approval now projected May 1.", severity: "Critical", confidenceScore: 99, status: "Verified", dateDetected: "2024-04-01", source: "Gov Portal Scraper" },
    { id: "AGT-E02", agentType: "Budget Watchdog", title: "Utility Fee Spike", description: "Local power authority increased connection fees by 12% effective next month. Unbudgeted variance: €150k.", severity: "Medium", confidenceScore: 95, status: "New", dateDetected: "2024-04-11", source: "Utility Provider API" },
    { id: "AGT-E03", agentType: "Supply Chain Scout", title: "Piling Rig Availability", description: "Preferred CFA rig contractor fully booked until June. Alternate subcontractor quoted 18% premium.", severity: "High", confidenceScore: 88, status: "New", dateDetected: "2024-04-13", source: "Subcontractor Portal" },
  ],
  documents: [
    { id: "DOC-E01", name: "Environmental_Impact_Study.pdf", type: "PDF", category: "Reports", date: "2024-01-10", size: "15 MB" },
    { id: "DOC-E02", name: "Geotechnical_Investigation.pdf", type: "PDF", category: "Reports", date: "2024-01-25", size: "8.4 MB" },
    { id: "DOC-E03", name: "Site_Layout_Plan.dwg", type: "DWG", category: "Drawings", date: "2024-02-10", size: "22 MB" },
    { id: "DOC-E04", name: "Permit_Application_Bundle.pdf", type: "PDF", category: "Contracts", date: "2024-02-01", size: "6.2 MB" },
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
    { id: "T603", name: "Interior Fit-Out L1-L3", startDate: "2024-02-15", endDate: "2024-05-15", status: "In Progress", progress: 55, criticalPath: false, assignedTo: "InteriorTech JP" },
    { id: "T604", name: "Generator & UPS Install", startDate: "2024-03-15", endDate: "2024-05-30", status: "In Progress", progress: 25, criticalPath: true, assignedTo: "PowerReliable" },
    { id: "T605", name: "BMS Integration", startDate: "2024-05-01", endDate: "2024-06-30", status: "Not Started", progress: 0, criticalPath: true, assignedTo: "Azbil Corp" },
    { id: "T606", name: "Fire Protection System", startDate: "2024-04-01", endDate: "2024-06-15", status: "In Progress", progress: 15, criticalPath: false, assignedTo: "Nohmi Bosai" },
  ],
  rfis: [
    { id: "RFI-F01", subject: "Damper Anchor Bolt Torque Spec", dateCreated: "2024-03-20", status: "Closed", priority: "High", discipline: "Structural", impact: "Resolved — JIS spec confirmed.", assignedTo: "Kajima Corp" },
    { id: "RFI-F02", subject: "Cladding Panel Wind Load Rating", dateCreated: "2024-04-05", status: "Open", priority: "High", discipline: "Architectural", impact: "Typhoon season rating may require upgrade.", assignedTo: "FacadePros" },
    { id: "RFI-F03", subject: "BMS Protocol Compatibility", dateCreated: "2024-04-10", status: "Open", priority: "Medium", discipline: "Electrical", impact: "BACnet vs Modbus — integration risk.", assignedTo: "Azbil Corp" },
  ],
  financials: [
    { category: "Structural", budget: 45000000, actual: 46000000, forecast: 46000000, variance: -1000000 },
    { category: "Facade", budget: 12000000, actual: 4000000, forecast: 12000000, variance: 0 },
    { category: "MEP", budget: 18000000, actual: 5500000, forecast: 18500000, variance: -500000 },
    { category: "Interior Fit-Out", budget: 8000000, actual: 3200000, forecast: 8000000, variance: 0 },
  ],
  inspections: [
    { id: "INSP-F10", date: "2024-04-10", location: "Base Isolators", result: "Pass", notes: "All specs met." },
    { id: "INSP-F11", date: "2024-04-12", location: "L2 Interior Walls", result: "Pass", notes: "Drywall plumb and level." },
    { id: "INSP-F12", date: "2024-03-28", location: "Generator Pad", result: "Pass with Conditions", notes: "Vibration dampers need torque re-check." },
  ],
  workforce: { activeWorkers: 210, trend: { value: 5, direction: 'up', label: "Peak workforce" } },
  safety: { incidents: 0, daysWithoutIncident: 500 },
  agentAlerts: [
    { id: "AGT-F01", agentType: "Supply Chain Scout", title: "Typhoon Logistics Impact", description: "Typhoon approaching shipping lane. Steel dampers likely delayed by 5 days. 12 containers affected.", severity: "High", confidenceScore: 85, status: "New", dateDetected: "2024-04-15", source: "Maritime Weather API" },
    { id: "AGT-F02", agentType: "Schedule Guardian", title: "Crane Resource Conflict", description: "Tower Crane 2 double-booked for Cladding and Generator loads next Tuesday AM.", severity: "Medium", confidenceScore: 80, status: "New", dateDetected: "2024-04-13", source: "Schedule Optimization AI" },
    { id: "AGT-F03", agentType: "Quality Control", title: "Cladding Sealant Adhesion Test", description: "Lab results show sealant adhesion 8% below spec at simulated wind speeds. Re-test with primer recommended.", severity: "Medium", confidenceScore: 91, status: "New", dateDetected: "2024-04-14", source: "QC Lab Reports" },
  ],
  documents: [
    { id: "DOC-F01", name: "Seismic_Calcs_Final.pdf", type: "PDF", category: "Drawings", date: "2023-11-05", size: "8.8 MB" },
    { id: "DOC-F02", name: "Facade_Shop_Drawings_Rev3.dwg", type: "DWG", category: "Drawings", date: "2024-02-20", size: "35 MB" },
    { id: "DOC-F03", name: "BMS_Spec_Sheet.pdf", type: "PDF", category: "Reports", date: "2024-03-15", size: "1.5 MB" },
    { id: "DOC-F04", name: "Fire_Protection_Compliance.pdf", type: "PDF", category: "Contracts", date: "2024-04-01", size: "2.8 MB" },
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
    { id: "T201", name: "Concrete Substructure", startDate: "2024-01-15", endDate: "2024-03-30", status: "Completed", progress: 100, criticalPath: true, assignedTo: "ConcreteAus" },
    { id: "T250", name: "Steel Superstructure", startDate: "2024-03-01", endDate: "2024-05-15", status: "In Progress", progress: 45, criticalPath: true, assignedTo: "Bluescope Steel" },
    { id: "T301", name: "L1 Electrical Rough-in", startDate: "2024-04-01", endDate: "2024-05-30", status: "In Progress", progress: 10, criticalPath: true, assignedTo: "SparkyAus" },
    { id: "T302", name: "Plumbing Rough-in", startDate: "2024-04-10", endDate: "2024-06-10", status: "Not Started", progress: 0, criticalPath: true, assignedTo: "FlowMasters" },
    { id: "T303", name: "Roof Steelwork", startDate: "2024-05-01", endDate: "2024-06-30", status: "Not Started", progress: 0, criticalPath: false, assignedTo: "Bluescope Steel" },
    { id: "T304", name: "Fire Services First Fix", startDate: "2024-05-15", endDate: "2024-07-15", status: "Not Started", progress: 0, criticalPath: false, assignedTo: "OzFire Protection" },
  ],
  rfis: [
    { id: "RFI-G05", subject: "Cable Tray Routing Conflict", dateCreated: "2024-04-12", status: "Open", priority: "Medium", discipline: "Electrical", impact: "Minor rework", assignedTo: "DesignConnect" },
    { id: "RFI-G06", subject: "Slab Penetration Waterproofing", dateCreated: "2024-04-08", status: "Open", priority: "High", discipline: "Structural", impact: "Below-grade water ingress risk.", assignedTo: "ConcreteAus" },
    { id: "RFI-G07", subject: "Electrical Panel Board Make", dateCreated: "2024-04-14", status: "Draft", priority: "Medium", discipline: "Electrical", impact: "Lead time differs by 6 weeks between makes.", assignedTo: "SparkyAus" },
  ],
  financials: [
    { category: "Concrete", budget: 8000000, actual: 7800000, forecast: 8000000, variance: 0 },
    { category: "Steel", budget: 12000000, actual: 4500000, forecast: 12500000, variance: -500000 },
    { category: "Electrical", budget: 15000000, actual: 1000000, forecast: 15500000, variance: -500000 },
    { category: "Plumbing", budget: 5000000, actual: 0, forecast: 5000000, variance: 0 },
  ],
  inspections: [
    { id: "INSP-G01", date: "2024-03-28", location: "Substructure Slab", result: "Pass", notes: "Rebar spacing and concrete strength verified." },
    { id: "INSP-G02", date: "2024-04-10", location: "L1 Wet Area", result: "Fail", notes: "Worker slip incident — housekeeping remediation required." },
  ],
  workforce: { activeWorkers: 65, trend: { value: -2, direction: 'down', label: "Absenteeism up" } },
  safety: { incidents: 1, daysWithoutIncident: 5 },
  agentAlerts: [
    { id: "AGT-G01", agentType: "Safety Sentinel", title: "Near Miss Reported", description: "Worker slipped on wet concrete on L1. No injury, but housekeeping flagged. 3rd incident this quarter.", severity: "Medium", confidenceScore: 100, status: "Verified", dateDetected: "2024-04-10", source: "Safety App" },
    { id: "AGT-G02", agentType: "Schedule Guardian", title: "Labor Strike Risk", description: "Local union voting on strike action for electrical trades next week. 40% chance of 2-week stoppage.", severity: "High", confidenceScore: 75, status: "New", dateDetected: "2024-04-14", source: "News API" },
    { id: "AGT-G03", agentType: "RFI Bottleneck Detector", title: "Electrical Schematic Stall", description: "Critical electrical schematics pending consultant review for 12 days. Blocking rough-in start for L1.", severity: "Critical", confidenceScore: 91, status: "New", dateDetected: "2024-04-13", source: "Procore" },
  ],
  documents: [
    { id: "DOC-G01", name: "Safety_Incident_Report_001.pdf", type: "PDF", category: "Reports", date: "2024-04-10", size: "0.2 MB" },
    { id: "DOC-G02", name: "Structural_Drawings_Rev2.dwg", type: "DWG", category: "Drawings", date: "2024-01-15", size: "48 MB" },
    { id: "DOC-G03", name: "Electrical_SLD_Draft.dwg", type: "DWG", category: "Drawings", date: "2024-03-20", size: "18 MB" },
    { id: "DOC-G04", name: "Union_Agreement_2024.pdf", type: "PDF", category: "Contracts", date: "2024-01-05", size: "1.1 MB" },
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
    { id: "T201", name: "Piling Works", startDate: "2024-01-10", endDate: "2024-02-28", status: "Completed", progress: 100, criticalPath: true, assignedTo: "FundacoesBR" },
    { id: "T205", name: "Substructure Concrete", startDate: "2024-02-01", endDate: "2024-05-01", status: "In Progress", progress: 60, criticalPath: true, assignedTo: "ConstrucaoBR" },
    { id: "T206", name: "Waterproofing & Drainage", startDate: "2024-04-15", endDate: "2024-06-15", status: "Not Started", progress: 0, criticalPath: false, assignedTo: "ImperBR" },
    { id: "T207", name: "Steel Superstructure", startDate: "2024-05-15", endDate: "2024-09-30", status: "Not Started", progress: 0, criticalPath: true, assignedTo: "GerdauSteel" },
    { id: "T208", name: "Generator Procurement & Install", startDate: "2024-06-01", endDate: "2024-10-30", status: "Not Started", progress: 0, criticalPath: true, assignedTo: "Cummins Brazil" },
  ],
  rfis: [
    { id: "RFI-H01", subject: "Pile Cap Reinforcement Detail", dateCreated: "2024-03-10", status: "Closed", priority: "High", discipline: "Structural", impact: "Resolved — additional rebar added.", assignedTo: "ConstrucaoBR" },
    { id: "RFI-H02", subject: "Generator Foundation Vibration Spec", dateCreated: "2024-04-05", status: "Open", priority: "High", discipline: "Mechanical", impact: "Foundation design pending — blocks T208.", assignedTo: "Cummins Brazil" },
    { id: "RFI-H03", subject: "Waterproofing Membrane Compatibility", dateCreated: "2024-04-12", status: "Open", priority: "Medium", discipline: "Civil", impact: "Chemical compatibility with tropical soil pH.", assignedTo: "ImperBR" },
  ],
  financials: [
    { category: "Piling", budget: 4000000, actual: 3800000, forecast: 3800000, variance: 200000 },
    { category: "Concrete", budget: 10000000, actual: 4500000, forecast: 10500000, variance: -500000 },
    { category: "Equipment Procurement", budget: 30000000, actual: 5000000, forecast: 34000000, variance: -4000000 },
    { category: "Steel", budget: 18000000, actual: 0, forecast: 18000000, variance: 0 },
  ],
  inspections: [
    { id: "INSP-H01", date: "2024-03-30", location: "Piles", result: "Pass", notes: "Load test passed. 450 ton capacity confirmed." },
    { id: "INSP-H02", date: "2024-04-10", location: "Pile Cap PC-12", result: "Pass with Conditions", notes: "Minor honeycombing — patch and re-inspect." },
    { id: "INSP-H03", date: "2024-04-12", location: "Excavation Zone", result: "Pass", notes: "No groundwater ingress detected." },
  ],
  workforce: { activeWorkers: 90, trend: { value: 5, direction: 'up', label: "Ramping up" } },
  safety: { incidents: 0, daysWithoutIncident: 110 },
  agentAlerts: [
    { id: "AGT-H01", agentType: "Budget Watchdog", title: "Forex Exposure", description: "BRL depreciated 5% against USD this week. Generator payments are in USD. Projected additional cost: R$2.1M.", severity: "High", confidenceScore: 98, status: "New", dateDetected: "2024-04-13", source: "Finance API" },
    { id: "AGT-H02", agentType: "Safety Sentinel", title: "Proximity Breach", description: "IoT wearables detected 3 instances of workers within swing radius of excavator in Zone B.", severity: "High", confidenceScore: 95, status: "New", dateDetected: "2024-04-12", source: "IoT Safety Net" },
    { id: "AGT-H03", agentType: "Productivity Benchmarker", title: "Concrete Cure Time", description: "High humidity (92%) extending concrete cure times by 24h. Schedule adjustment recommended for next 3 pours.", severity: "Low", confidenceScore: 85, status: "New", dateDetected: "2024-04-14", source: "Weather + Schedule AI" },
  ],
  documents: [
    { id: "DOC-H01", name: "Procurement_Log.xlsx", type: "XLSX", category: "Reports", date: "2024-04-01", size: "0.8 MB" },
    { id: "DOC-H02", name: "Pile_Load_Test_Report.pdf", type: "PDF", category: "Reports", date: "2024-03-30", size: "3.2 MB" },
    { id: "DOC-H03", name: "Generator_Specs_Cummins.pdf", type: "PDF", category: "Contracts", date: "2024-02-15", size: "5.5 MB" },
    { id: "DOC-H04", name: "Substructure_Drawings.dwg", type: "DWG", category: "Drawings", date: "2024-01-20", size: "28 MB" },
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
    { id: "T510", name: "Exterior Wall Panels", startDate: "2024-02-01", endDate: "2024-04-30", status: "In Progress", progress: 65, criticalPath: false, assignedTo: "CladIreland" },
    { id: "T520", name: "MEP First Fix", startDate: "2024-02-15", endDate: "2024-05-30", status: "In Progress", progress: 40, criticalPath: false, assignedTo: "DublinMEP" },
    { id: "T550", name: "Roof Waterproofing", startDate: "2024-03-15", endDate: "2024-05-15", status: "In Progress", progress: 30, criticalPath: true, assignedTo: "RainProof Ltd" },
    { id: "T560", name: "Generator & Fuel System", startDate: "2024-04-15", endDate: "2024-06-30", status: "Delayed", progress: 5, criticalPath: true, assignedTo: "PowerGen IE" },
    { id: "T570", name: "Raised Floor & Containment", startDate: "2024-05-15", endDate: "2024-07-15", status: "Not Started", progress: 0, criticalPath: false, assignedTo: "FloorTech EU" },
  ],
  rfis: [
    { id: "RFI-I01", subject: "Membrane Overlap Specification", dateCreated: "2024-04-05", status: "Open", priority: "High", discipline: "Architectural", impact: "Failed QC inspection — rework risk.", assignedTo: "RainProof Ltd" },
    { id: "RFI-I02", subject: "Generator Emission Certificate", dateCreated: "2024-04-10", status: "Open", priority: "High", discipline: "Mechanical", impact: "Customs hold — blocking delivery.", assignedTo: "PowerGen IE" },
    { id: "RFI-I03", subject: "MEP Corridor Clearance Height", dateCreated: "2024-03-28", status: "Closed", priority: "Medium", discipline: "Mechanical", impact: "Resolved — duct routing adjusted.", assignedTo: "DublinMEP" },
  ],
  financials: [
    { category: "Shell & Core", budget: 25000000, actual: 24000000, forecast: 25000000, variance: 0 },
    { category: "MEP", budget: 12000000, actual: 4200000, forecast: 12500000, variance: -500000 },
    { category: "Generators", budget: 8000000, actual: 500000, forecast: 8500000, variance: -500000 },
    { category: "Waterproofing", budget: 3000000, actual: 900000, forecast: 3200000, variance: -200000 },
  ],
  inspections: [
    { id: "INSP-I01", date: "2024-04-08", location: "Roof Zone A", result: "Pass", notes: "Membrane lap joints sealed correctly." },
    { id: "INSP-I02", date: "2024-04-13", location: "Roof Zone C", result: "Fail", notes: "Membrane thickness 1.6mm — below 2mm spec. Rework needed." },
    { id: "INSP-I03", date: "2024-04-10", location: "MEP Corridor L1", result: "Pass with Conditions", notes: "Support bracket spacing marginally over tolerance." },
  ],
  workforce: { activeWorkers: 120, trend: { value: 0, direction: 'neutral', label: "Stable" } },
  safety: { incidents: 0, daysWithoutIncident: 88 },
  agentAlerts: [
    { id: "AGT-I01", agentType: "Schedule Guardian", title: "Weather Alert", description: "Storm front approaching Dublin. Roof works unsafe for 3 days. 60mm rainfall expected.", severity: "Medium", confidenceScore: 92, status: "Verified", dateDetected: "2024-04-14", source: "Met Éireann" },
    { id: "AGT-I02", agentType: "Supply Chain Scout", title: "Generator Delivery Hold", description: "2x 2MW generators held at Dublin port due to missing EU emission certification paperwork.", severity: "Critical", confidenceScore: 99, status: "New", dateDetected: "2024-04-12", source: "Customs API" },
    { id: "AGT-I03", agentType: "Quality Control", title: "Membrane Thickness Fail", description: "Drone scan indicates waterproofing membrane in Zone C is 1.6mm — below 2mm spec. 200sqm affected.", severity: "High", confidenceScore: 95, status: "New", dateDetected: "2024-04-13", source: "Drone Deploy" },
  ],
  documents: [
    { id: "DOC-I01", name: "Safety_Plan_Rain.pdf", type: "PDF", category: "Reports", date: "2023-10-01", size: "3.5 MB" },
    { id: "DOC-I02", name: "Roof_Waterproofing_Spec.pdf", type: "PDF", category: "Contracts", date: "2024-02-01", size: "2.2 MB" },
    { id: "DOC-I03", name: "Generator_Purchase_Order.xlsx", type: "XLSX", category: "Invoices", date: "2024-03-15", size: "0.4 MB" },
    { id: "DOC-I04", name: "MEP_Coordination_Model.dwg", type: "DWG", category: "Drawings", date: "2024-03-01", size: "55 MB" },
  ]
};

export const PROJECTS = [PROJECT_A, PROJECT_B, PROJECT_C, PROJECT_D, PROJECT_E, PROJECT_F, PROJECT_G, PROJECT_H, PROJECT_I];