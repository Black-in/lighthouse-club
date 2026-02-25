/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';

import { cn } from '@/src/lib/utils';
import { shouldEnableDevAccessClient } from '@/src/lib/runtime-mode';

interface DevelopmentModeBadgeProps {
    className?: string;
}

export default function DevelopmentModeBadge({ className }: DevelopmentModeBadgeProps) {
    if (!shouldEnableDevAccessClient()) return null;

    return (
        <div
            className={cn(
                'playground-dev-badge inline-flex h-8 items-center rounded-full bg-[#0c0f12] px-4 text-xs tracking-wide text-light/80',
                className,
            )}
        >
            Development Mode
        </div>
    );
}
