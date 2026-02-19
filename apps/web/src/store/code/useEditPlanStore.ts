/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { PlanMessage } from '@lighthouse/types';
import { create } from 'zustand';

interface EditPlanStore {
    message: PlanMessage | null;
    setMessage: (message: PlanMessage) => void;
}

export const useEditPlanStore = create<EditPlanStore>((set) => ({
    message: null,
    setMessage: (message: PlanMessage) => set({ message }),
}));
