/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import { useRef, useState } from 'react';
import DeployedTicker from '../tickers/DeployedTicket';
import { FaCalendar, FaTrash } from 'react-icons/fa';
import { Button } from '../ui/button';
import { cn } from '@/src/lib/utils';
import { useContractStore } from '@/src/store/user/useUserContractStore';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import timeParser from '@/src/hooks/useTimeParser';
import Marketplace from '@/src/lib/server/marketplace-server';

export default function UserContracts() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftButton, setShowLeftButton] = useState<boolean>(false);
    const [showRightButton, setShowRightButton] = useState<boolean>(true);
    const { session } = useUserSessionStore();
    const { userContracts, removeContract } = useContractStore();
    const router = useRouter();

    function scroll(direction: 'left' | 'right') {
        if (scrollContainerRef.current) {
            const scrollAmount: number = scrollContainerRef.current.offsetWidth * 0.8;
            const newScrollLeft: number =
                direction === 'right'
                    ? scrollContainerRef.current.scrollLeft + scrollAmount
                    : scrollContainerRef.current.scrollLeft - scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth',
            });
        }
    }

    function handleScroll() {
        if (scrollContainerRef.current) {
            const {
                scrollLeft,
                scrollWidth,
                clientWidth,
            }: {
                scrollLeft: number;
                scrollWidth: number;
                clientWidth: number;
            } = scrollContainerRef.current;
            setShowLeftButton(scrollLeft > 0);
            setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
        }
    }

    async function handleContractDelete(contractId: string) {
        if (!session?.user.token) return;
        const { success, contractId: deletedContractId } = await Marketplace.deleteContract(
            session.user.token,
            contractId,
        );
        if (success) {
            toast.success('Contract deleted successfully');
            removeContract(deletedContractId);
        } else {
            toast.error('Failed to delete contract');
        }
    }

    return (
        <div className="w-full h-full tracking-wider flex flex-col px-2 pr-10">
            <div className="w-full flex justify-between py-1 text-sm px-1">
                <span className="text-light">User contracts</span>
                <span className="text-light/60 flex items-center gap-x-1 cursor-pointer group">
                    view all
                    <ChevronRight className="size-3.5 group-hover:translate-x-0.5 ease-in duration-100 transform" />
                </span>
            </div>
            <div
                className={cn(
                    'relative h-full',
                    showRightButton ? 'shadow-inset-right' : 'shadow-inset-left',
                )}
            >
                {showLeftButton && (
                    <Button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#0A0C0D] hover:bg-[#0c0e0f] rounded-full p-2 transition-all shadow-2xl"
                    >
                        <ChevronLeft className="size-4 text-light" />
                    </Button>
                )}

                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="h-full flex gap-x-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-2"
                >
                    {userContracts.length > 0 ? (
                        userContracts.map((contract) => (
                            <div
                                onClick={() => router.push(`/playground/${contract.id}`)}
                                key={contract.id}
                                className="h-full border border-neutral-800 bg-[#0A0C0D70] min-w-[calc(25%-12px)] rounded-[4px] grid grid-rows-[78%_22%] overflow-hidden group shadow-sm cursor-pointer"
                            >
                                <div className="bg-darkest p-3 flex flex-col border-b border-neutral-800">
                                    <div className="flex justify-between h-fit items-center">
                                        <DeployedTicker isDeployed={contract.deployed} />
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleContractDelete(contract.id);
                                            }}
                                            className="bg-light/10 p-1 aspect-square rounded-[4px] cursor-pointer hover:bg-light/20 transition"
                                        >
                                            <FaTrash className="text-light size-2.5" />
                                        </div>
                                    </div>
                                    <div className="flex-1 text-left flex items-end text-[13px] tracking-wider text-light/80">
                                        {contract.messages[0].content}
                                    </div>
                                    <div className="text-xs text-light/60 tracking-wide flex gap-x-1.5">
                                        <FaCalendar className="size-3" />
                                        <span>{timeParser(new Date(contract.createdAt))}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between px-3 text-[13px] tracking-wider bg-[#0A0C0D70]">
                                    {contract.title}
                                    <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 group-hover:transition-transform group-hover:translate-x-1 duration-200" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="w-full flex justify-center items-center text-md">
                            No contracts found. Start by generating one.
                        </div>
                    )}
                </div>

                {showRightButton && (
                    <Button
                        onClick={() => scroll('left')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-[#0A0C0D] hover:bg-[#0c0e0f] rounded-full p-2 transition-all shadow-2xl"
                    >
                        <ChevronRight className="size-4 text-light" />
                    </Button>
                )}
            </div>
        </div>
    );
}
