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
import { useCurrentContract } from '@/src/hooks/useCurrentContract';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { FileNode, NODE } from '@lighthouse/types';
import { useParams } from 'next/navigation';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import Marketplace from '@/src/lib/server/marketplace-server';
import { toast } from 'sonner';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import {
    useAccount,
    useConnect,
    useDisconnect,
    usePublicClient,
    useSwitchChain,
    useWalletClient,
} from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';

export default function RightPanelActions() {
    const [showDiffPanel, setShowDiffPanel] = useState<boolean>(false);
    const [showDeployPanel, setShowDeployPanel] = useState<boolean>(false);
    const [deployNetwork, setDeployNetwork] = useState<'base-sepolia' | 'base-mainnet'>(
        'base-sepolia',
    );
    const [entryFile, setEntryFile] = useState<string>('');
    const [contractNameInput, setContractNameInput] = useState<string>('');
    const [isDeploying, setIsDeploying] = useState<boolean>(false);
    const contract = useCurrentContract();
    const { loading } = contract;
    const { fileTree, originalFileContents } = useCodeEditor();
    const { session } = useUserSessionStore();
    const currentContractId = useBuilderChatStore((state) => state.currentContractId);
    const params = useParams<{ contractId?: string | string[] }>();
    const routeContractId = Array.isArray(params?.contractId)
        ? params.contractId[0]
        : params?.contractId;
    const contractId = routeContractId || currentContractId || '';

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

    const targetChainId = deployNetwork === 'base-mainnet' ? base.id : baseSepolia.id;
    const targetPublicClient = usePublicClient({ chainId: targetChainId });
    const { address, isConnected, chainId } = useAccount();
    const { connect, connectors, isPending: isConnecting } = useConnect();
    const { disconnect } = useDisconnect();
    const { data: walletClient } = useWalletClient();
    const { switchChainAsync } = useSwitchChain();

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
        if (!session?.user?.token) {
            toast.error('Please sign in first');
            return;
        }
        if (!contractId) {
            toast.error('Missing contract id');
            return;
        }
        if (!isConnected || !address) {
            toast.error('Connect wallet first');
            return;
        }
        if (!walletClient) {
            toast.error('Wallet client not ready. Reconnect and try again.');
            return;
        }
        if (!targetPublicClient) {
            toast.error('RPC client unavailable for selected network');
            return;
        }
        if (!solidityFiles.length) {
            toast.error('No Solidity files found to compile');
            return;
        }

        setIsDeploying(true);
        try {
            if (chainId !== targetChainId) {
                if (!switchChainAsync) {
                    toast.error('Switch wallet network to Base before deploying');
                    return;
                }
                await switchChainAsync({ chainId: targetChainId });
            }

            const compileResult = await Marketplace.compileWalletDeployArtifact(
                session.user.token,
                contractId,
                {
                    files: solidityFiles,
                    entryFile: entryFile || undefined,
                    contractName: contractNameInput.trim() || undefined,
                },
            );
            if (!compileResult.success || !compileResult.data) {
                toast.error(compileResult.message || 'Compilation failed');
                return;
            }

            const artifact = compileResult.data;
            if (!artifact.bytecode || artifact.bytecode === '0x') {
                toast.error(`Contract ${artifact.contractName} has empty deploy bytecode`);
                return;
            }

            toast.message(`Broadcasting ${artifact.contractName} deployment...`);
            const txHash = await walletClient.sendTransaction({
                account: address,
                chain: targetChainId === base.id ? base : baseSepolia,
                data: artifact.bytecode,
            });

            const receipt = await targetPublicClient.waitForTransactionReceipt({ hash: txHash });
            const deployedAddress = receipt.contractAddress;
            if (!deployedAddress) {
                toast.error('Transaction mined but contract address was not returned');
                return;
            }

            const explorerBase =
                deployNetwork === 'base-mainnet'
                    ? 'https://basescan.org/tx/'
                    : 'https://sepolia.basescan.org/tx/';
            const selfDeploySaved = await Marketplace.registerSelfDeploy(session.user.token, contractId, {
                network: deployNetwork,
                contractAddress: deployedAddress,
                txHash,
                explorerUrl: `${explorerBase}${txHash}`,
                walletAddress: address,
            });

            if (!selfDeploySaved.success) {
                toast.error(selfDeploySaved.message || 'Deployment succeeded but save failed');
                return;
            }

            toast.success(`Deployed ${artifact.contractName} at ${shortAddress(deployedAddress)}`);
            if (artifact.warnings?.length) {
                toast.message(`Compiled with ${artifact.warnings.length} warning(s)`);
            }
            setShowDeployPanel(false);
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
                    <div className="absolute top-[calc(100%+0.7rem)] right-0 z-50 w-[25rem] rounded-xl border border-neutral-800 bg-black px-3 py-3 shadow-[0_24px_60px_-35px_rgba(0,0,0,1)]">
                        <div className="mb-3">
                            <p className="text-xs font-medium text-light/90">Wallet Deploy (Base)</p>
                            <p className="text-[11px] text-light/55 mt-1">
                                Compiles Solidity from the current editor tree and deploys from your
                                wallet. Rainbow works via WalletConnect.
                            </p>
                        </div>

                        {!isConnected ? (
                            <div className="mb-3">
                                <p className="text-[11px] text-light/70 mb-2">Connect a wallet first</p>
                                <div className="flex flex-wrap gap-2">
                                    {connectors.map((connector) => (
                                        <Button
                                            key={connector.uid}
                                            size="xs"
                                            disabled={isConnecting}
                                            onClick={() => connect({ connector })}
                                            className="bg-neutral-900 hover:bg-neutral-800 text-light border border-neutral-700 rounded-[4px]"
                                        >
                                            {isConnecting
                                                ? 'Connecting...'
                                                : getConnectorLabel(connector.id, connector.name)}
                                        </Button>
                                    ))}
                                </div>
                                {!connectors.some((connector) => connector.id === 'walletConnect') && (
                                    <p className="text-[10px] text-amber-400/80 mt-2">
                                        Add `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` to enable Rainbow
                                        mobile connection.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="mb-3 rounded-md border border-neutral-800 bg-neutral-900/40 p-2">
                                <p className="text-[11px] text-light/80">
                                    Connected: {shortAddress(address || '0x')}
                                </p>
                                <p className="text-[10px] text-light/55 mt-1">
                                    Current chain: {chainId === base.id ? 'Base Mainnet' : 'Base Sepolia'}
                                </p>
                                <Button
                                    size="xs"
                                    onClick={() => disconnect()}
                                    className="mt-2 h-6 bg-neutral-800 hover:bg-neutral-700 text-light rounded-[4px]"
                                >
                                    Disconnect
                                </Button>
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="text-[11px] text-light/70">Target Network</label>
                            <select
                                value={deployNetwork}
                                onChange={(e) =>
                                    setDeployNetwork(e.target.value as 'base-sepolia' | 'base-mainnet')
                                }
                                className="mt-1 w-full border border-neutral-800 bg-darkest px-2 py-2 rounded-[4px] text-xs text-light"
                            >
                                <option value="base-sepolia">Base Sepolia</option>
                                <option value="base-mainnet">Base Mainnet</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="text-[11px] text-light/70">Entry Solidity File</label>
                            <select
                                value={entryFile}
                                onChange={(e) => setEntryFile(e.target.value)}
                                className="mt-1 w-full border border-neutral-800 bg-darkest px-2 py-2 rounded-[4px] text-xs text-light"
                            >
                                {deployableEntryFiles.length === 0 && (
                                    <option value="">No Solidity files</option>
                                )}
                                {deployableEntryFiles.map((filePath) => (
                                    <option key={filePath} value={filePath}>
                                        {filePath}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="text-[11px] text-light/70">Contract Name (Optional)</label>
                            <Input
                                value={contractNameInput}
                                onChange={(e) => setContractNameInput(e.target.value)}
                                placeholder="BaseApp"
                                className="mt-1 w-full !bg-dark hover:bg-dark/80 border border-neutral-800 !rounded-[4px] px-3 py-2 text-sm text-light focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <Button
                            disabled={
                                isDeploying ||
                                !isConnected ||
                                !contractId ||
                                !session?.user?.token ||
                                !deployableEntryFiles.length
                            }
                            onClick={handleWalletDeploy}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-[4px] text-xs font-medium transition-colors"
                        >
                            {isDeploying ? 'Compiling + Deploying...' : 'Compile and Deploy'}
                        </Button>
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
