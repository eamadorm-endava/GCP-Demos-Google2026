
export enum VerticalType {
  RETAIL = 'retail',
  HEALTHCARE = 'healthcare',
  FINTECH = 'fintech',
  MANUFACTURING = 'manufacturing',
  EXTERNAL = 'external'
}

export interface QuickPitchData {
  problem: string;
  solution: string;
  talkingPoints: string[];
}

export interface DynamicDemoData {
  stats: { label: string; value: string; trend?: 'up' | 'down' | 'stable' }[];
  logs: { id: string; event: string; status: string; timestamp: string }[];
  chartData: { name: string; value: number }[];
}

export interface VerticalConfig {
  id: string;
  title: string;
  icon: string;
  color: string;
  pitch: QuickPitchData;
  externalUrl?: string;
  isAiGenerated?: boolean;
  dynamicData?: DynamicDemoData;
}

export interface DemoState {
  currentVertical: string | null;
  pitchVerticalId: string | null;
  isQuickPitchOpen: boolean;
  isAdminOpen: boolean;
  isIdle: boolean;
  lastActivity: number;
}
