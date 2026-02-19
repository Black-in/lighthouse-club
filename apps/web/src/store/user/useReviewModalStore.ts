/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { create } from 'zustand';

interface ReviewModalData {
    open: boolean;
    contractId: string | null;
    show: (contractId: string) => void;
    hide: () => void;
}

export const useReviewModalStore = create<ReviewModalData>((set) => ({
    open: false,
    contractId: null,
    show: (contractId) => set({ open: true, contractId }),
    hide: () => set({ open: false, contractId: null }),
}));
