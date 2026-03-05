/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';

import { RxCross2 } from 'react-icons/rx';
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
                        Base Wallet
                    </div>
                    <div className="text-xs text-light/70 px-3">
                        Base wallet integrations are enabled in this release.
                    </div>
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
