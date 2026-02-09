/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import DustParticles from '@/src/components/base/DustParticles';
import HomeNavbar from '@/src/components/nav/HomeNavbar';
import PricingHeader from '@/src/components/pricing/PricingHeader';
import PricingSection from '@/src/components/pricing/PricingSection';
import PricingPlanToggleNavbar from '@/src/components/pricing/PricingPlanToggleNavbar';
import SlantLines from '@/src/components/ui/SlantLines';

export default function PricingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-darkest items-center relative h-full">
            <HomeNavbar />
            <div className="w-full flex flex-col items-center flex-1">
                <PricingHeader />
                <SlantLines />
                <PricingPlanToggleNavbar />
                <PricingSection />
            </div>
            <DustParticles particleColor={0xfdf9f0} />
        </div>
    );
}
