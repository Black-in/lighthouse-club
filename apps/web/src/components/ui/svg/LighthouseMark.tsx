import type { SVGProps } from 'react';

type LighthouseMarkProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

const PETALS = [
    { angle: -6, rx: 3.6, ry: 12.8 },
    { angle: 20, rx: 3.8, ry: 12.6 },
    { angle: 46, rx: 4.1, ry: 12.1 },
    { angle: 74, rx: 4.4, ry: 11.7 },
    { angle: 104, rx: 4.8, ry: 10.9 },
    { angle: 136, rx: 5.2, ry: 10.2 },
    { angle: 170, rx: 5.3, ry: 9.8 },
    { angle: 204, rx: 5.2, ry: 10.2 },
    { angle: 236, rx: 4.8, ry: 10.9 },
    { angle: 266, rx: 4.4, ry: 11.7 },
    { angle: 294, rx: 4.1, ry: 12.1 },
    { angle: 322, rx: 3.8, ry: 12.6 },
] as const;

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
            <g fill="currentColor">
                {PETALS.map((petal) => (
                    <ellipse
                        key={petal.angle}
                        cx="50"
                        cy="18"
                        rx={petal.rx}
                        ry={petal.ry}
                        transform={`rotate(${petal.angle} 50 50)`}
                    />
                ))}
            </g>
        </svg>
    );
}
