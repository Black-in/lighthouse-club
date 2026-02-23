'use client';
import { useState } from 'react';
import BuilderNavbarSearchComponent from './BuilderNavbarSearchComponent';
import BuilderNavbarRightSection from './BuilderNavbarRightSection';
import DevelopmentModeBadge from '../utility/DevelopmentModeBadge';

interface BuilderNavbarProps {
    leftRailVisible?: boolean;
    onToggleLeftRail?: () => void;
}

export default function BuilderNavbar({ leftRailVisible, onToggleLeftRail }: BuilderNavbarProps) {
    const [isLogoRotated, setIsLogoRotated] = useState(false);
    const isControlled = typeof leftRailVisible === 'boolean' && !!onToggleLeftRail;
    const shouldRotate = isControlled ? leftRailVisible : isLogoRotated;

    function handleLogoClick() {
        if (isControlled && onToggleLeftRail) {
            onToggleLeftRail();
            return;
        }
        setIsLogoRotated((prev) => !prev);
    }

    return (
        <div className="min-h-[3.5rem] bg-black text-light/70 px-6 select-none relative flex items-center">
            <button
                type="button"
                onClick={handleLogoClick}
                aria-label="Toggle side panel"
                className="flex items-center"
            >
                <img
                    src="/icons/blackin-mark-dark.svg"
                    alt="BlackIn official logo"
                    width={34}
                    height={34}
                    draggable={false}
                    className="h-[34px] w-[34px] select-none object-contain transition-transform duration-500 ease-out will-change-transform drop-shadow-[0_0_8px_rgba(242,245,250,0.28)]"
                    style={{ transform: `rotate(${shouldRotate ? 180 : 0}deg)` }}
                />
            </button>
            <div className="ml-5 flex items-center gap-2">
                <BuilderNavbarSearchComponent />
                <DevelopmentModeBadge />
            </div>
            <div className="ml-auto">
                <BuilderNavbarRightSection />
            </div>
        </div>
    );
}
