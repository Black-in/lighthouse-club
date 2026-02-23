/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface TerminalVisibilityState {
    showTerminal: boolean;
    setShowTerminal: (value: boolean) => void;
    toggleTerminal: () => void;
}

export const useTerminalVisibilityStore = create<TerminalVisibilityState>()(
    persist(
        (set) => ({
            showTerminal: false,
            setShowTerminal: (value: boolean) => set({ showTerminal: value }),
            toggleTerminal: () => set((state) => ({ showTerminal: !state.showTerminal })),
        }),
        {
            name: 'blackin.terminal.visibility.v1',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ showTerminal: state.showTerminal }),
        },
    ),
);
