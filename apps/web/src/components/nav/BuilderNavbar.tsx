'use client';
import BuilderNavbarSearchComponent from './BuilderNavbarSearchComponent';
import BuilderNavbarRightSection from './BuilderNavbarRightSection';
import Image from 'next/image';

export default function BuilderNavbar() {
    return (
        <div className="min-h-[3.5rem] bg-darkest text-light/70 px-6 select-none relative flex items-center justify-between">
            <div className="flex items-center overflow-hidden rounded-[4px] border border-neutral-700/80 bg-[#1f2227]">
                <div className="flex h-8 w-8 items-center justify-center border-r border-neutral-700/80 bg-[#171a1f]">
                    <Image
                        src="/icons/lighthouse-mark.svg"
                        alt="BlackIn logo"
                        width={14}
                        height={14}
                        className="h-[14px] w-[14px] object-contain"
                    />
                </div>
                <span
                    className="px-3 text-sm font-medium leading-none tracking-[-0.01em] text-white"
                    style={{
                        fontFamily:
                            '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, "Helvetica Neue", Arial, sans-serif',
                    }}
                >
                    BlackIn
                </span>
            </div>

            <BuilderNavbarSearchComponent />
            <BuilderNavbarRightSection />
        </div>
    );
}
