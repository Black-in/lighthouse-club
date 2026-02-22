/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { MeshGradient } from '@paper-design/shaders-react';
import { BillingPeriod, Plan } from './SubscriptionCard';
import { Check } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import OpacityBackground from './OpacityBackground';
import { FaArrowLeft } from 'react-icons/fa';

export default function ExpandableSubscriptionCard({
    onClose,
    plan,
    allPlans,
    onSelectPlan,
    billing,
    setBilling,
}: {
    onClose: () => void;
    plan: Plan;
    allPlans: Plan[];
    onSelectPlan: (plan: Plan) => void;
    billing: BillingPeriod;
    setBilling: (v: BillingPeriod) => void;
}) {
    const planGradients: Record<string, string[]> = {
        FREE: ['#313647', '#435663', '#393E46', '#686D76'],
        PREMIUM: ['#435663', '#A3B087', '#1D546C', '#FF8040'],
        PREMIUM_PLUS: ['#021024', '#052659', '#5483B3', '#DC0E0E'],
    };

    const renderFullCard = (planData: Plan, isSelected: boolean) => {
        const price = billing === 'MONTHLY' ? planData.priceMonthly : planData.priceYearly;

        const planName =
            planData.plan === 'PREMIUM_PLUS'
                ? 'Premium+'
                : planData.plan.charAt(0) + planData.plan.slice(1).toLowerCase();

        return (
            <motion.div
                animate={{ scale: isSelected ? 1 : 0.95 }}
                transition={{ scale: { duration: 0.3 } }}
                onClick={() => !isSelected && onSelectPlan(planData)}
                className={`relative w-screen max-w-[320px] bg-[#1a1a1a] 
                    border border-neutral-800 rounded-2xl overflow-hidden
                    ${!isSelected ? 'cursor-pointer hover:opacity-100' : ''}`}
            >
                <div className="relative w-full p-3 rounded-lg overflow-hidden">
                    <MeshGradient
                        colors={planGradients[planData.plan]}
                        distortion={1}
                        swirl={0.8}
                        speed={isSelected ? 0.2 : 0}
                        className="w-full h-30 opacity-80 rounded-[6px]"
                    />
                    <div className="absolute inset-0 flex justify-center items-center">
                        <h2 className="text-[25px] tracking-wide">{planName}</h2>
                    </div>
                </div>

                <div className="w-full flex px-6 py-4 items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-white">{price}</span>
                        <span className="text-sm text-neutral-400">
                            {billing === 'MONTHLY' ? 'per month' : 'per year'}
                        </span>
                    </div>

                    <div className="relative w-[90px] h-6 border rounded-[5.5px] border-neutral-800 bg-darkest/80 flex items-center justify-between text-[10px]">
                        <motion.div
                            className="absolute h-[18px] w-[39px] rounded-[3px] bg-light"
                            animate={{ left: billing === 'MONTHLY' ? 4 : 46 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                        />

                        <div
                            onClick={() => setBilling('MONTHLY')}
                            className={cn(
                                'z-10 w-[45px] text-center cursor-pointer transition-colors',
                                billing === 'MONTHLY' ? 'text-darkest' : 'text-light',
                            )}
                        >
                            Month
                        </div>

                        <div
                            onClick={() => setBilling('YEARLY')}
                            className={cn(
                                'z-10 w-[45px] text-center cursor-pointer transition-colors',
                                billing === 'YEARLY' ? 'text-darkest' : 'text-light',
                            )}
                        >
                            Year
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-4">
                    <Button className="w-full bg-primary hover:bg-primary hover:-translate-y-0.5 text-light font-semibold py-3 rounded-[4px] tracking-wide transition-all">
                        {planData.plan === 'FREE' ? 'Start Free' : 'Try BlackIn'}
                    </Button>
                </div>

                <div className="px-6 pb-6">
                    <p className="text-[13px] text-neutral-500 mb-3 font-medium">
                        {planData.plan === 'FREE'
                            ? 'All features included:'
                            : `All features in ${planData.plan === 'PREMIUM' ? 'Free' : 'Premium'}, plus:`}
                    </p>

                    <div className="space-y-3">
                        {planData.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <Check className="size-4 text-white mt-0.5" />
                                <span className="text-sm text-neutral-200">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <OpacityBackground className="bg-darkest/30 z-100" onBackgroundClick={onClose}>
            <div className="relative z-100 w-fit flex items-center justify-center">
                <Button
                    variant={'ghost'}
                    onClick={onClose}
                    className="absolute -top-12 left-0 text-neutral-400 hover:text-white flex items-center gap-2"
                >
                    <FaArrowLeft />
                    <span className="text-sm">Back</span>
                </Button>

                <div className="flex items-center justify-center gap-6 flex-wrap lg:flex-nowrap">
                    {allPlans.map((planData) => (
                        <div key={planData.plan}>
                            {renderFullCard(planData, planData.plan === plan.plan)}
                        </div>
                    ))}
                </div>
            </div>
        </OpacityBackground>
    );
}
