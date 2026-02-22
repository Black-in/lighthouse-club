/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

export default function PricingHeader() {
    return (
        <div className="mt-6 flex w-full select-none flex-col items-center gap-y-3 border-y border-neutral-800/80 bg-[#090b0e]/70 py-7 tracking-wide backdrop-blur-sm">
            <div className="rounded-full border border-neutral-700 bg-[#0f1318] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-300">
                BlackIn
            </div>

            <div className="flex flex-col items-center gap-y-2 text-center">
                <h1 className="bg-gradient-to-b from-neutral-100 via-neutral-200 to-neutral-400 bg-clip-text text-[2.2rem] font-semibold leading-none tracking-tight text-transparent md:text-[3.2rem]">
                    Pricing
                </h1>
            </div>
        </div>
    );
}
