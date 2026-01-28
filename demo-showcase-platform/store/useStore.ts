
import { create } from 'zustand';
import { DemoState, VerticalConfig } from '../types';
import { MOCK_DATA, VERTICALS } from '../constants';

interface StoreState extends DemoState {
  demoData: typeof MOCK_DATA;
  availableVerticals: VerticalConfig[];
  isResetting: boolean;
  setVertical: (vertical: string | null) => void;
  setPitchVertical: (verticalId: string | null) => void;
  toggleQuickPitch: (isOpen: boolean) => void;
  setAdminOpen: (isOpen: boolean) => void;
  addVertical: (vertical: VerticalConfig) => void;
  setIdle: (isIdle: boolean) => void;
  updateActivity: () => void;
  resetDemo: () => void;
  updateDemoData: (vertical: string, newData: any) => void;
}

export const useStore = create<StoreState>((set) => ({
  currentVertical: null,
  pitchVerticalId: null,
  isQuickPitchOpen: false,
  isAdminOpen: false,
  isIdle: false,
  isResetting: false,
  lastActivity: Date.now(),
  availableVerticals: [...VERTICALS],
  demoData: JSON.parse(JSON.stringify(MOCK_DATA)),

  setVertical: (vertical) => set({ currentVertical: vertical }),
  setPitchVertical: (verticalId) => set({ pitchVerticalId: verticalId }),
  toggleQuickPitch: (isOpen) => set({ isQuickPitchOpen: isOpen }),
  setAdminOpen: (isOpen) => set({ isAdminOpen: isOpen }),
  addVertical: (vertical) => set((state) => ({ 
    availableVerticals: [...state.availableVerticals, vertical] 
  })),
  setIdle: (isIdle) => set({ isIdle }),
  updateActivity: () => set({ lastActivity: Date.now(), isIdle: false }),
  resetDemo: () => {
    set({ isResetting: true });
    setTimeout(() => {
      set({
        currentVertical: null,
        pitchVerticalId: null,
        isQuickPitchOpen: false,
        isAdminOpen: false,
        isResetting: false,
        availableVerticals: [...VERTICALS],
        demoData: JSON.parse(JSON.stringify(MOCK_DATA)),
      });
    }, 1000);
  },
  updateDemoData: (vertical, newData) => set((state) => ({
    demoData: { ...state.demoData, [vertical]: newData }
  }))
}));
