/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import { Component, ErrorInfo, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';
import { PrivyProvider } from '@privy-io/react-auth';
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    AlphaWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import PrivySessionSync from '@/src/lib/PrivySessionSync';

interface ProviderBoundaryProps {
    fallback: ReactNode;
    children: ReactNode;
}

interface ProviderBoundaryState {
    hasError: boolean;
}

class ProviderBoundary extends Component<ProviderBoundaryProps, ProviderBoundaryState> {
    public state: ProviderBoundaryState = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
        console.error('Privy provider failed to initialize:', error);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }

        return this.props.children;
    }
}

export default function WalletProviders({ children }: { children: ReactNode }) {
    const endpoint = clusterApiUrl('devnet');
    const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? '';
    const disablePrivy = process.env.NEXT_PUBLIC_DISABLE_PRIVY === 'true';

    const wallets = useMemo(
        () => [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new AlphaWalletAdapter()],
        [],
    );

    const walletTree = (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                {children}
            </WalletProvider>
        </ConnectionProvider>
    );

    if (disablePrivy) {
        return walletTree;
    }

    return (
        <ProviderBoundary fallback={walletTree}>
            <PrivyProvider appId={privyAppId}>
                <ConnectionProvider endpoint={endpoint}>
                    <WalletProvider wallets={wallets} autoConnect>
                        {children}
                        <PrivySessionSync />
                    </WalletProvider>
                </ConnectionProvider>
            </PrivyProvider>
        </ProviderBoundary>
    );
}
