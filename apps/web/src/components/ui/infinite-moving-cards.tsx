/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import { cn } from '@/src/lib/utils';
import React, { useEffect, useState } from 'react';

export const InfiniteMovingCards = ({
    items,
    direction = 'left',
    speed = 'fast',
    pauseOnHover = true,
    className,
}: {
    items: {
        quote: string;
        name: string;
        title: string;
    }[];
    direction?: 'left' | 'right';
    speed?: 'fast' | 'normal' | 'slow';
    pauseOnHover?: boolean;
    className?: string;
}) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const scrollerRef = React.useRef<HTMLUListElement>(null);

    const [start, setStart] = useState(false);

    useEffect(() => {
        addAnimation();
    });

    function addAnimation() {
        if (containerRef.current && scrollerRef.current) {
            const children = Array.from(scrollerRef.current.children);

            // duplicate nodes for infinite scroll
            children.forEach((item) => {
                const clone = item.cloneNode(true);
                scrollerRef.current!.appendChild(clone);
            });

            applyDirection();
            applySpeed();
            setStart(true);
        }
    }

    function applyDirection() {
        if (!containerRef.current) return;

        containerRef.current.style.setProperty(
            '--animation-direction',
            direction === 'left' ? 'forwards' : 'reverse',
        );
    }

    function applySpeed() {
        if (!containerRef.current) return;

        containerRef.current.style.setProperty(
            '--animation-duration',
            speed === 'fast' ? '20s' : speed === 'normal' ? '40s' : '80s',
        );
    }

    return (
        <div
            ref={containerRef}
            className={cn(
                'scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]',
                className,
            )}
        >
            <ul
                ref={scrollerRef}
                className={cn(
                    'flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4',
                    start && 'animate-scroll',
                    pauseOnHover && 'hover:[animation-play-state:paused]',
                )}
            >
                {items.map((item, idx) => {
                    const isDark = idx % 2 === 1;

                    return (
                        <li
                            key={item.name + idx}
                            className={cn(
                                'relative w-[350px] md:w-[450px] max-w-full shrink-0 rounded-2xl px-8 py-6 border',
                                // alternate styles
                                isDark
                                    ? 'bg-[#1a1a1a] border-[#333] text-white/80'
                                    : 'bg-[#fafafa] border-[#e5e0d5] text-neutral-800',
                            )}
                        >
                            <blockquote>
                                <span
                                    className={cn(
                                        'relative z-20 text-sm leading-[1.6] font-normal text-left',
                                        isDark ? 'text-white/80' : 'text-neutral-800',
                                    )}
                                >
                                    {item.quote}
                                </span>

                                <div className="relative z-20 mt-6 flex flex-row items-center">
                                    <span className="flex flex-col gap-1">
                                        <span
                                            className={cn(
                                                'text-sm leading-[1.6]',
                                                isDark ? 'text-primary-light' : 'text-neutral-600 ',
                                            )}
                                        >
                                            {item.name}
                                        </span>
                                        <span
                                            className={cn(
                                                'text-sm leading-[1.6]',
                                                isDark ? 'text-gray-400' : 'text-neutral-500',
                                            )}
                                        >
                                            {item.title}
                                        </span>
                                    </span>
                                </div>
                            </blockquote>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
