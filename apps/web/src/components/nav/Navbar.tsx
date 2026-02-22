/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import NavbarSigninAction from './NavSigninAction';
import { cn } from '@/src/lib/utils';
import { useEffect, useState } from 'react';
import CompanyNavbarLogo from './CompanyNavbarLogo';
import PricingModal from '../pricing/PricingModal';

export default function Navbar() {
    const [isNavbarVisible, setIsNavbarVisible] = useState<boolean>(true);
    const [lastScrollY, setLastScrollY] = useState<number>(0);
    const [openPricingModal, setOpenPricingModal] = useState<boolean>(false);

    useEffect(() => {
        function handleScroll() {
            const currentScrollY = window.scrollY;

            if (currentScrollY < lastScrollY) {
                setIsNavbarVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsNavbarVisible(false);
            }

            setLastScrollY(currentScrollY);
        }

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    return (
        <>
            <div
                className={cn(
                    'fixed w-full z-[100] flex items-center justify-between px-3 md:px-6 top-4 transition-all duration-500 ease-in-out',
                    isNavbarVisible
                        ? 'translate-y-0'
                        : '-translate-y-[calc(100%+2rem)] pointer-events-none',
                )}
            >
                <CompanyNavbarLogo priority />
                <div className="flex items-center gap-x-4">
                    <button
                        type="button"
                        onClick={() => setOpenPricingModal(true)}
                        className="hover:bg-neutral-700/70 hidden md:flex rounded-md px-3 h-9 text-light/70 select-none cursor-pointer transition-transform hover:-translate-y-0.5 items-center text-sm font-semibold tracking-wide"
                    >
                        Pricing
                    </button>
                    <NavbarSigninAction />
                </div>
            </div>
            <PricingModal
                openPricingModal={openPricingModal}
                setOpenPricingModal={setOpenPricingModal}
            />
        </>
    );
}
