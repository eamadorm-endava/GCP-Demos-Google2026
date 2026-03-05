
import { create } from 'zustand';
import { VerticalConfig, User, UserRole, Opportunity, Store } from '../types';
import { ALL_OPPORTUNITIES, ALL_STORES } from '../constants';

// Default Demo Config (Retail)
const DEFAULT_VERTICAL: VerticalConfig = {
  id: 'retail-liquor',
  title: 'Retail Intelligence',
  icon: 'shopping-cart',
  color: 'bg-cyan-600',
  pitch: {
    problem: "Inventory distortion costs retailers $1.1T annually due to overstocks and out-of-stocks.",
    solution: "ShelfLogic acts as an autonomous agent, proactively balancing inventory and optimizing assortment.",
    talkingPoints: [
        "Autonomous Assortment Optimization",
        "Dynamic Price Elasticity Modeling",
        "Predictive Inventory Rebalancing"
    ]
  },
  dynamicData: {
      stats: [
          { label: 'Network Revenue', value: '$8.42M', trend: 'up', trendValue: '+12%' },
          { label: 'Inventory Health', value: '91.4%', trend: 'up', trendValue: '+2.1%' },
          { label: 'Urgent Actions', value: '14', trend: 'neutral', trendValue: 'NEW' },
          { label: 'Dead Stock Risk', value: '$24.2k', trend: 'down', trendValue: '-8%' }
      ],
      logs: [],
      chartData: []
  }
};

type View = 'dashboard' | 'analysis' | 'ml_lab' | 'stores' | 'store_detail' | 'shelf_vision';

interface AppState {
  // Config State
  currentVertical: VerticalConfig;
  availableVerticals: VerticalConfig[];
  
  // UI State
  isAdminOpen: boolean;
  isQuickPitchOpen: boolean;
  
  // App Navigation State
  currentView: View;
  viewHistory: View[]; // For back navigation
  
  // Data / Session State
  user: User | null;
  selectedOpportunityId: string | null;
  selectedStoreId: string | null;

  // Computed State (Selectors)
  getSelectedOpportunity: () => Opportunity | null;
  getSelectedStore: () => Store | null;

  // Actions
  login: (role: UserRole) => void;
  logout: () => void;
  
  // Navigation Actions
  setCurrentView: (view: View) => void;
  goBack: () => void;
  viewOpportunity: (id: string) => void;
  viewStore: (id: string) => void;

  // Config Actions
  setVertical: (id: string) => void;
  addVertical: (config: VerticalConfig) => void;
  setAdminOpen: (isOpen: boolean) => void;
  toggleQuickPitch: (isOpen: boolean) => void;
  pitchVerticalId: string | null;
  setPitchVertical: (id: string | null) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // --- STATE ---
  currentVertical: DEFAULT_VERTICAL,
  availableVerticals: [DEFAULT_VERTICAL],
  isAdminOpen: false,
  isQuickPitchOpen: false,
  currentView: 'dashboard',
  viewHistory: ['dashboard'],
  user: null,
  selectedOpportunityId: null,
  selectedStoreId: null,
  pitchVerticalId: null,

  // --- SELECTORS ---
  getSelectedOpportunity: () => {
    const id = get().selectedOpportunityId;
    return ALL_OPPORTUNITIES.find(opp => opp.id === id) || null;
  },
  getSelectedStore: () => {
    const id = get().selectedStoreId;
    return ALL_STORES.find(store => store.store_id === id) || null;
  },
  
  // --- ACTIONS ---
  login: (role: UserRole) => set({
    user: {
        id: role === 'HQ' ? 'hq_01' : role === 'STORE' ? 'mgr_104' : 'cat_01',
        name: role === 'HQ' ? 'Sarah HQ' : role === 'STORE' ? 'Alex Store' : 'James Category',
        role: role,
        storeId: role === 'STORE' ? '104' : undefined,
        assignedCategory: role === 'CATEGORY_MGR' ? 'Spirits' : undefined
    },
    currentView: 'dashboard',
    viewHistory: ['dashboard']
  }),

  logout: () => set({
    user: null,
    selectedOpportunityId: null,
    selectedStoreId: null,
    currentView: 'dashboard',
    viewHistory: ['dashboard']
  }),

  setCurrentView: (view: View) => set(state => {
    // Avoid pushing duplicates if view is re-selected
    const newHistory = [...state.viewHistory];
    if (newHistory[newHistory.length - 1] !== view) {
      newHistory.push(view);
    }
    return { currentView: view, viewHistory: newHistory };
  }),

  goBack: () => set(state => {
    const history = [...state.viewHistory];
    history.pop();
    const previousView = history.length > 0 ? history[history.length - 1] : 'dashboard';
    return { currentView: previousView, viewHistory: history };
  }),

  viewOpportunity: (id: string) => set(state => {
    const newHistory = [...state.viewHistory, 'analysis' as View];
    return {
      selectedOpportunityId: id,
      currentView: 'analysis',
      viewHistory: newHistory
    };
  }),

  viewStore: (id: string) => set(state => {
    const newHistory = [...state.viewHistory, 'store_detail' as View];
    return {
      selectedStoreId: id,
      currentView: 'store_detail',
      viewHistory: newHistory
    };
  }),

  setVertical: (id) => set((state) => ({ 
    currentVertical: state.availableVerticals.find(v => v.id === id) || state.availableVerticals[0] 
  })),

  addVertical: (config) => set((state) => ({ 
    availableVerticals: [...state.availableVerticals, config],
    pitchVerticalId: config.id,
    isQuickPitchOpen: true // Auto open pitch when new demo is generated
  })),

  setAdminOpen: (isOpen) => set({ isAdminOpen: isOpen }),
  toggleQuickPitch: (isOpen) => set({ isQuickPitchOpen: isOpen }),
  setPitchVertical: (id) => set({ pitchVerticalId: id }),
}));
