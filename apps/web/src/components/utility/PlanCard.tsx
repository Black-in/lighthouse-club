/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import { MeshGradient } from '@paper-design/shaders-react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { BillingPeriod, Plan } from '@/src/components/utility/SubscriptionCard';
import { Button } from '@/src/components/ui/button';

interface PlanCardProps {
    planData: Plan;
    billing: BillingPeriod;
}

const planGradients: Record<string, string[]> = {
    FREE: ['#313647', '#435663', '#393E46', '#686D76'],
    PREMIUM: ['#435663', '#A3B087', '#1D546C', '#FF8040'],
    PREMIUM_PLUS: ['#021024', '#052659', '#5483B3', '#DC0E0E'],
};

export default function PlanCard({ planData, billing }: PlanCardProps) {
    const price = billing === 'MONTHLY' ? planData.priceMonthly : planData.priceYearly;

    const planName =
        planData.plan === 'PREMIUM_PLUS'
            ? 'Premium+'
            : planData.plan.charAt(0) + planData.plan.slice(1).toLowerCase();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full bg-[#1a1a1a]
                border border-neutral-800 rounded-[8px] overflow-hidden
                hover:border-neutral-700 transition-all duration-300 z-50"
        >
            <div className="relative w-full p-6 rounded-[8px] overflow-hidden">
                <MeshGradient
                    colors={planGradients[planData.plan]}
                    distortion={1}
                    swirl={0.8}
                    speed={0.2}
                    className="w-full h-48 opacity-80 rounded-[5px]"
                />
                <div className="absolute inset-0 flex justify-center items-center">
                    <h2 className="text-4xl font-semibold tracking-wide">{planName}</h2>
                </div>
            </div>

            <div className="px-10 py-8">
                <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-5xl font-bold text-white">{price}</span>
                    <span className="text-lg text-neutral-400">
                        {billing === 'MONTHLY' ? 'per month' : 'per year'}
                    </span>
                </div>

                <Button className="w-full bg-primary hover:bg-primary hover:-translate-y-0.5 text-light font-semibold py-5 text-lg rounded-[4px] tracking-wide transition-all">
                    {planData.plan === 'FREE' ? 'Start Free' : 'Try BlackIn'}
                </Button>

                <div className="mt-10">
                    <p className="text-base text-neutral-500 mb-6 font-medium">
                        {planData.plan === 'FREE'
                            ? 'All features included:'
                            : `All features in ${planData.plan === 'PREMIUM' ? 'Free' : 'Premium'}, plus:`}
                    </p>

                    <div className="space-y-5">
                        {planData.features.map(function (feature, idx) {
                            return (
                                <div key={idx} className="flex items-start gap-4">
                                    <Check className="size-6 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-lg text-neutral-200">{feature}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
