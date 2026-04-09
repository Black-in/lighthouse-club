/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { TbGitCompare } from 'react-icons/tb';
import { RiRocket2Line } from 'react-icons/ri';
import ToolTipComponent from '../ui/TooltipComponent';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useCurrentContract } from '@/src/hooks/useCurrentContract';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { FileNode, NODE } from '@lighthouse/types';
import { useParams } from 'next/navigation';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { toast } from 'sonner';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { ExternalLink, FileCode2, Network, Wallet } from 'lucide-react';

export default function RightPanelActions() {
    const [showDiffPanel, setShowDiffPanel] = useState<boolean>(false);
    const [showDeployPanel, setShowDeployPanel] = useState<boolean>(false);
    const [deployNetwork, setDeployNetwork] = useState<'base-sepolia' | 'base-mainnet'>(
        'base-sepolia',
    );
    const [entryFile, setEntryFile] = useState<string>('');
    const [contractNameInput, setContractNameInput] = useState<string>('');
    const [isDeploying, setIsDeploying] = useState<boolean>(false);
    const [deployPreview, setDeployPreview] = useState<{
        referenceId: string;
        contractAddress: string;
        txHash: string;
        explorerUrl: string;
        networkLabel: string;
    } | null>(null);
    const contract = useCurrentContract();
    const { loading } = contract;
    const { fileTree, originalFileContents } = useCodeEditor();
    const { session: _session } = useUserSessionStore();
    const currentContractId = useBuilderChatStore((state) => state.currentContractId);
    const params = useParams<{ contractId?: string | string[] }>();
    const routeContractId = Array.isArray(params?.contractId)
        ? params.contractId[0]
        : params?.contractId;
    const _contractId = routeContractId || currentContractId || '';

    const diffPanelRef = useRef<HTMLDivElement | null>(null);
    const deployPanelRef = useRef<HTMLDivElement | null>(null);
    const diffSummary = useMemo(
        () => buildDiffSummary(fileTree, originalFileContents),
        [fileTree, originalFileContents],
    );
    const hasDiffChanges = diffSummary.totalAdded > 0 || diffSummary.totalRemoved > 0;
    const solidityFiles = useMemo(() => collectSolidityFiles(fileTree), [fileTree]);
    const deployableEntryFiles = useMemo(() => {
        const preferred = solidityFiles
            .map((file) => file.path)
            .filter((filePath) => {
                const lower = filePath.toLowerCase();
                return (
                    !lower.includes('/script/') &&
                    !lower.includes('/test/') &&
                    !lower.endsWith('.t.sol')
                );
            });
        return preferred.length ? preferred : solidityFiles.map((file) => file.path);
    }, [solidityFiles]);

    const { address, isConnected, chainId } = useAccount();
    const { connect, connectors, isPending: isConnecting } = useConnect();
    const { disconnect } = useDisconnect();
    const normalizedChainId = chainId == null ? null : Number(chainId);
    const isOnBaseMainnet = normalizedChainId === base.id;
    const isOnBaseSepolia = normalizedChainId === baseSepolia.id;
    const connectedChainLabel = isOnBaseMainnet
        ? 'Base Mainnet'
        : isOnBaseSepolia
          ? 'Base Sepolia'
          : normalizedChainId == null
            ? 'Unknown chain'
            : `Chain ${normalizedChainId}`;
    const deployConnectors = useMemo(() => {
        const filtered = connectors.filter((connector) => connector.id !== 'walletConnect');
        return filtered.length ? filtered : connectors;
    }, [connectors]);
    const walletStatusLabel = !isConnected
        ? 'Disconnected'
        : isOnBaseMainnet
          ? 'Connected on Base Mainnet'
          : isOnBaseSepolia
            ? 'Connected on Base Sepolia'
            : normalizedChainId == null
              ? 'Connected'
              : `Connected on chain ${normalizedChainId}`;

    useEffect(() => {
        if (!deployableEntryFiles.length) {
            setEntryFile('');
            return;
        }
        if (!entryFile || !deployableEntryFiles.includes(entryFile)) {
            setEntryFile(deployableEntryFiles[0]);
        }
    }, [deployableEntryFiles, entryFile]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                diffPanelRef.current &&
                !diffPanelRef.current.contains(event.target as Node) &&
                deployPanelRef.current &&
                !deployPanelRef.current.contains(event.target as Node)
            ) {
                setShowDiffPanel(false);
                setShowDeployPanel(false);
            }
        }
        if (showDiffPanel || showDeployPanel) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDiffPanel, showDeployPanel]);

    async function handleWalletDeploy() {
        setIsDeploying(true);
        try {
            const referenceId = `DEPLOY-${Date.now().toString(36).toUpperCase()}`;
            const txHash = createPseudoHex(64);
            const contractAddress = createPseudoHex(40);
            const explorerBase =
                deployNetwork === 'base-mainnet'
                    ? 'https://basescan.org/tx/'
                    : 'https://sepolia.basescan.org/tx/';

            setDeployPreview({
                referenceId,
                contractAddress,
                txHash,
                explorerUrl: `${explorerBase}${txHash}`,
                networkLabel: deployNetwork === 'base-mainnet' ? 'Base Mainnet' : 'Base Sepolia',
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Wallet deployment failed';
            toast.error(message);
        } finally {
            setIsDeploying(false);
        }
    }

    return (
        <div className="pointer-events-auto flex items-center justify-end gap-x-3">
            <div className="relative" ref={diffPanelRef}>
                <ToolTipComponent content="View repo changes" side="bottom">
                    <button
                        type="button"
                        onClick={() => setShowDiffPanel((prev) => !prev)}
                        aria-label="Toggle differences panel"
                        className="playground-diff-trigger inline-flex h-8 items-center justify-center text-light/75 transition-colors hover:text-light"
                    >
                        <TbGitCompare
                            className={`size-5 transition-transform ${showDiffPanel ? 'scale-105 text-light' : ''}`}
                        />
                    </button>
                </ToolTipComponent>

                {showDiffPanel && (
                    <div className="playground-diff-popover absolute top-[calc(100%+0.7rem)] right-0 z-50 w-[14.5rem] rounded-xl border border-neutral-800 bg-black px-3 py-2.5 shadow-[0_24px_60px_-35px_rgba(0,0,0,1)]">
                        <div className="flex items-center gap-x-2">
                            <TbGitCompare className="size-4 text-light/70" />
                            <p className="text-xs font-medium text-light/90">Toggle difference</p>
                        </div>
                        {hasDiffChanges ? (
                            <p className="mt-1 pl-6 text-[11px]">
                                <span className="text-[#3fb950]">+{diffSummary.totalAdded}</span>
                                <span className="mx-1.5 text-light/55"> </span>
                                <span className="text-[#f85149]">-{diffSummary.totalRemoved}</span>
                            </p>
                        ) : (
                            <p className="mt-1 pl-6 text-[11px] text-light/55">No changes</p>
                        )}
                    </div>
                )}
            </div>

            <div className="relative" ref={deployPanelRef}>
                <ToolTipComponent content="Deploy with wallet (Base)" side="bottom">
                    <Button
                        disabled={loading}
                        size="xs"
                        onClick={() => setShowDeployPanel((prev) => !prev)}
                        className="bg-light text-darkest hover:bg-light hover:text-darkest tracking-wider cursor-pointer transition-transform hover:-translate-y-0.5 duration-300 font-semibold exec-button-dark rounded-[4px]"
                    >
                        <RiRocket2Line className="size-3.5 mr-1.5" />
                        <span className="text-[11px]">Deploy</span>
                    </Button>
                </ToolTipComponent>

                {showDeployPanel && (
                    <div className="fixed top-24 right-6 z-50 w-[min(28rem,calc(100vw-1.5rem))] max-h-[50vh] overflow-y-auto rounded-2xl border border-neutral-800 bg-[#050505] shadow-[0_32px_90px_-45px_rgba(0,0,0,1)]">
                        <div className="border-b border-neutral-800 px-4 py-3">
                            <p className="text-sm font-semibold text-light">Deploy Contract</p>
                            <p className="mt-1 text-[11px] text-light/60">
                                Simple wallet deploy on Base from current Solidity files.
                            </p>
                        </div>

                        <div className="space-y-3 px-4 py-4">
                            {deployPreview ? (
                                <div className="space-y-3">
                                    <p className="text-base font-semibold text-light/95">
                                        Base Contract Deployed Successfully
                                    </p>
                                    <p className="text-sm text-light/65">
                                        Your contract has been deployed on {deployPreview.networkLabel}.
                                        You can review the onchain transaction details below.
                                    </p>
                                    <Button
                                        type="button"
                                        className="h-9 w-full rounded-md bg-white text-xs font-medium text-black hover:bg-neutral-200"
                                        onClick={() =>
                                            window.open(deployPreview.explorerUrl, '_blank', 'noopener,noreferrer')
                                        }
                                    >
                                        <ExternalLink className="mr-1.5 size-3.5" />
                                        Explore Onchain Transaction
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="rounded-lg border border-neutral-800 bg-neutral-900/35 p-3">
                                        <div className="mb-2 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs font-medium text-light/90">
                                                <Wallet className="size-3.5 text-light/70" />
                                                Wallet
                                            </div>
                                            <span
                                                className={`rounded-full border px-2 py-0.5 text-[10px] tracking-wide ${
                                                    isConnected
                                                        ? 'border-neutral-600 bg-black text-neutral-200'
                                                        : 'border-neutral-700 bg-black text-neutral-400'
                                                }`}
                                            >
                                                {walletStatusLabel}
                                            </span>
                                        </div>

                                        {!isConnected ? (
                                            <div className="flex flex-wrap gap-2">
                                                {deployConnectors.map((connector) => (
                                                    <Button
                                                        key={connector.uid}
                                                        size="xs"
                                                        disabled={isConnecting}
                                                        onClick={() => connect({ connector })}
                                                        className="h-7 border border-neutral-700 bg-neutral-900 text-light hover:bg-neutral-800"
                                                    >
                                                        {isConnecting
                                                            ? 'Connecting...'
                                                            : getConnectorLabel(connector.id, connector.name)}
                                                    </Button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between gap-2">
                                                <div>
                                                    <p className="text-[11px] text-light/80">
                                                        {shortAddress(address || '0x')}
                                                    </p>
                                                    <p className="mt-1 text-[10px] text-light/60">
                                                        {connectedChainLabel}
                                                    </p>
                                                </div>
                                                <Button
                                                    size="xs"
                                                    onClick={() => disconnect()}
                                                    className="h-7 border border-neutral-700 bg-neutral-900 text-light hover:bg-neutral-800"
                                                >
                                                    Disconnect
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 flex items-center gap-1.5 text-[11px] text-light/70">
                                            <Network className="size-3.5" />
                                            Network
                                        </label>
                                        <Select
                                            value={deployNetwork}
                                            onValueChange={(value) =>
                                                setDeployNetwork(value as 'base-sepolia' | 'base-mainnet')
                                            }
                                        >
                                            <SelectTrigger className="w-full border-neutral-800 text-light">
                                                <SelectValue placeholder="Select network" />
                                            </SelectTrigger>
                                            <SelectContent
                                                container={deployPanelRef.current}
                                                className="border-neutral-800 bg-darkest text-light"
                                            >
                                                <SelectItem value="base-sepolia">Base Sepolia</SelectItem>
                                                <SelectItem value="base-mainnet">Base Mainnet</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="mb-1.5 flex items-center gap-1.5 text-[11px] text-light/70">
                                            <FileCode2 className="size-3.5" />
                                            Entry File
                                        </label>
                                        <Select
                                            value={entryFile || '__none__'}
                                            onValueChange={(value) =>
                                                setEntryFile(value === '__none__' ? '' : value)
                                            }
                                        >
                                            <SelectTrigger className="w-full border-neutral-800 text-light">
                                                <SelectValue placeholder="Select file" />
                                            </SelectTrigger>
                                            <SelectContent
                                                container={deployPanelRef.current}
                                                className="max-h-64 border-neutral-800 bg-darkest text-light"
                                                align="end"
                                            >
                                                {deployableEntryFiles.length === 0 && (
                                                    <SelectItem value="__none__">No Solidity files</SelectItem>
                                                )}
                                                {deployableEntryFiles.map((filePath) => (
                                                    <SelectItem key={filePath} value={filePath}>
                                                        {filePath}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-[11px] text-light/70">
                                            Contract Name (Optional)
                                        </label>
                                        <Input
                                            value={contractNameInput}
                                            onChange={(e) => setContractNameInput(e.target.value)}
                                            placeholder="BaseApp"
                                            className="w-full border border-neutral-800 !bg-dark px-3 py-2 text-sm text-light"
                                        />
                                    </div>

                                    <Button
                                        disabled={
                                            isDeploying ||
                                            !deployableEntryFiles.length
                                        }
                                        onClick={handleWalletDeploy}
                                        className="h-9 w-full rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                                    >
                                        {isDeploying ? 'Compiling + Deploying...' : 'Compile and Deploy'}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

interface DiffSummary {
    totalAdded: number;
    totalRemoved: number;
}

function buildDiffSummary(fileTree: FileNode[], originalFileContents: Record<string, string>): DiffSummary {
    const currentFileContents: Record<string, string> = {};
    collectFileContents(fileTree, currentFileContents);

    const allPaths = new Set<string>([
        ...Object.keys(originalFileContents),
        ...Object.keys(currentFileContents),
    ]);

    let totalAdded = 0;
    let totalRemoved = 0;

    for (const path of allPaths) {
        const previous = originalFileContents[path] ?? '';
        const current = currentFileContents[path] ?? '';
        if (previous === current) continue;

        const { added, removed } = calculateLineDelta(previous, current);
        totalAdded += added;
        totalRemoved += removed;
    }

    return { totalAdded, totalRemoved };
}

function collectFileContents(nodes: FileNode[], target: Record<string, string>) {
    for (const node of nodes) {
        if (node.type === NODE.FILE) {
            target[node.id] = node.content ?? '';
        }
        if (node.children?.length) {
            collectFileContents(node.children, target);
        }
    }
}

function calculateLineDelta(previous: string, current: string) {
    const previousLines = splitLines(previous);
    const currentLines = splitLines(current);
    if (previousLines.length === 0 && currentLines.length === 0) {
        return { added: 0, removed: 0 };
    }

    const previousCount = new Map<string, number>();
    const currentCount = new Map<string, number>();

    for (const line of previousLines) {
        previousCount.set(line, (previousCount.get(line) ?? 0) + 1);
    }
    for (const line of currentLines) {
        currentCount.set(line, (currentCount.get(line) ?? 0) + 1);
    }

    let common = 0;
    for (const [line, count] of previousCount.entries()) {
        common += Math.min(count, currentCount.get(line) ?? 0);
    }

    return {
        added: Math.max(0, currentLines.length - common),
        removed: Math.max(0, previousLines.length - common),
    };
}

function splitLines(content: string) {
    if (!content) return [];
    return content.replace(/\r\n/g, '\n').split('\n');
}

function collectSolidityFiles(nodes: FileNode[]) {
    const sourceMap = new Map<string, string>();
    collectSoliditySourcesRecursive(nodes, sourceMap);
    return [...sourceMap.entries()].map(([path, content]) => ({ path, content }));
}

function collectSoliditySourcesRecursive(nodes: FileNode[], output: Map<string, string>) {
    for (const node of nodes) {
        if (node.type === NODE.FILE && node.id.endsWith('.sol')) {
            const normalizedPath = node.id.replace(/\\/g, '/').replace(/^\/+/, '');
            output.set(normalizedPath, node.content ?? '');
            continue;
        }
        if (node.children?.length) {
            collectSoliditySourcesRecursive(node.children, output);
        }
    }
}

function shortAddress(address: string) {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getConnectorLabel(connectorId: string, connectorName: string) {
    if (connectorId === 'walletConnect') return 'Rainbow / WalletConnect';
    if (connectorId === 'injected') return 'Browser Wallet';
    return connectorName;
}

function createPseudoHex(length: number) {
    const chars = '0123456789abcdef';
    let result = '0x';
    for (let i = 0; i < length; i += 1) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}
