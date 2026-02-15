/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { cn } from '@/src/lib/utils';
import { CiLock } from 'react-icons/ci';

export default function VersionLockTicker({
    className,
    iconClassName,
    showText = true,
}: {
    className?: string;
    iconClassName?: string;
    showText?: boolean;
}) {
    return (
        <div
            className={cn(
                'relative overflow-hidden',
                'p-2 flex items-center gap-x-1 rounded-[8px]',
                'font-light tracking-[2px] font-mono',
                'text-[#FFD700]',
                'bg-darkest',
                'border border-white/10',
                'before:absolute before:inset-0 before:-top-6 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:opacity-40 before:pointer-events-none',
                'after:absolute after:inset-y-0 after:left-0 after:w-[40%] after:bg-gradient-to-r after:from-white/10 after:to-transparent after:opacity-20 after:blur-md after:pointer-events-none',
                className,
            )}
        >
            <CiLock className={cn('size-3 glow-text', iconClassName)} strokeWidth="0.5" />
            {showText && (
                <span className="text-[12px] sm:text-[9px] hidden sm:block">upcoming</span>
            )}
        </div>
    );
}
