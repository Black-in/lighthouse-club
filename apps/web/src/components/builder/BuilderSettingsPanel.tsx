/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { useRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useHandleClickOutside } from '@/src/hooks/useHandleClickOutside';
import Sidebar from '../ui/Sidebar';
import { useParams } from 'next/navigation';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import Marketplace from '@/src/lib/server/marketplace-server';
import { toast } from 'sonner';

interface BuilderSettingsPanelProps {
    openSettingsPanel: boolean;
    setOpenSettingsPanel: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BuilderSettingsPanel({
    openSettingsPanel,
    setOpenSettingsPanel,
}: BuilderSettingsPanelProps) {
    const params = useParams();
    const contractId = params?.contractId as string | undefined;
    const { session } = useUserSessionStore();
    const settingsRef = useRef<HTMLDivElement>(null);
    useHandleClickOutside([settingsRef], setOpenSettingsPanel);
    const [settings, setSettings] = useState({
        contractType: 'CUSTOM',
        network: 'BASE_SEPOLIA',
        rpcUrl: 'https://sepolia.base.org',
        autoGenerate: true,
        includeTests: true,
        includeClient: true,
        compilerVersion: '0.8.24',
        securityLevel: 'standard',
    });
    const [selfDeploy, setSelfDeploy] = useState({
        network: 'base-sepolia' as 'base-sepolia' | 'base-mainnet',
        contractAddress: '',
        txHash: '',
    });
    const [isSavingSelfDeploy, setIsSavingSelfDeploy] = useState(false);

    async function handleSelfDeploySave() {
        if (!session?.user?.token) {
            toast.error('Please sign in first');
            return;
        }
        if (!contractId) {
            toast.error('Missing contract id');
            return;
        }
        if (!/^0x[a-fA-F0-9]{40}$/.test(selfDeploy.contractAddress.trim())) {
            toast.error('Enter a valid EVM contract address');
            return;
        }
        if (!/^0x[a-fA-F0-9]{64}$/.test(selfDeploy.txHash.trim())) {
            toast.error('Enter a valid transaction hash');
            return;
        }

        setIsSavingSelfDeploy(true);
        try {
            const explorerBase =
                selfDeploy.network === 'base-mainnet'
                    ? 'https://basescan.org/tx/'
                    : 'https://sepolia.basescan.org/tx/';
            const result = await Marketplace.registerSelfDeploy(session.user.token, contractId, {
                network: selfDeploy.network,
                contractAddress: selfDeploy.contractAddress.trim(),
                txHash: selfDeploy.txHash.trim(),
                explorerUrl: `${explorerBase}${selfDeploy.txHash.trim()}`,
            });

            if (!result.success) {
                toast.error(result.message || 'Failed to record deployment');
                return;
            }

            toast.success('Wallet deployment recorded');
            setSelfDeploy((prev) => ({ ...prev, contractAddress: '', txHash: '' }));
        } finally {
            setIsSavingSelfDeploy(false);
        }
    }

    return (
        <Sidebar
            open={openSettingsPanel}
            setOpen={setOpenSettingsPanel}
            content={
                <>
                    <div className="mb-4">
                        <label className="block text-xs font-semibold mb-2 text-gray-400">
                            Contract Type
                        </label>
                        <Select
                            value={settings.contractType}
                            onValueChange={(value) =>
                                setSettings({ ...settings, contractType: value })
                            }
                        >
                            <SelectTrigger className="w-full border-neutral-800 text-light">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent
                                container={settingsRef.current}
                                className="bg-darkest border-neutral-800 text-light"
                            >
                                <SelectItem value="CUSTOM">Custom</SelectItem>
                                <SelectItem value="TOKEN">Token</SelectItem>
                                <SelectItem value="NFT">NFT</SelectItem>
                                <SelectItem value="STAKING">Staking</SelectItem>
                                <SelectItem value="DAO">DAO</SelectItem>
                                <SelectItem value="DEFI">DeFi</SelectItem>
                                <SelectItem value="MARKETPLACE">Marketplace</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-semibold mb-2 text-gray-400">
                            Target Network
                        </label>
                        <Select
                            value={settings.network}
                            onValueChange={(value) => setSettings({ ...settings, network: value })}
                        >
                            <SelectTrigger className="w-full border-neutral-800 text-light">
                                <SelectValue placeholder="Select network" />
                            </SelectTrigger>
                            <SelectContent
                                container={settingsRef.current}
                                className="bg-darkest border-neutral-800 text-light"
                            >
                                <SelectItem value="BASE_SEPOLIA">Base Sepolia</SelectItem>
                                <SelectItem value="BASE_MAINNET">Base Mainnet</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-semibold mb-2 text-gray-400">
                            RPC URL
                        </label>
                        <Input
                            type="text"
                            className="w-full !bg-dark hover:bg-dark/80 border border-neutral-800 !rounded-[4px] px-3 py-2 text-sm text-light focus:outline-none focus:border-blue-500"
                            value={settings.rpcUrl}
                            onChange={(e) => setSettings({ ...settings, rpcUrl: e.target.value })}
                            placeholder="https://sepolia.base.org"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Used for deployment and testing
                        </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-neutral-800">
                        <div className="text-xs font-semibold mb-3 text-gray-300 tracking-wide">
                            Record Wallet Deployment
                        </div>
                        <p className="text-[11px] text-gray-500 mb-3 leading-relaxed">
                            Deploy from your own wallet on Base testnet/mainnet, then save contract address
                            and transaction hash here.
                        </p>

                        <div className="mb-3">
                            <label className="block text-xs font-semibold mb-2 text-gray-400">
                                Deploy Network
                            </label>
                            <Select
                                value={selfDeploy.network}
                                onValueChange={(value) =>
                                    setSelfDeploy((prev) => ({
                                        ...prev,
                                        network: value as 'base-sepolia' | 'base-mainnet',
                                    }))
                                }
                            >
                                <SelectTrigger className="w-full border-neutral-800 text-light">
                                    <SelectValue placeholder="Select deploy network" />
                                </SelectTrigger>
                                <SelectContent
                                    container={settingsRef.current}
                                    className="bg-darkest border-neutral-800 text-light"
                                >
                                    <SelectItem value="base-sepolia">Base Sepolia</SelectItem>
                                    <SelectItem value="base-mainnet">Base Mainnet</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mb-3">
                            <label className="block text-xs font-semibold mb-2 text-gray-400">
                                Contract Address
                            </label>
                            <Input
                                type="text"
                                className="w-full !bg-dark hover:bg-dark/80 border border-neutral-800 !rounded-[4px] px-3 py-2 text-sm text-light focus:outline-none focus:border-blue-500"
                                value={selfDeploy.contractAddress}
                                onChange={(e) =>
                                    setSelfDeploy((prev) => ({ ...prev, contractAddress: e.target.value }))
                                }
                                placeholder="0x..."
                            />
                        </div>

                        <div className="mb-3">
                            <label className="block text-xs font-semibold mb-2 text-gray-400">
                                Transaction Hash
                            </label>
                            <Input
                                type="text"
                                className="w-full !bg-dark hover:bg-dark/80 border border-neutral-800 !rounded-[4px] px-3 py-2 text-sm text-light focus:outline-none focus:border-blue-500"
                                value={selfDeploy.txHash}
                                onChange={(e) =>
                                    setSelfDeploy((prev) => ({ ...prev, txHash: e.target.value }))
                                }
                                placeholder="0x..."
                            />
                        </div>

                        <Button
                            disabled={isSavingSelfDeploy}
                            onClick={handleSelfDeploySave}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-[4px] text-xs font-medium transition-colors"
                        >
                            {isSavingSelfDeploy ? 'Saving deployment...' : 'Save Wallet Deployment'}
                        </Button>
                    </div>

                    {/* Solidity Version */}
                    <div className="mb-4">
                        <label className="block text-xs font-semibold mb-2 text-gray-400">
                            Solidity Version
                        </label>
                        <Select
                            value={settings.compilerVersion}
                            onValueChange={(value) =>
                                setSettings({ ...settings, compilerVersion: value })
                            }
                        >
                            <SelectTrigger className="w-full border-neutral-800 text-light">
                                <SelectValue placeholder="Select version" />
                            </SelectTrigger>
                            <SelectContent
                                container={settingsRef.current}
                                className="bg-darkest border-neutral-800 text-light"
                            >
                                <SelectItem value="0.8.24">0.8.24 (Recommended)</SelectItem>
                                <SelectItem value="0.8.23">0.8.23</SelectItem>
                                <SelectItem value="0.8.22">0.8.22</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-2 mt-4 pt-3 border-t border-neutral-800">
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded [4px]xt-xs font-medium transition-colors">
                            Save Settings
                        </Button>
                        <Button className="px-3 py-2 text-gray-400 hover:text-white text-xs transition-colors">
                            Reset
                        </Button>
                    </div>
                </>
            }
        />
    );
}
