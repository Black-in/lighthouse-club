/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { Template } from '@lighthouse/types';
import { create } from 'zustand';

interface TemplateState {
    templates: Template[]; // Global list of available templates
    setTemplates: (templates: Template[]) => void;
}

export const useTemplateStore = create<TemplateState>((set) => ({
    templates: [],
    setTemplates: (templates) => set({ templates }),
}));
