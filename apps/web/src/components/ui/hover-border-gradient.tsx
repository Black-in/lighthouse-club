'use client';
import React from 'react';

import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

export function HoverBorderGradient({
    children,
    containerClassName,
    className,
    as: Tag = 'button',
    roundedClassName = 'rounded-full',
    duration = 6,
    clockwise = true,
    gradientColors = ['rgb(193, 232, 255)', 'rgb(125, 160, 202)', 'rgb(2, 16, 36)'],
    noiseIntensity = 0.2,
    speed = 0.1,
    backdropBlur = false,
    animating = true,
    ...props
}: React.PropsWithChildren<
    {
        as?: React.ElementType;
        containerClassName?: string;
        className?: string;
        roundedClassName?: string;
        duration?: number;
        clockwise?: boolean;
        gradientColors?: string[];
        noiseIntensity?: number;
        speed?: number;
        backdropBlur?: boolean;
        animating?: boolean;
    } & React.HTMLAttributes<HTMLElement>
>) {
    const sanitizedSpeed = Math.max(speed, 0.05);
    const rotationDuration = duration / sanitizedSpeed;
    const rotationValue = clockwise ? 360 : -360;
    const safeNoiseIntensity = Math.max(0, Math.min(noiseIntensity, 1));

    const animatedGradient = `conic-gradient(from 0deg, ${gradientColors.join(', ')}, ${gradientColors[0]})`;
    const noiseTexture =
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.9'/%3E%3C/svg%3E\")";

    return (
        <Tag
            className={cn(
                'relative inline-flex w-fit items-center justify-center overflow-hidden p-px',
                roundedClassName,
                backdropBlur && 'backdrop-blur-md',
                containerClassName,
            )}
            {...props}
        >
            <motion.div
                className={cn('absolute inset-[-180%] z-0', roundedClassName)}
                style={{ background: animatedGradient }}
                animate={animating ? { rotate: rotationValue } : { rotate: 0 }}
                transition={
                    animating
                        ? { ease: 'linear', repeat: Infinity, duration: rotationDuration }
                        : { duration: 0 }
                }
            />
            <div className={cn('absolute inset-[1px] z-[1] bg-[#05070a]', roundedClassName)} />
            <div
                className={cn('pointer-events-none absolute inset-[1px] z-[2]', roundedClassName)}
                style={{
                    backgroundImage: noiseTexture,
                    opacity: safeNoiseIntensity,
                    mixBlendMode: 'soft-light',
                }}
            />
            <div
                className={cn(
                    'relative z-[3] w-auto rounded-[inherit] px-4 py-2 text-white',
                    className,
                )}
            >
                {children}
            </div>
        </Tag>
    );
}
