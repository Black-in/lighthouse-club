'use client';
import BuilderNavbarSearchComponent from './BuilderNavbarSearchComponent';
import BuilderNavbarRightSection from './BuilderNavbarRightSection';
import DevelopmentModeBadge from '../utility/DevelopmentModeBadge';
import { cn } from '@/src/lib/utils';

interface BuilderNavbarProps {
    leftRailVisible: boolean;
}

export default function BuilderNavbar({ leftRailVisible }: BuilderNavbarProps) {
    return (
        <div className="playground-navbar min-h-[3.5rem] bg-black text-light/70 px-6 select-none relative flex items-center">
            <div
                className={cn(
                    'flex items-center gap-2 transition-[margin-left] duration-300 ease-out',
                    leftRailVisible ? 'ml-0' : 'ml-12',
                )}
            >
                <BuilderNavbarSearchComponent />
                <DevelopmentModeBadge />
            </div>
            <div className="ml-auto">
                <BuilderNavbarRightSection />
            </div>
        </div>
    );
}
