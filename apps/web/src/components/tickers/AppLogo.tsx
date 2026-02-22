import { cn } from '@/src/lib/utils';
import { doto } from '../base/FeatureOne';
import Image from 'next/image';

interface AppLogoProps {
    className?: string;
    size?: number;
    showLogoText?: boolean;
}

export default function AppLogo({ className, size = 20, showLogoText = true }: AppLogoProps) {
    return (
        <div className={cn('flex items-center gap-x-2', doto.className, className)}>
            <Image
                src="/icons/blackin-mark-dark.svg"
                alt="BlackIn logo"
                width={size}
                height={size}
                className="object-contain transition-all duration-500"
            />
            {showLogoText && <span className="tracking-[0.1rem] font-black">BlackIn</span>}
        </div>
    );
}
