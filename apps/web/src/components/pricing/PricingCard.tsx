/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import { GoArrowUpRight, GoCheck } from 'react-icons/go';
import { Button } from '../ui/button';
import { cn } from '@/src/lib/utils';

interface PricingCardProps {
    planType: string;
    blurb: string;
    price: number;
    tokens: string;
    agentLimit: string;
    note?: string;
    featured?: boolean;
}

export default function PricingCard({
    planType,
    blurb,
    price,
    tokens,
    agentLimit,
    note,
    featured = false,
}: PricingCardProps) {
    return (
        <div className="group relative z-20 w-full max-w-[23rem] overflow-hidden">
            <div
                className={cn(
                    'min-h-[30rem] rounded-2xl border p-7 shadow-[0_28px_50px_-30px_rgba(0,0,0,0.9)] transition-all duration-300',
                    'bg-linear-to-br from-[#0f1216] via-[#0b0d10] to-[#080a0d]',
                    featured
                        ? 'border-neutral-400/70 ring-1 ring-neutral-300/30'
                        : 'border-neutral-800 hover:border-neutral-600',
                )}
            >
                <div className="mb-7 flex items-center justify-between">
                    <h3 className="text-[1.55rem] font-semibold tracking-tight text-neutral-100">
                        {planType}
                    </h3>
                    {featured && (
                        <span className="rounded-full border border-neutral-500 bg-neutral-200/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-200">
                            Popular
                        </span>
                    )}
                </div>

                <div className="mb-7">
                    <div className="flex items-end gap-x-2">
                        <div className="text-5xl font-semibold tracking-tight text-neutral-50">
                            ${price}
                        </div>
                        <div className="pb-1 text-sm text-neutral-400">/month</div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-400">{blurb}</p>
                </div>

                <Button
                    className={cn(
                        'mb-7 h-11 w-full rounded-xl text-sm font-semibold tracking-wide transition-transform hover:-translate-y-0.5',
                        featured
                            ? 'bg-neutral-100 text-neutral-900 hover:bg-white'
                            : 'bg-neutral-800 text-neutral-100 hover:bg-neutral-700',
                    )}
                >
                    Choose {planType}
                    <GoArrowUpRight />
                </Button>

                <div className="mb-6 border-t border-neutral-800" />

                <div className="flex flex-col gap-y-3 text-sm">
                    <div className="flex items-center gap-x-2 text-neutral-300">
                        <GoCheck className="text-emerald-400" />
                        <span>{tokens} tokens</span>
                    </div>
                    <div className="flex items-center gap-x-2 text-neutral-300">
                        <GoCheck className="text-emerald-400" />
                        <span>{agentLimit}</span>
                    </div>
                    {note && (
                        <div className="flex items-center gap-x-2 text-neutral-300">
                            <GoCheck className="text-emerald-400" />
                            <span>{note}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
