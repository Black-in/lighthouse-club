'use client';
import BuilderNavbarSearchComponent from './BuilderNavbarSearchComponent';
import BuilderNavbarRightSection from './BuilderNavbarRightSection';
import LighthouseMark from '../ui/svg/LighthouseMark';

export default function BuilderNavbar() {
    return (
        <div className="min-h-[3.5rem] bg-darkest text-light/70 px-6 select-none relative flex items-center justify-between">
            <div className="text-[#C3C3C3] text-sm tracking-[0.5rem] flex justify-start items-center gap-x-3 cursor-pointer group">
                <LighthouseMark size={25} className="text-primary" aria-hidden="true" />
                lighthouse
            </div>

            <BuilderNavbarSearchComponent />
            <BuilderNavbarRightSection />
        </div>
    );
}
