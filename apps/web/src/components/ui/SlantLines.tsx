/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { cn } from '@/src/lib/utils';

export default function SlantLines() {
    return (
        <div className={cn('w-screen ', 'flex justify-center items-center z-10', 'relative')}>
            <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                    backgroundImage: `
                            repeating-linear-gradient(-45deg, 
                            rgba(56, 56, 56, 0.2) 0px, 
                            rgba(255, 0, 100, 0) 2px, 
                            transparent 2px, 
                            transparent 8px)
                        `,
                }}
            />

            <div className="layout-width layout-side-border h-8 "></div>
        </div>
    );
}
