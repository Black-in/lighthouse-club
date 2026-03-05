import { useState } from 'react';
import { Check } from 'lucide-react';
import LighthouseMark from '../ui/svg/LighthouseMark';
import ExpandableSubscriptionCard from './ExpandableSubscriptionCard';
import PricingModal from '../pricing/PricingModal';

export type PlanType = 'FREE' | 'PREMIUM' | 'PREMIUM_PLUS';
export type BillingPeriod = 'MONTHLY' | 'YEARLY';

export interface Plan {
    plan: PlanType;
    priceMonthly: string;
    priceYearly: string;
    features: string[];
    isBest?: boolean;
}

const planStyles = {
    FREE: 'bg-neutral-200 text-neutral-900 border-neutral-400/30',
    PREMIUM: 'bg-neutral-900 text-neutral-300 border-neutral-700/50',
    PREMIUM_PLUS: 'bg-primary text-light border-primary-light/20',
};

const planAccents = {
    FREE: 'bg-gradient-to-br from-neutral-400/20 to-transparent',
    PREMIUM: 'bg-gradient-to-br from-neutral-700/30 to-transparent',
    PREMIUM_PLUS: 'bg-gradient-to-br from-white/10 to-transparent',
};

function SubscriptionCard({
    plan,
    price,
    billing,
    features,
    isBest = false,
    onClick,
}: {
    plan: PlanType;
    price: string;
    billing: BillingPeriod;
    features: string[];
    isBest?: boolean;
    onClick: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className={`rounded-2xl relative overflow-hidden border backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer
            ${isBest ? 'md:w-[480px] md:h-[285px]' : 'md:w-[480px] md:h-[260px]'} 
            w-full max-w-[420px] h-auto 
            ${planStyles[plan]} 
            ${isBest && 'shadow-[0_0_40px_rgba(255,255,255,0.2)] ring-2 ring-white/20'}
            `}
        >
            <div className={`absolute inset-0 opacity-60 ${planAccents[plan]}`} />
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -left-12 -bottom-12 w-40 h-40 rounded-full bg-black/10 blur-3xl" />

            <div className="relative z-10 h-full flex flex-col p-6 sm:p-7">
                <div className="flex justify-between items-start mb-5 sm:mb-6">
                    <div>
                        <div className="text-[10px] sm:text-xs font-medium opacity-70 uppercase tracking-wider mb-1">
                            BlackIn
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                            {plan === 'PREMIUM_PLUS' ? 'Premium+' : plan}
                        </h2>
                    </div>
                    <div
                        className={`p-2.5 rounded-lg backdrop-blur-sm ${
                            plan === 'PREMIUM'
                                ? 'bg-white/5'
                                : plan === 'FREE'
                                  ? 'bg-white/20'
                                  : 'bg-white/15'
                        }`}
                    >
                        <LighthouseMark size={28} />
                    </div>
                </div>

                <div className="flex-1 mb-4 sm:mb-5">
                    <div className="flex flex-wrap gap-1.5">
                        {features.slice(0, 4).map((feature, idx) => (
                            <div
                                key={idx}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                                    plan === 'PREMIUM'
                                        ? 'bg-neutral-800/60'
                                        : plan === 'FREE'
                                          ? 'bg-white/25'
                                          : 'bg-white/15'
                                }`}
                            >
                                <Check className="size-3" />
                                <span className="whitespace-nowrap">{feature}</span>
                            </div>
                        ))}
                    </div>
                    {features.length > 4 && (
                        <div className="mt-1.5 text-[10px] sm:text-xs opacity-60">
                            +{features.length - 4} more features
                        </div>
                    )}
                </div>

                <div className="flex items-end justify-between pt-2 flex-wrap gap-3 sm:gap-0">
                    <div className="pb-1 flex items-center gap-x-2 sm:gap-x-3">
                        <div className="text-2xl sm:text-3xl font-bold tracking-tight">{price}</div>
                        <div className="text-[10px] sm:text-xs opacity-60 mt-1">
                            {billing === 'MONTHLY' ? 'per month' : 'per year'}
                        </div>
                    </div>
                    <button
                        className={`px-5 py-1.5 rounded-lg font-semibold transition-all shadow-lg ${
                            plan === 'PREMIUM'
                                ? 'bg-neutral-800 hover:bg-neutral-700 text-white'
                                : plan === 'FREE'
                                  ? 'bg-[#052659] hover:bg-[#5483B3] text-white'
                                  : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                        }`}
                    >
                        {plan === 'FREE' ? 'Start Free' : 'Upgrade'}
                    </button>
                </div>
            </div>

            <div className="absolute bottom-4 left-7 hidden sm:flex gap-2 opacity-20 pointer-events-none">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-1">
                        {[...Array(4)].map((_, j) => (
                            <div key={j} className="w-1.5 h-1.5 rounded-full bg-current" />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export const plans: Plan[] = [
    {
        plan: 'FREE',
        priceMonthly: '₹0',
        priceYearly: '₹0',
        features: ['1 App / Week', '30 AI Messages', 'Base Sepolia', 'Basic Support'],
    },
    {
        plan: 'PREMIUM_PLUS',
        priceMonthly: '₹1,999',
        priceYearly: '₹19,990',
        features: [
            'Unlimited Contracts',
            'Unlimited AI Chat',
            'Base Mainnet Access',
            '10+ Deployments',
            'Fast Build Priority',
            'Priority Support',
        ],
        isBest: true,
    },
    {
        plan: 'PREMIUM',
        priceMonthly: '₹799',
        priceYearly: '₹7,990',
        features: [
            '10 Contracts / Month',
            '300 AI Messages',
            'Base Sepolia + Base Mainnet',
            'Standard Support',
        ],
    },
];

export default function SubscriptionPlans() {
    const [billing, setBilling] = useState<BillingPeriod>('MONTHLY');
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [openPricingModal, setOpenPricingModal] = useState<boolean>(false);

    return (
        <section
            id="pricing"
            className="w-full min-h-screen bg-linear-to-b from-[#0a0c0d] to-black text-center text-white relative flex flex-col items-center justify-center z-10 px-4 py-20"
        >
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-neutral-900/20 to-transparent" />

            <div className="relative z-10 mb-12">
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
                    Choose Your BlackIn Plan
                </h1>
                <p className="text-neutral-400 max-w-2xl mx-auto text-sm sm:text-lg">
                    Get access to premium features designed to boost productivity and simplify your
                    workflow with seamless performance
                </p>
            </div>

            <div className="flex gap-1 mb-4 z-20 border border-neutral-800 p-1 rounded-lg">
                <button
                    onClick={() => setBilling('MONTHLY')}
                    className={`px-6 py-2 rounded-[5px] font-medium transition-all duration-250 cursor-pointer ${
                        billing === 'MONTHLY'
                            ? 'bg-[#052659] text-light'
                            : 'text-light/70 hover:text-light'
                    }`}
                >
                    Monthly
                </button>
                <button
                    onClick={() => setBilling('YEARLY')}
                    className={`px-6 py-2 rounded-[5px] font-medium transition-all cursor-pointer duration-250 ${
                        billing === 'YEARLY'
                            ? 'bg-[#052659] text-light'
                            : 'text-light/70 hover:text-light'
                    }`}
                >
                    Yearly
                </button>
            </div>

            <span className="mb-12 text-light/60 text-xs sm:text-sm">
                {billing === 'YEARLY'
                    ? 'Save up to 10% off with yearly billing'
                    : 'Switch to yearly for better savings'}
            </span>

            <div className="relative z-10 flex w-full max-w-[90%] justify-center items-center gap-6 flex-wrap mb-16">
                {plans.map((planData) => (
                    <SubscriptionCard
                        key={planData.plan}
                        plan={planData.plan}
                        price={billing === 'MONTHLY' ? planData.priceMonthly : planData.priceYearly}
                        billing={billing}
                        features={planData.features}
                        isBest={planData.isBest}
                        onClick={() => setOpenPricingModal(true)}
                    />
                ))}
            </div>

            {selectedPlan && (
                <ExpandableSubscriptionCard
                    onClose={() => setSelectedPlan(null)}
                    plan={selectedPlan}
                    allPlans={plans}
                    onSelectPlan={setSelectedPlan}
                    billing={billing}
                    setBilling={setBilling}
                />
            )}

            <PricingModal
                openPricingModal={openPricingModal}
                setOpenPricingModal={setOpenPricingModal}
            />
        </section>
    );
}
