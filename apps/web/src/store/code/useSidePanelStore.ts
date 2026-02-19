/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { SidePanelValues } from '@/src/components/code/EditorSidePanel';
import { create } from 'zustand';

interface SidePanelState {
    currentState: SidePanelValues;
    setCurrentState: (value: SidePanelValues) => void;
}

// use SidePanelValues and remove string
export const useSidePanelStore = create<SidePanelState>((set) => ({
    currentState: SidePanelValues.FILE,
    setCurrentState: (value: SidePanelValues) => set({ currentState: value }),
}));
