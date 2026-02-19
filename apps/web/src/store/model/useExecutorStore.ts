/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { EXECUTOR } from '@lighthouse/types';
import { create } from 'zustand';

interface ModelState {
    executor: EXECUTOR;
    editExeutorPlanPanel: boolean;
    setEditExeutorPlanPanel: (value: boolean) => void;
    setExecutor: (executor: EXECUTOR) => void;
}

export const useExecutorStore = create<ModelState>((set) => ({
    executor: EXECUTOR.AGENTIC,
    editExeutorPlanPanel: false,
    setEditExeutorPlanPanel: function (value: boolean) {
        set({ editExeutorPlanPanel: value });
    },
    setExecutor: (executor: EXECUTOR) => set({ executor: executor }),
}));
