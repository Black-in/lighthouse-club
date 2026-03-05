/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';

import { Component, ErrorInfo, ReactNode, useMemo } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';
import { OnchainKitProvider } from '@coinbase/onchainkit';
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
        console.error('provider failed to initialize:', error);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }

        return this.props.children;
    }
}

export default function WalletProviders({ children }: { children: ReactNode }) {
    const privyAppId = (process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? '').trim();
    const hasPrivyAppId = privyAppId.length > 0;
    const disablePrivy = process.env.NEXT_PUBLIC_DISABLE_PRIVY === 'true';
    const baseEnabled = process.env.NEXT_PUBLIC_CHAIN_BASE_ENABLED !== 'false';
    const walletConnectProjectId =
        (process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '').trim();

    const queryClient = useMemo(() => new QueryClient(), []);
    const wagmiConfig = useMemo(
        () =>
            createConfig({
                chains: [baseSepolia, base],
                connectors: [
                    injected(),
                    coinbaseWallet({
                        appName: 'BlackIn',
                    }),
                    ...(walletConnectProjectId
                        ? [
                              walletConnect({
                                  projectId: walletConnectProjectId,
                                  showQrModal: true,
                              }),
                          ]
                        : []),
                ],
                transports: {
                    [baseSepolia.id]: http(
                        process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
                    ),
                    [base.id]: http(
                        process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL || 'https://mainnet.base.org',
                    ),
                },
            }),
        [walletConnectProjectId],
    );

    type OnchainKitProviderProps = {
        children: ReactNode;
        apiKey?: string;
        chain?: unknown;
    };
    const OnchainKitProviderAny = OnchainKitProvider as unknown as React.ComponentType<OnchainKitProviderProps>;

    const providerTree = (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProviderAny
                    apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
                    chain={baseSepolia}
                >
                    {children}
                </OnchainKitProviderAny>
            </QueryClientProvider>
        </WagmiProvider>
    );

    if (!baseEnabled) {
        return <>{children}</>;
    }

    if (disablePrivy || !hasPrivyAppId) {
        return providerTree;
    }

    return (
        <ProviderBoundary fallback={providerTree}>
            <PrivyProvider appId={privyAppId}>
                {providerTree}
                <PrivySessionSync />
            </PrivyProvider>
        </ProviderBoundary>
    );
}
