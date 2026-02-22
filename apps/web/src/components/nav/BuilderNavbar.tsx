'use client';
import BuilderNavbarSearchComponent from './BuilderNavbarSearchComponent';
import BuilderNavbarRightSection from './BuilderNavbarRightSection';
import CompanyNavbarLogo from './CompanyNavbarLogo';

export default function BuilderNavbar() {
    return (
        <div className="min-h-[3.5rem] bg-darkest text-light/70 px-6 select-none relative flex items-center justify-between">
            <CompanyNavbarLogo />

            <BuilderNavbarSearchComponent />
            <BuilderNavbarRightSection />
        </div>
    );
}
