/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import { cn } from '@/src/lib/utils';
import { usePricingPlanStore } from '@/src/store/user/usePricingPlanStore';
import { PricingPlanEnum } from '@/src/types/pricing-plan-types';

export default function PricingPlanToggleNavbar() {
    const { pricingPlan, setPricingPlan } = usePricingPlanStore();
    const isMonthly = pricingPlan === PricingPlanEnum.MONTHLY;

    return (
        <div className="flex w-full select-none items-center justify-center border-y border-neutral-800/80 py-5">
            <div
                className={cn(
                    'relative z-10 flex w-full max-w-fit items-center justify-between gap-x-1 rounded-full border border-neutral-700 bg-[#0c0f12] p-1 text-[15px] tracking-wide shadow-[0_12px_28px_-20px_rgba(0,0,0,0.9)]',
                )}
            >
                <div
                    onClick={() => {
                        setPricingPlan(PricingPlanEnum.MONTHLY);
                    }}
                    className={cn(
                        'cursor-pointer rounded-full px-5 py-2 transition-all duration-300',
                        isMonthly
                            ? 'bg-neutral-200 text-neutral-900'
                            : 'bg-transparent text-neutral-400 hover:text-neutral-200',
                    )}
                >
                    Monthly
                </div>

                <div
                    onClick={() => {
                        setPricingPlan(PricingPlanEnum.YEARLY);
                    }}
                    className={cn(
                        'cursor-pointer rounded-full px-5 py-2 transition-all duration-300',
                        !isMonthly
                            ? 'bg-neutral-200 text-neutral-900'
                            : 'bg-transparent text-neutral-400 hover:text-neutral-200',
                    )}
                >
                    Yearly
                </div>
            </div>
        </div>
    );
}
