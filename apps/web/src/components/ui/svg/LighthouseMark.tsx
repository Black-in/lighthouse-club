import type { SVGProps } from 'react';

type LighthouseMarkProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

export default function LighthouseMark({
    size,
    className,
    ...props
}: LighthouseMarkProps) {
    return (
        <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="BlackIn logo"
            className={className}
            width={size}
            height={size}
            {...props}
        >
            <path
                d="M50 10C49.6 29.5 46.9 45.4 39.9 56.5C33.4 66.8 25.5 73.9 16 79C27.1 72.9 37.9 69.7 50 69.7C62.1 69.7 72.9 72.9 84 79C74.5 73.9 66.6 66.8 60.1 56.5C53.1 45.4 50.4 29.5 50 10Z"
                fill="currentColor"
            />
        </svg>
    );
}
