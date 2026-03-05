/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { Line } from '@/src/types/terminal_types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface TerminalLogStore {
    logs: Line[];
    isCommandRunning: boolean;
    terminalLoader: boolean;
    setTerminalLoader: (value: boolean) => void;
    setIsCommandRunning: (value: boolean) => void;
    addLog: (log: Line) => void;
    setLogs: (logs: Line[]) => void;
    clearLogs: () => void;
}

const MAX_TERMINAL_LINES = 300;

export const useTerminalLogStore = create<TerminalLogStore>()(
    persist(
        (set, get) => ({
            logs: [],
            isCommandRunning: false,
            terminalLoader: false,
            setTerminalLoader(value) {
                return set({
                    terminalLoader: value,
                });
            },
            setIsCommandRunning: (value: boolean) => set({ isCommandRunning: value }),
            addLog: (log: Line) =>
                set({
                    logs: [...get().logs, log].slice(-MAX_TERMINAL_LINES),
                }),

            setLogs: (logs: Line[]) =>
                set({
                    logs: logs.slice(-MAX_TERMINAL_LINES),
                }),

            clearLogs: () => set({ logs: [] }),
        }),
        {
            name: 'blackin.terminal.logs.v2',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ logs: state.logs.slice(-MAX_TERMINAL_LINES) }),
        },
    ),
);
