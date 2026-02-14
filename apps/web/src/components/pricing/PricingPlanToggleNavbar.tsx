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

    return (
        <div className="flex justify-center items-center select-none w-full border-y border-neutral-700/60">
            <div
                className={cn(
                    `relative w-full max-w-fit z-100 flex items-center justify-between my-3`,
                    'px-1 py-1 rounded-[4px] transition-all duration-500 ease-in-out gap-x-1',
                    'text-[18px] tracking-wide bg-darker border border-neutral-800 shadow-md',
                )}
            >
                <div
                    className={cn(
                        `absolute transition-all duration-500 ease-in-out -top-0.5 left-0 h-[1.5px] w-5 rounded-t-full `,
                        'bg-light shadow-[0_1px_8px_2px_rgba(108,68,252,0.8)] z-10',
                        pricingPlan === PricingPlanEnum.YEARLY
                            ? 'translate-x-[750%]'
                            : 'translate-x-[230%]',
                    )}
                />

                <div
                    onClick={() => {
                        setPricingPlan(PricingPlanEnum.MONTHLY);
                    }}
                    className={cn(
                        'px-5 py-2 rounded-[2px] cursor-pointer transition-all duration-300 relative',
                        pricingPlan === PricingPlanEnum.MONTHLY
                            ? 'bg-neutral-800 text-light'
                            : 'bg-transparent text-light/40 hover:bg-linear-to-r hover:from-dark/40 hover:via-dark/20 hover:to-darkest transition-all transform duration-200',
                    )}
                >
                    Monthly
                </div>

                <div
                    onClick={() => {
                        setPricingPlan(PricingPlanEnum.YEARLY);
                    }}
                    className={cn(
                        'px-5 py-2 rounded-[2px] cursor-pointer transition-all duration-300 relative',
                        pricingPlan === PricingPlanEnum.YEARLY
                            ? 'bg-neutral-800 text-light'
                            : 'bg-transparent text-light/40 hover:bg-linear-to-l hover:from-dark/40 hover:via-dark/20 hover:to-darkest transition-all transform duration-200',
                    )}
                >
                    Yearly
                </div>
            </div>
            <div />
        </div>
    );
}
