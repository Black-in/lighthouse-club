/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { PricingPlanEnum } from '@/src/types/pricing-plan-types';
import { create } from 'zustand';

interface PricingPlan {
    pricingPlan: PricingPlanEnum;
    setPricingPlan: (pricing: PricingPlanEnum) => void;
}

export const usePricingPlanStore = create<PricingPlan>((set) => ({
    pricingPlan: PricingPlanEnum.MONTHLY,
    setPricingPlan: (pricingPlan) => set({ pricingPlan }),
}));
