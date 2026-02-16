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
            aria-label="lighthouse logo"
            className={className}
            width={size}
            height={size}
            {...props}
        >
            <g fill="currentColor">
                <ellipse cx="50" cy="20" rx="4" ry="12" />
                <ellipse cx="50" cy="20" rx="4" ry="12" transform="rotate(30 50 50)" />
                <ellipse cx="50" cy="20" rx="4" ry="12" transform="rotate(60 50 50)" />
                <ellipse cx="50" cy="20" rx="4" ry="12" transform="rotate(90 50 50)" />
                <ellipse cx="50" cy="20" rx="4" ry="12" transform="rotate(120 50 50)" />
                <ellipse cx="50" cy="20" rx="4" ry="12" transform="rotate(150 50 50)" />
                <ellipse cx="50" cy="20" rx="4" ry="12" transform="rotate(180 50 50)" />
                <ellipse cx="50" cy="20" rx="4" ry="12" transform="rotate(210 50 50)" />
                <ellipse cx="50" cy="20" rx="4" ry="12" transform="rotate(240 50 50)" />
                <ellipse cx="50" cy="20" rx="4" ry="12" transform="rotate(270 50 50)" />
                <ellipse cx="50" cy="20" rx="4" ry="12" transform="rotate(300 50 50)" />
                <ellipse cx="50" cy="20" rx="4" ry="12" transform="rotate(330 50 50)" />
            </g>
        </svg>
    );
}
