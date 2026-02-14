/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import { usePricingPlanStore } from '@/src/store/user/usePricingPlanStore';
import PricingCard from './PricingCard';
import { TbTopologyStar2, TbTopologyStar3, TbTopologyStarRing3 } from 'react-icons/tb';
import { PricingPlanEnum } from '@/src/types/pricing-plan-types';

export default function PricingSection() {
    const { pricingPlan } = usePricingPlanStore();
    const isMonthly = pricingPlan === PricingPlanEnum.MONTHLY;

    return (
        <div className="relative flex flex-col w-full items-center flex-1 overflow-hidden">
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `
                            repeating-linear-gradient(-45deg, 
                            rgba(56, 56, 56, 0.2) 0px, 
                            rgba(255, 0, 100, 0) 2px, 
                            transparent 2px, 
                            transparent 8px)
                        `,
                }}
            />

            <div className="relative flex justify-around items-center flex-1 w-full max-w-[100rem] border-x border-neutral-700/60 bg-darkest">
                <PricingCard
                    icon={<TbTopologyStar2 className="size-5" />}
                    planType="Free"
                    tagTitle="Kick things off"
                    description="The starter plan to kick things off, Just sign in"
                    price={isMonthly ? '$0/mo' : '$0/year'}
                    features={[
                        `${isMonthly ? '4 contracts/month' : '48 contracts/year'}`,
                        '30 AI messages',
                        'Devnet only',
                        'Export code',
                    ]}
                />

                <PricingCard
                    icon={<TbTopologyStar3 className="size-5" />}
                    planType="Premium"
                    tagTitle="Recommended for you"
                    description="Get more access to our most popular features"
                    price={isMonthly ? '$799/mo' : '$7990/year'}
                    features={[
                        `${isMonthly ? '10 contracts/month' : '120 contracts/year'}`,
                        `${isMonthly ? '300 AI messages' : '3600 AI messages'}`,
                        'Devnet + Testnet',
                        'Export Code',
                    ]}
                />

                <PricingCard
                    icon={<TbTopologyStarRing3 className="size-5" />}
                    planType="Premium Plus"
                    tagTitle="Never Stop"
                    description="Get more access to our most popular features"
                    price={isMonthly ? '$1999/mo' : '$19,990/year'}
                    features={[
                        `${isMonthly ? '30 contracts/month' : '360 contracts/year'}`,
                        '300 AI messages',
                        'Mainnet + Devnet + Testnet',
                        'Export Code',
                    ]}
                />
            </div>
        </div>
    );
}
