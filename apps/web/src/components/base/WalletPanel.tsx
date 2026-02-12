/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';

import { RxCross2 } from 'react-icons/rx';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';
import { cn } from '@/src/lib/utils';
import { ConnectedWalletInfoCard } from './ConnectedWalletInfoCard';
import OpacityBackground from '../utility/OpacityBackground';

interface WalletPanelProps {
    close: () => void;
}

export const WalletPanel = ({ close }: WalletPanelProps) => {
    return (
        <OpacityBackground onBackgroundClick={() => close()}>
            <div className="w-3xl h-[60vh] bg-darkest rounded-[4px] overflow-hidden shadow-2xl flex border border-neutral-800">
                <div className="w-60 h-full border-r border-neutral-800 p-5 flex flex-col gap-4">
                    <div className="w-full text-left px-3 flex justify-start items-start text-lg font-semibold">
                        Connect a Wallet
                    </div>
                    <WalletOptions />
                </div>

                <div className="flex-1 h-full p-5 relative">
                    <div className="absolute top-5 right-5">
                        <RxCross2
                            onClick={close}
                            className="size-5 cursor-pointer bg-dark p-1 rounded-full hover:bg-darkest transition-colors duration-200 ease-in-out"
                        />
                    </div>
                    <ConnectedWalletInfoCard />
                </div>
            </div>
        </OpacityBackground>
    );
};

function WalletOptions() {
    const { wallets, select, connect, wallet } = useWallet();

    return (
        <>
            {wallets.map((w, index) => (
                <button
                    key={index}
                    onClick={() => {
                        select(w.adapter.name);
                        connect();
                    }}
                    className={cn(
                        'w-full text-left py-2 px-3 rounded-[4px] hover:bg-dark/60 transition duration-200 ease-in-out cursor-pointer',
                        'flex justify-start items-center gap-x-2',
                        w.adapter.name === wallet?.adapter.name ? 'bg-[#2c2c2c]' : '',
                    )}
                >
                    <Image src={w.adapter.icon} alt={w.adapter.name} width={20} height={20} />
                    <span>{w.adapter.name}</span>
                </button>
            ))}
        </>
    );
}
