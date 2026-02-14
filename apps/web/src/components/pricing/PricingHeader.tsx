/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

export default function PricingHeader() {
    return (
        <div className="mt-4 tracking-wider flex flex-col items-center w-full gap-y-4 select-none border-y border-neutral-700/60">
            {/* <div className="border border-primary-light bg-primary/5 px-2.5 py-1 pt-1.5 rounded-[4px] text-sm font-light leading-none text-primary-light">
                SUBSCRIPTION PLANS
            </div> */}

            <div className="flex flex-col gap-y-1.5 items-center py-4">
                <div className="text-[3rem] font-semibold leading-[55px] text-light/80">
                    Built on transparency
                </div>
                <div className="text-[22px] text-light/60 flex flex-col">
                    Pricing as efficient as your smart contracts
                </div>
            </div>
        </div>
    );
}
