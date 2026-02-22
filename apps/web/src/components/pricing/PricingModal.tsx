/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';

import { Dispatch, SetStateAction, useEffect } from 'react';
import { X } from 'lucide-react';
import OpacityBackground from '../utility/OpacityBackground';
import PricingHeader from './PricingHeader';
import PricingPlanToggleNavbar from './PricingPlanToggleNavbar';
import PricingSection from './PricingSection';

interface PricingModalProps {
    openPricingModal: boolean;
    setOpenPricingModal: Dispatch<SetStateAction<boolean>>;
}

export default function PricingModal({ openPricingModal, setOpenPricingModal }: PricingModalProps) {
    useEffect(() => {
        if (!openPricingModal) return;

        function handleEscape(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                setOpenPricingModal(false);
            }
        }

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [openPricingModal, setOpenPricingModal]);

    if (!openPricingModal) return null;

    return (
        <OpacityBackground
            className="z-[140] bg-darkest/80 backdrop-blur-sm"
            onBackgroundClick={() => setOpenPricingModal(false)}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="relative w-[min(96vw,74rem)] max-h-[90vh] overflow-hidden rounded-2xl border border-neutral-800 bg-[#07090c] shadow-[0_40px_90px_-40px_rgba(0,0,0,1)]"
            >
                <button
                    type="button"
                    onClick={() => setOpenPricingModal(false)}
                    className="absolute right-4 top-4 z-30 inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-700 bg-[#0b0d10] text-neutral-300 transition-colors hover:border-neutral-500 hover:bg-neutral-900 hover:text-white"
                    aria-label="Close pricing"
                >
                    <X className="h-4 w-4" />
                </button>

                <div
                    data-lenis-prevent
                    className="h-full max-h-[90vh] overflow-y-auto custom-scrollbar soft-scroll"
                >
                    <PricingHeader />
                    <PricingPlanToggleNavbar />
                    <PricingSection />
                </div>
            </div>
        </OpacityBackground>
    );
}
