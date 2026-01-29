
export interface Product {
  sku_id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  velocity_target_store: number; // monthly units
  velocity_lookalike_store: number; // monthly units
}

export interface WeatherInfo {
  condition: 'SUNNY' | 'RAINY' | 'HEATWAVE' | 'SNOW';
  temp: number;
  forecast_impact: string;
}

export interface Store {
  store_id: string;
  name: string;
  location: string;
  coordinates: { x: number; y: number };
  cluster: string;
  metrics: {
    monthly_revenue: number;
    foot_traffic: number;
    alcohol_sales_mix: number;
    avg_basket_size: number;
  };
  demographics: {
    median_income: number;
    median_age: number;
    urbanicity_score: number;
  };
  weather?: WeatherInfo;
  compliance_score?: number; // 0-100
}

export type OpportunityType = 'ASSORTMENT_SWAP' | 'PRICE_OPTIMIZATION' | 'INVENTORY_REBALANCE' | 'PROMOTION_WATCH' | 'COMPETITOR_GAP' | 'WEATHER_TRIGGER' | 'LOCAL_EVENT' | 'SHELF_COMPLIANCE';

export interface Opportunity {
  id: string;
  type: OpportunityType;
  status: 'NEW' | 'ANALYZING' | 'APPROVED' | 'REJECTED';
  target_store_id: string;
  lookalike_store_id?: string;
  delist_candidate?: Product;
  add_candidate?: Product;
  product?: Product;
  projected_lift: number;
  match_score: number;
  match_reasons: string[];
  created_at: string;
  competitor_price?: number;
  event_name?: string;
}

export interface AgentInsight {
  headline: string;
  reasoning: string;
  confidence: number;
}

export type UserRole = 'HQ' | 'STORE' | 'CATEGORY_MGR';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  storeId?: string;
  assignedCategory?: string;
}

// --- NEW DYNAMIC CONFIG TYPES ---

export interface DynamicMetric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
}

export interface VerticalConfig {
  id: string;
  title: string;
  icon: 'shopping-cart' | 'stethoscope' | 'landmark' | 'factory' | 'globe';
  color: string; // Tailwind class like 'bg-blue-600'
  externalUrl?: string; // If this demo links out
  isAiGenerated?: boolean;
  pitch: {
    problem: string;
    solution: string;
    talkingPoints: string[];
  };
  dynamicData?: {
    stats: DynamicMetric[];
    logs: { id: string; event: string; status: string; timestamp: string }[];
    chartData: { name: string; value: number }[];
  }
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}
