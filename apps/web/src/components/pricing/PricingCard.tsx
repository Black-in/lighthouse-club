/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import { GoArrowUpRight, GoCheck } from 'react-icons/go';
import { Button } from '../ui/button';
import { cn } from '@/src/lib/utils';

interface PricingCardProps {
    icon: React.ReactElement;
    description: string;
    planType: string;
    tagTitle?: string;
    price: string;
    features: string[];
}

export default function PricingCard({
    icon,
    planType,
    price,
    description,
    tagTitle,
    features,
}: PricingCardProps) {
    return (
        <div className="group relative z-20 overflow-hidden ">
            <div
                className={cn(
                    'absolute inset-0 opacity-0 group-hover:opacity-100',
                    'transition-all duration-500 pointer-events-none z-10',
                )}
                style={{
                    background:
                        'radial-gradient(ellipse 150% 90% at 50% 0%, rgba(255,255,255,0.05), transparent 50%)',
                }}
            />
            <div
                className={cn(
                    'absolute top-0 left-1/2 -translate-x-1/2',
                    'h-px w-70',
                    'bg-linear-to-r from-transparent via-light/10 to-transparent',
                    'opacity-0 group-hover:opacity-100',
                    'transition-all duration-300',
                    'group-hover:scale-x-110',
                )}
            />

            <div
                className={cn(
                    'w-105 h-full min-h-140 rounded-lg select-none tracking-wide shadow-md',
                    'border-2 border-neutral-800/80 bg-linear-to-br from-dark via-darkest to-dark',
                    'p-8 flex flex-col gap-y-7 z-20',
                    'transition-colors duration-200 hover:shadow-xl',
                )}
            >
                <div className="flex justify-between items-center text-light/80">
                    <div className="flex gap-x-2 items-center">
                        {icon}
                        <div className="font-semibold text-[24px] pt-0.5 leading-0">{planType}</div>
                    </div>

                    {tagTitle && (
                        <div
                            className={cn(
                                'text-[14px] px-2.5 py-0.5 pt-[3px] rounded-[4px] tracking-wider font-semibold opacity-95',
                                planType === 'Premium Plus'
                                    ? 'bg-light text-darkest'
                                    : planType === 'Premium'
                                      ? 'bg-primary text-light'
                                      : 'bg-neutral-800 text-light',
                            )}
                        >
                            {tagTitle}
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-start gap-y-2">
                    <div className="text-4xl tracking-wider font-semibold">{price}</div>
                    <div className="text-light/70 text-[21px] text-left">{description}</div>
                </div>

                <Button
                    className={cn(
                        'font-semibold text-base hover:-translate-y-0.5 ease-in-out transform tracking-wide !py-5 !rounded-[4px]',
                        planType === 'Free'
                            ? 'bg-neutral-800/80 text-light hover:bg-[#1d1d1d]'
                            : 'bg-light hover:bg-light text-darkest',
                    )}
                >
                    {planType === 'Free' ? 'Jump In' : 'Get Started'}
                    <GoArrowUpRight />
                </Button>

                <div className="border-t border-light/14" />

                <div className="text-left flex flex-col gap-y-3">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="text-light/70 shadow-xs px-2.5 py-1  text-sm font-light rounded-full bg-dark w-fit flex items-center gap-x-1.5"
                        >
                            <div>
                                <GoCheck />
                            </div>
                            <div>{feature}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
