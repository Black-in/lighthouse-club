/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { create } from 'zustand';

interface LimitStoreData {
    showContractLimit: boolean;
    setShowContractLimit: (value: boolean) => void;

    showMessageLimit: boolean;
    setShowMessageLimit: (value: boolean) => void;

    showRegenerateTime: string | null;
    setShowRegenerateTime: (showRegenerateTime: string) => void;
}

export const useLimitStore = create<LimitStoreData>((set) => ({
    showContractLimit: false,
    showMessageLimit: false,
    showRegenerateTime: null,

    setShowContractLimit: (value) => set({ showContractLimit: value }),
    setShowMessageLimit: (value) => set({ showMessageLimit: value }),
    setShowRegenerateTime: (value) => set({ showRegenerateTime: value }),
}));
