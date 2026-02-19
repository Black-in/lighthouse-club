/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { create } from 'zustand';

interface CommandHistoryStore {
    history: string[];
    currentIndex: number;
    addCommand: (command: string) => void;
    moveUp: () => string | null;
    moveDown: () => string | null;
    resetIndex: () => void;
}

export const useCommandHistoryStore = create<CommandHistoryStore>((set, get) => ({
    history: [],
    currentIndex: -1,

    addCommand: (command: string) => {
        const trimmed = command.trim();
        if (!trimmed) return;

        set((state) => ({
            history: [...state.history.slice(-9), trimmed],
            currentIndex: -1,
        }));
    },

    moveUp: () => {
        const { history, currentIndex } = get();
        if (history.length === 0) return null;

        const newIndex = currentIndex === -1 ? history.length - 1 : Math.max(0, currentIndex - 1);

        set({ currentIndex: newIndex });
        return history[newIndex];
    },

    moveDown: () => {
        const { history, currentIndex } = get();
        if (currentIndex === -1) return null;

        const newIndex = currentIndex + 1;

        if (newIndex >= history.length) {
            set({ currentIndex: -1 });
            return '';
        }

        set({ currentIndex: newIndex });
        return history[newIndex];
    },

    resetIndex: () => set({ currentIndex: -1 }),
}));
