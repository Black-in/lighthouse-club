import { cn } from '@/src/lib/utils';
import { doto } from '../base/FeatureOne';
import LighthouseMark from '../ui/svg/LighthouseMark';

interface AppLogoProps {
    className?: string;
    size?: number;
    showLogoText?: boolean;
}

export default function AppLogo({ className, size = 20, showLogoText = true }: AppLogoProps) {
    return (
        <div className={cn('flex items-center gap-x-2', doto.className, className)}>
            <LighthouseMark
                size={size}
                className="text-primary transition-all duration-500"
                aria-hidden="true"
            />
            {showLogoText && <span className="tracking-[0.1rem] font-black">lighthouse</span>}
        </div>
    );
}
