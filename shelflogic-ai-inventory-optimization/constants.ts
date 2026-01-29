
import { Store, Opportunity, Product } from './types';

// Mock Products
export const PRODUCT_CHERRY: Product = {
  sku_id: "CS-998",
  name: "Brand X Cherry Schnapps",
  category: "Liqueurs",
  price: 18.50,
  image: "assets/product-cherry-schnapps.svg", 
  velocity_target_store: 0.3, 
  velocity_lookalike_store: 0, 
};

export const PRODUCT_APPLE: Product = {
  sku_id: "AL-400",
  name: "Brand Y Apple Liqueur",
  category: "Liqueurs",
  price: 22.00,
  image: "assets/product-apple-liqueur.svg", 
  velocity_target_store: 0,
  velocity_lookalike_store: 42, 
};

export const PRODUCT_VODKA: Product = {
  sku_id: "VD-101",
  name: "Crystal Peak Vodka 750ml",
  category: "Spirits",
  price: 29.99,
  image: "assets/product-vodka.svg",
  velocity_target_store: 12,
  velocity_lookalike_store: 25,
};

export const PRODUCT_BEER: Product = {
  sku_id: "CB-555",
  name: "River City IPA 6pk",
  category: "Beer",
  price: 11.49,
  image: "assets/product-ipa-beer.svg", 
  velocity_target_store: 0, 
  velocity_lookalike_store: 45, 
};

export const PRODUCT_TEQUILA: Product = {
  sku_id: "TQ-888",
  name: "Gato Negro Tequila Reposado",
  category: "Spirits",
  price: 45.99,
  image: "assets/product-tequila-reposado.svg",
  velocity_target_store: 5,
  velocity_lookalike_store: 8,
};

export const PRODUCT_PREMIUM_TEQUILA: Product = {
  sku_id: "TQ-999",
  name: "Don Oro Extra Añejo",
  category: "Spirits",
  price: 159.99,
  image: "assets/product-tequila-anejo.svg",
  velocity_target_store: 1,
  velocity_lookalike_store: 12,
};

export const PRODUCT_WHISKEY: Product = {
  sku_id: "WH-202",
  name: "Old Oak Bourbon 750ml",
  category: "Spirits",
  price: 42.00,
  image: "assets/product-bourbon.svg",
  velocity_target_store: 15,
  velocity_lookalike_store: 18,
};

export const PRODUCT_CHARDONNAY: Product = {
  sku_id: "WN-303",
  name: "Golden Vine Chardonnay",
  category: "Wine",
  price: 14.99,
  image: "assets/product-chardonnay.svg",
  velocity_target_store: 8,
  velocity_lookalike_store: 30,
};

export const PRODUCT_COOLER: Product = {
  sku_id: "CL-777",
  name: "Frostbite Hard Seltzer 12pk",
  category: "Beer",
  price: 19.99,
  image: "assets/product-seltzer.svg",
  velocity_target_store: 2,
  velocity_lookalike_store: 15,
};

export const PRODUCT_SNACK_BOX: Product = {
  sku_id: "SN-101",
  name: "Artisan Meat & Cheese Board",
  category: "Fresh",
  price: 24.99,
  image: "assets/product-snack-box.svg",
  velocity_target_store: 5,
  velocity_lookalike_store: 60,
};

// Mock Stores
// Updated coordinates to fit within h-64 (approx 256px height) and w-full container
export const STORE_DUBUQUE: Store = {
  store_id: "104",
  name: "Dubuque (Hy-Vee #104)",
  location: "Dubuque, IA",
  coordinates: { x: 200, y: 60 },
  cluster: "Urban-Midwest-B",
  metrics: {
    monthly_revenue: 1250000,
    foot_traffic: 45000,
    alcohol_sales_mix: 0.18,
    avg_basket_size: 62.50,
  },
  demographics: {
    median_income: 58000,
    median_age: 36,
    urbanicity_score: 65,
  },
  weather: { condition: 'HEATWAVE', temp: 95, forecast_impact: '+22% Chilled Bev Demand' },
  compliance_score: 88,
};

export const STORE_DAVENPORT: Store = {
  store_id: "202",
  name: "Davenport (Hy-Vee #202)",
  location: "Davenport, IA",
  coordinates: { x: 350, y: 100 },
  cluster: "Urban-Midwest-B",
  metrics: {
    monthly_revenue: 1310000,
    foot_traffic: 47500,
    alcohol_sales_mix: 0.19,
    avg_basket_size: 64.00,
  },
  demographics: {
    median_income: 59200,
    median_age: 35,
    urbanicity_score: 68,
  },
  weather: { condition: 'SUNNY', temp: 82, forecast_impact: 'Stable' },
  compliance_score: 94,
};

export const STORE_AMES: Store = {
    store_id: "305",
    name: "Ames (Hy-Vee #305)",
    location: "Ames, IA",
    coordinates: { x: 80, y: 180 },
    cluster: "University-Town-A",
    metrics: {
        monthly_revenue: 980000,
        foot_traffic: 38000,
        alcohol_sales_mix: 0.22,
        avg_basket_size: 45.00
    },
    demographics: {
        median_income: 42000,
        median_age: 24,
        urbanicity_score: 75
    },
    weather: { condition: 'SUNNY', temp: 78, forecast_impact: 'Local Event Boost Predicted' },
    compliance_score: 72,
};

export const STORE_DES_MOINES: Store = {
  store_id: "401",
  name: "Des Moines (Hy-Vee #401)",
  location: "Des Moines, IA",
  coordinates: { x: 120, y: 140 },
  cluster: "Metropolitan-Elite-A",
  metrics: {
    monthly_revenue: 2100000,
    foot_traffic: 72000,
    alcohol_sales_mix: 0.24,
    avg_basket_size: 78.00,
  },
  demographics: {
    median_income: 85000,
    median_age: 32,
    urbanicity_score: 90,
  },
  weather: { condition: 'RAINY', temp: 65, forecast_impact: 'Indoor Shopping Surge' },
  compliance_score: 91,
};

export const STORE_CEDAR_RAPIDS: Store = {
  store_id: "512",
  name: "Cedar Rapids (Hy-Vee #512)",
  location: "Cedar Rapids, IA",
  coordinates: { x: 280, y: 90 },
  cluster: "Industrial-Hub-C",
  metrics: {
    monthly_revenue: 1150000,
    foot_traffic: 41000,
    alcohol_sales_mix: 0.15,
    avg_basket_size: 58.00,
  },
  demographics: {
    median_income: 52000,
    median_age: 41,
    urbanicity_score: 60,
  },
  weather: { condition: 'SUNNY', temp: 75, forecast_impact: 'Stable' },
  compliance_score: 82,
};

// Opportunities for Category Managers (Spirits, Beer, Wine)
export const OPP_SPIRITS_SWAP: Opportunity = {
  id: "OPP-SPIR-001",
  type: "ASSORTMENT_SWAP",
  status: "NEW",
  target_store_id: STORE_AMES.store_id,
  lookalike_store_id: STORE_DAVENPORT.store_id,
  delist_candidate: PRODUCT_CHERRY,
  add_candidate: PRODUCT_TEQUILA,
  projected_lift: 1200,
  match_score: 0.96,
  match_reasons: ["Premium Spirit Demand in College Clusters", "High Holiday Velocity"],
  created_at: new Date().toISOString(),
};

export const OPP_WEATHER_BOOST: Opportunity = {
  id: "OPP-WTH-005",
  type: "WEATHER_TRIGGER",
  status: "NEW",
  target_store_id: STORE_DUBUQUE.store_id,
  product: PRODUCT_COOLER,
  projected_lift: 3800, // CRITICAL LIFT
  match_score: 0.99,
  match_reasons: ["Upcoming Heatwave (95°F+)", "Historical 3x multiplier on Hard Seltzers during peaks"],
  created_at: new Date().toISOString(),
};

export const OPP_COMPLIANCE_DUBUQUE: Opportunity = {
  id: "OPP-VIS-007",
  type: "SHELF_COMPLIANCE",
  status: "NEW",
  target_store_id: STORE_DUBUQUE.store_id,
  product: PRODUCT_APPLE,
  projected_lift: 850,
  match_score: 1.0,
  match_reasons: ["IoT Camera Detects Planogram Mismatch", "Approved Swap (OPP-SPIR-001) Not Executed Physically"],
  created_at: new Date().toISOString(),
};

export const OPP_PREMIUM_SWAP_DM: Opportunity = {
  id: "OPP-PRM-009",
  type: "ASSORTMENT_SWAP",
  status: "NEW",
  target_store_id: STORE_DES_MOINES.store_id,
  lookalike_store_id: STORE_DAVENPORT.store_id,
  delist_candidate: PRODUCT_WHISKEY,
  add_candidate: PRODUCT_PREMIUM_TEQUILA,
  projected_lift: 5200, // VERY HIGH URGENCY
  match_score: 0.98,
  match_reasons: ["High-income demographic mismatch", "Premium tequila trend in metro-elite clusters"],
  created_at: new Date().toISOString(),
};

export const OPP_STOCK_OUT_CR: Opportunity = {
  id: "OPP-LOG-012",
  type: "INVENTORY_REBALANCE",
  status: "NEW",
  target_store_id: STORE_CEDAR_RAPIDS.store_id,
  lookalike_store_id: STORE_DAVENPORT.store_id,
  product: PRODUCT_VODKA,
  projected_lift: 2100,
  match_score: 0.95,
  match_reasons: ["Cedar Rapids stockout predicted in 48h", "Davenport has 65 days of safety stock surplus"],
  created_at: new Date().toISOString(),
};

export const OPP_MUSIC_FESTIVAL_DM: Opportunity = {
  id: "OPP-EVT-015",
  type: "LOCAL_EVENT",
  status: "NEW",
  target_store_id: STORE_DES_MOINES.store_id,
  product: PRODUCT_SNACK_BOX,
  event_name: "80-35 Music Festival",
  projected_lift: 4500, // URGENT
  match_score: 0.97,
  match_reasons: ["Festival proximity (0.5 miles)", "Historical grab-and-go surge during urban events"],
  created_at: new Date().toISOString(),
};

export const OPP_COMPETITOR_PRICE_CUT: Opportunity = {
  id: "OPP-COMP-022",
  type: "COMPETITOR_GAP",
  status: "NEW",
  target_store_id: "104", // Dubuque
  product: PRODUCT_WHISKEY, // Reusing whiskey
  competitor_price: 38.99,
  projected_lift: 1850,
  match_score: 0.92,
  match_reasons: ["Competitor 'Total Wine' cut price by 12% yesterday", "High risk of customer churn for loyal whiskey buyers"],
  created_at: new Date().toISOString(),
};

export const OPP_EXCESS_STOCK_SWAP: Opportunity = {
  id: "OPP-INV-034",
  type: "INVENTORY_REBALANCE",
  status: "NEW",
  target_store_id: "401", // Des Moines
  lookalike_store_id: "512", // Cedar Rapids
  product: PRODUCT_BEER,
  projected_lift: 1400,
  match_score: 0.89,
  match_reasons: ["Des Moines holding 45 days supply (Target: 15)", "Cedar Rapids approaching stockout on same SKU"],
  created_at: new Date().toISOString(),
};

export const OPP_LOCAL_EVENT_SPORTS: Opportunity = {
  id: "OPP-EVT-041",
  type: "LOCAL_EVENT",
  status: "NEW",
  target_store_id: "305", // Ames (University town)
  product: PRODUCT_COOLER,
  event_name: "Varsity Football vs State",
  projected_lift: 2900,
  match_score: 0.98,
  match_reasons: ["Home Game scheduled for Saturday", "Historical lift of +400% on coolers during rivalry games"],
  created_at: new Date().toISOString(),
};

export const OPP_MARGIN_OPPORTUNITY: Opportunity = {
  id: "OPP-PRC-055",
  type: "PRICE_OPTIMIZATION",
  status: "NEW",
  target_store_id: "202", // Davenport
  product: PRODUCT_CHARDONNAY,
  projected_lift: 1150,
  match_score: 0.85,
  match_reasons: ["Demand curve indicates inelasticity at $14.99", "Opportunity to increase to $16.49 with <2% volume loss"],
  created_at: new Date().toISOString(),
};

export const ALL_OPPORTUNITIES = [
  OPP_SPIRITS_SWAP, 
  OPP_WEATHER_BOOST, 
  OPP_COMPLIANCE_DUBUQUE, 
  OPP_PREMIUM_SWAP_DM, 
  OPP_STOCK_OUT_CR,
  OPP_MUSIC_FESTIVAL_DM,
  OPP_COMPETITOR_PRICE_CUT,
  OPP_EXCESS_STOCK_SWAP,
  OPP_LOCAL_EVENT_SPORTS,
  OPP_MARGIN_OPPORTUNITY
];
export const ALL_STORES = [STORE_DUBUQUE, STORE_DAVENPORT, STORE_AMES, STORE_DES_MOINES, STORE_CEDAR_RAPIDS];
