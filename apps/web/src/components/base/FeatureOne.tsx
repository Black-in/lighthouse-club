/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { cn } from '@/src/lib/utils';
import { Doto } from 'next/font/google';
import VersionLockTicker from '../tickers/VersionLockTicker';

export const doto = Doto({
    subsets: ['latin'],
    weight: ['800', '900'],
    display: 'swap',
});

interface FeatureOneProps {
    title: string;
    subTitle: string;
    description: string;
}

export default function FeatureOne({ title, subTitle, description }: FeatureOneProps) {
    return (
        <div className="flex flex-col items-start justify-center h-[100vh] pl-4 md:pl-16">
            <div className="max-w-[32rem]">
                <h1
                    className={cn(
                        doto.className,
                        'text-4xl md:text-6xl font-black tracking-wider text-left text-light/70 flex items-end relative w-fit',
                    )}
                >
                    {title}
                    {(title === 'EditWizard' || title === 'DeployBot') && (
                        <VersionLockTicker className="absolute bottom-2.5 -right-28 z-10" />
                    )}
                </h1>
                <p className="text-left text-xl font-bold mt-2 text-primary">{subTitle}</p>
                <p className="text-left text-light/50 tracking-wide text-md mt-5">{description}</p>
            </div>
        </div>
    );
}
