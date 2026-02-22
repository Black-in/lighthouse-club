/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import DustParticles from '@/src/components/base/DustParticles';
import HomeNavbar from '@/src/components/nav/HomeNavbar';
import PricingHeader from '@/src/components/pricing/PricingHeader';
import PricingSection from '@/src/components/pricing/PricingSection';
import PricingPlanToggleNavbar from '@/src/components/pricing/PricingPlanToggleNavbar';

export default function PricingPage() {
    return (
        <div className="relative flex min-h-screen h-full flex-col items-center bg-[#07090c]">
            <HomeNavbar />
            <div className="flex w-full flex-1 flex-col items-center">
                <PricingHeader />
                <PricingPlanToggleNavbar />
                <PricingSection />
            </div>
            <DustParticles particleColor={0xd5d9df} />
        </div>
    );
}
