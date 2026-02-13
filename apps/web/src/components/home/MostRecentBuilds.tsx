/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import timeParser from '@/src/hooks/useTimeParser';
import { useAllContractStore } from '@/src/store/user/useAllContractStore';
import { GoClockFill } from 'react-icons/go';

export default function MostRecentBuilds() {
    const { allContracts } = useAllContractStore();

    return (
        <div className="w-full h-full flex flex-col px-2 tracking-wider">
            <div className="w-full flex justify-between py-1 text-sm px-1">
                <span className="text-light">Most Recent Builds</span>
            </div>

            <div className="h-full flex gap-x-5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-2 ">
                {allContracts.map((contract) => (
                    <div
                        key={contract.id}
                        className="h-full min-w-[calc(25%-12px)] grid grid-rows-[85%_15%] overflow-hidden group"
                    >
                        <div className="bg-neutral-900/50  shadow-sm border border-neutral-800 rounded-[8px]">
                            {/* image */}
                        </div>

                        <div className="text-light/40 h-full w-full flex items-center justify-between px-1">
                            <div className="text-sm">{contract.title}</div>

                            <div className="flex gap-x-1.5 justify-center text-[12px] items-center h-full">
                                <GoClockFill className="mb-[1.3px]" />
                                {timeParser(contract.createdAt)} ago
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
