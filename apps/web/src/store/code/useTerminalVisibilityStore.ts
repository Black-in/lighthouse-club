/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { create } from 'zustand';

interface TerminalVisibilityState {
    showTerminal: boolean;
    setShowTerminal: (value: boolean) => void;
    toggleTerminal: () => void;
}

export const useTerminalVisibilityStore = create<TerminalVisibilityState>((set) => ({
    showTerminal: false,
    setShowTerminal: (value: boolean) => set({ showTerminal: value }),
    toggleTerminal: () => set((state) => ({ showTerminal: !state.showTerminal })),
}));
