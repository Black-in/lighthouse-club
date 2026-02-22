/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import Image from 'next/image';

export default function PricingHeader() {
    return (
        <div className="w-full border-y border-neutral-800/80">
            <div className="relative isolate w-full aspect-[1911/505] select-none overflow-hidden tracking-wide">
                <Image
                    src="/pricing.png"
                    alt="Pricing header background"
                    fill
                    priority
                    quality={100}
                    sizes="100vw"
                    className="object-cover object-center"
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/48 via-black/28 to-black/18"
                />

                <div
                    className="relative z-10 mx-auto flex h-full w-full max-w-[72rem] flex-col items-center justify-center gap-y-3 px-6 text-center [text-shadow:0_3px_14px_rgba(0,0,0,0.96)]"
                    style={{
                        fontFamily:
                            '"Canela", "Ivar Display", "Noe Display", "Baskerville", "Times New Roman", "Georgia", serif',
                    }}
                >
                    <h1 className="text-[2.35rem] font-normal leading-none tracking-[-0.01em] text-white md:text-[3.35rem]">
                        Pricing
                    </h1>

                    <p className="max-w-[52rem] text-[1rem] font-normal leading-[1.06] text-neutral-100 md:text-[1.95rem]">
                        Choose the right plan for your agentic web build velocity.
                    </p>
                </div>
            </div>
        </div>
    );
}
