import { cn } from '@/src/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface CompanyNavbarLogoProps {
    variant?: 'light' | 'dark';
    className?: string;
    imgClassName?: string;
    priority?: boolean;
}

export default function CompanyNavbarLogo({
    variant = 'light',
    className,
    imgClassName,
    priority = false,
}: CompanyNavbarLogoProps) {
    return (
        <Link href="/" className={cn('flex items-center', className)} aria-label="Go to homepage">
            <Image
                src={`/icons/blackin-wordmark-${variant}.svg`}
                alt="BlackIn logo"
                width={146}
                height={42}
                priority={priority}
                className={cn('h-8 w-auto md:h-9', imgClassName)}
            />
        </Link>
    );
}
