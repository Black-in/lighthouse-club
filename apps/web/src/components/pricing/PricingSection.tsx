/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import { usePricingPlanStore } from '@/src/store/user/usePricingPlanStore';
import PricingCard from './PricingCard';
import { PricingPlanEnum } from '@/src/types/pricing-plan-types';

interface BlackInPlan {
    planType: string;
    monthlyPrice: number;
    yearlyPrice: number;
    tokens: string;
    agentLimit: string;
    blurb: string;
    note?: string;
    featured?: boolean;
}

const plans: BlackInPlan[] = [
    {
        planType: 'Premium',
        monthlyPrice: 20,
        yearlyPrice: 16,
        tokens: '500K',
        agentLimit: 'Extended limit on agent',
        blurb: 'Built for focused solo builders shipping agentic web products.',
    },
    {
        planType: 'Premium Plus',
        monthlyPrice: 80,
        yearlyPrice: 60,
        tokens: '1000K',
        agentLimit: '2X extended limit of agent',
        blurb: 'For teams that need more model throughput and faster iterations.',
        featured: true,
    },
    {
        planType: 'Premium Max',
        monthlyPrice: 200,
        yearlyPrice: 160,
        tokens: '2000K',
        agentLimit: '20x extended limit of agent',
        note: '20x more usage credit than Premium',
        blurb: 'Maximum capacity for serious agentic web workloads at scale.',
    },
];

export default function PricingSection() {
    const { pricingPlan } = usePricingPlanStore();
    const isMonthly = pricingPlan === PricingPlanEnum.MONTHLY;

    return (
        <div className="relative flex w-full flex-1 flex-col items-center overflow-hidden pb-10">
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 20% 0%, rgba(255,255,255,0.08), transparent 28%),
                        radial-gradient(circle at 80% 0%, rgba(255,255,255,0.05), transparent 30%)
                        `,
                }}
            />

            <div className="relative grid w-full max-w-[86rem] grid-cols-1 gap-5 px-4 md:px-6 lg:grid-cols-3">
                {plans.map((plan) => (
                    <PricingCard
                        key={plan.planType}
                        planType={plan.planType}
                        blurb={plan.blurb}
                        price={isMonthly ? plan.monthlyPrice : plan.yearlyPrice}
                        tokens={plan.tokens}
                        agentLimit={plan.agentLimit}
                        note={plan.note}
                        featured={plan.featured}
                    />
                ))}
            </div>
        </div>
    );
}
