/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { cn } from '@/src/lib/utils';
import Image from 'next/image';

interface ShaderSplitPanelProps {
    imageSrc: string;
    rightChildren: React.ReactNode;
    leftChildren: React.ReactNode;
}

export default function ShaderSplitPanel({
    imageSrc,
    rightChildren,
    leftChildren,
}: ShaderSplitPanelProps) {
    return (
        <div
            className={cn(
                'playground-shader-split',
                'max-w-[350px] md:max-w-[800px] w-full ',
                'h-[300px] md:h-[500px]',
                'bg-linear-to-b from-[#0a0f16] via-[#070b11] to-[#05070a]',
                'rounded-[8px] grid grid-cols-2',
                'overflow-hidden shadow-2xl',
            )}
        >
            <div className="col-span-1 relative w-full h-full">
                <Image
                    src={imageSrc}
                    fill
                    alt="Login Illustration"
                    className="object-cover object-top"
                    unoptimized
                    priority
                />
                {leftChildren}
            </div>
            <div className="playground-shader-split-right col-span-1 bg-linear-to-b from-[#0a0a0a] via-darkest to-[#0d0d0d]">
                <div
                    className={cn(
                        'playground-shader-split-right-inner',
                        'w-full max-w-[420px]',
                        'px-5 md:px-10 py-2 md:py-8',
                        'flex flex-col items-center justify-center',
                        'z-50 relative overflow-hidden h-full',
                    )}
                >
                    {rightChildren}
                </div>
            </div>
        </div>
    );
}
