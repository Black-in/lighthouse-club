'use client';

import { useMemo } from 'react';
import LighthouseMark from '../ui/svg/LighthouseMark';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';

export function ConnectedWalletInfoCard() {
    const { session } = useUserSessionStore();

    const connectedLabel = useMemo(() => {
        if (!session?.user?.email) {
            return 'Connect your Base wallet to view account details.';
        }

        return `Session active for ${session.user.email}`;
    }, [session?.user?.email]);

    return (
        <div className="h-full flex flex-col items-center justify-center gap-y-4 text-light">
            <LighthouseMark className="text-primary h-18 w-18 transition-all duration-500" />
            <div className="text-sm tracking-[0.08rem] text-light/90">Base Wallet Panel</div>
            <div className="max-w-sm rounded-md border border-neutral-800 bg-dark px-4 py-3 text-center text-xs text-light/70">
                {connectedLabel}
            </div>
            <div className="flex items-center justify-center px-4 py-1.5 rounded-md bg-[#143357] border border-[#5483B3] text-[#D8CFBC] text-xs font-mono">
                Network: Base Sepolia (default)
            </div>
        </div>
    );
}
