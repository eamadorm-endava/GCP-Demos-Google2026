export type ShipmentStatus = 'Pending' | 'In Transit' | 'Delivered' | 'Delayed' | 'Requires Action' | 'Cancelled';

export type MilestoneStatus = 'Pending' | 'In Progress' | 'Completed' | 'Delayed' | 'Requires Action' | 'Cancelled';

export type MilestoneName = 
  | 'bookingConfirmed'
  | 'cargoReceivedOrigin'
  | 'departedFromOrigin'
  | 'customsClearanceDest'
  | 'finalDelivery';

export interface User {
  id: string;
  name: string;
  role: 'Manager' | 'Specialist';
}

export interface Document {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export interface Milestone {
  name: MilestoneName;
  status: MilestoneStatus;
  date: string | null;
  documents: Document[];
  details?: string;
}

export interface Party {
  name: string;
  role: 'Customer' | 'Farmer' | 'Agent' | 'Driver';
}

export interface Message {
  id: string;
  sender: Party;
  text: string;
  timestamp: string;
}

export interface ShipmentCost {
    freight: number;
    insurance: number;
    customs: number;
    total: number;
}

export interface RiskAnalysisResponse {
  riskLevel: 'Low' | 'Medium' | 'High';
  analysisPoints: string[];
}

export interface ShipmentSummary {
    summary: string;
    highlights: string[];
}

export type FarmStatus = 'Approved' | 'Pending Review' | 'Rejected';

export interface Farm {
  id: string;
  name: string;
  originCountry: 'Colombia' | 'Ecuador' | 'Costa Rica' | 'Honduras';
  contact: {
    name: string;
    email: string;
  };
  address: {
    line1: string;
    municipality: string;
    postalCode?: string;
  };
  status: FarmStatus;
  registrationDocs: {
    [docName: string]: {
        required: boolean;
        uploaded: boolean;
    }
  }
}

export interface Shipment {
  id:string;
  mawb: string;
  hawb: string;
  customer: string;
  farmId: string; // Link to the Farm
  origin: { country: string; city: string; lat: number; lng: number; };
  destination: { country: string; city: string; lat: number; lng: number; };
  status: ShipmentStatus;
  estimatedDeliveryDate: string;
  commodity: string;
  milestones: Milestone[];
  documents: Document[];
  communication: Message[];
  attachedParties: Party[];
  trackingUrl: string;
  cost: ShipmentCost;
}
