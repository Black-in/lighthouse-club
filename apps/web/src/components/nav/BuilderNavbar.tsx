'use client';
import BuilderNavbarSearchComponent from './BuilderNavbarSearchComponent';
import BuilderNavbarRightSection from './BuilderNavbarRightSection';
import CompanyNavbarLogo from './CompanyNavbarLogo';

export default function BuilderNavbar() {
    return (
        <div className="min-h-[3.5rem] bg-black text-light/70 px-6 select-none relative flex items-center">
            <CompanyNavbarLogo />
            <div className="ml-5">
                <BuilderNavbarSearchComponent />
            </div>
            <div className="ml-auto">
                <BuilderNavbarRightSection />
            </div>
        </div>
    );
}
