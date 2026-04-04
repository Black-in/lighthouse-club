/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import {
    COMPILE_WALLET_DEPLOY,
    DELETE_CONTRACT,
    GET_ALL_CONTRACTS,
    GET_ALL_TEMPLATES,
    GET_USER_CONTRACTS,
    REGISTER_SELF_DEPLOY,
} from '@/routes/api_routes';
import { Contract, Template } from '@lighthouse/types';
import axios from 'axios';
import { shouldEnableDevAccessClient } from '../runtime-mode';

type CompileWalletArtifactPayload = {
    files?: Array<{
        path: string;
        content: string;
    }>;
    entryFile?: string;
    contractName?: string;
    optimizerRuns?: number;
};

type CompileWalletArtifactResponse = {
    success: boolean;
    message?: string;
    data?: {
        entryFile: string;
        contractName: string;
        abi: unknown[];
        bytecode: `0x${string}`;
        warnings?: string[];
        compilerVersion?: string;
    };
};

function parseBooleanFlag(value: string | undefined): boolean | null {
    if (!value) return null;
    const normalized = value.trim().toLowerCase();
    if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
    if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
    return null;
}

function shouldUseDeployPlaceholderMode() {
    const envFlag = parseBooleanFlag(process.env.NEXT_PUBLIC_DEPLOY_PLACEHOLDER_MODE);
    if (envFlag !== null) return envFlag;
    return true;
}

export default class Marketplace {
    public static async getUserContracts(token: string): Promise<Contract[]> {
        try {
            const { data } = await axios.get(GET_USER_CONTRACTS, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return data.data;
        } catch (error) {
            console.error('Failed to fetch user contracts', error);
            return [];
        }
    }

    public static async getAllContracts(token: string): Promise<Contract[]> {
        try {
            const { data } = await axios.get(GET_ALL_CONTRACTS, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return data.data;
        } catch (error) {
            console.error('Failed to fetch all contracts', error);
            return [];
        }
    }

    public static async getTemplates(): Promise<Template[]> {
        const isLocalHostname =
            typeof window !== 'undefined' &&
            ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim() ?? '';
        const backendIsRemote = /^https?:\/\//i.test(backendUrl) && !/localhost|127\.0\.0\.1|::1/.test(backendUrl);
        const skipTemplatesFetch =
            process.env.NEXT_PUBLIC_SKIP_TEMPLATES_FETCH === 'true' ||
            shouldEnableDevAccessClient() ||
            (isLocalHostname && backendIsRemote);

        if (skipTemplatesFetch) {
            return [];
        }

        try {
            const { data } = await axios.get(GET_ALL_TEMPLATES);

            return data.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    // Some environments do not expose templates endpoint.
                    return [];
                }
                // In local/dev, backend can be intentionally offline while rendering landing pages.
                if (!error.response) {
                    return [];
                }
            }
            console.warn('Failed to fetch templates');
            return [];
        }
    }

    public static async deleteContract(
        token: string,
        contractId: string,
    ): Promise<{
        success: boolean;
        contractId: string;
    }> {
        try {
            const { data } = await axios.delete(`${DELETE_CONTRACT}/${contractId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return {
                success: data.success,
                contractId: data.contractId,
            };
        } catch (error) {
            console.error('Failed to delete contract', error);
            return {
                success: false,
                contractId,
            };
        }
    }

    public static async registerSelfDeploy(
        token: string,
        contractId: string,
        payload: {
            network: 'base-sepolia' | 'base-mainnet';
            contractAddress: string;
            txHash: string;
            explorerUrl?: string;
            walletAddress?: string;
        },
    ): Promise<{
        success: boolean;
        message?: string;
    }> {
        try {
            const { data } = await axios.post(`${REGISTER_SELF_DEPLOY}/${contractId}/self-deploy`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return {
                success: !!data?.success,
                message: data?.message || 'Self deployment recorded',
            };
        } catch (error) {
            console.error('Failed to register self deployment', error);
            return {
                success: false,
                message: 'Failed to record self deployment',
            };
        }
    }

    public static async compileWalletDeployArtifact(
        token: string,
        contractId: string,
        payload: CompileWalletArtifactPayload,
    ): Promise<CompileWalletArtifactResponse> {
        if (shouldUseDeployPlaceholderMode()) {
            const fallbackEntry =
                payload.entryFile ||
                payload.files?.find((file) => file.path.toLowerCase().endsWith('.sol'))?.path ||
                'contracts/Contract.sol';
            const fallbackName =
                payload.contractName ||
                fallbackEntry.split('/').pop()?.replace(/\.sol$/i, '') ||
                'BaseContract';

            return {
                success: true,
                message: 'Placeholder compile artifact generated',
                data: {
                    entryFile: fallbackEntry,
                    contractName: fallbackName,
                    abi: [],
                    bytecode: '0x6080604052',
                    warnings: ['Deploy placeholder mode enabled'],
                    compilerVersion: 'placeholder',
                },
            };
        }

        try {
            const { data } = await axios.post(
                `${COMPILE_WALLET_DEPLOY}/${contractId}/compile-wallet-deploy`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return {
                success: !!data?.success,
                message: data?.message,
                data: data?.data,
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    success: false,
                    message:
                        (error.response?.data as { message?: string } | undefined)?.message ||
                        'Failed to compile deployment artifact',
                };
            }
            console.warn('Failed to compile wallet deploy artifact');
            return {
                success: false,
                message: 'Failed to compile deployment artifact',
            };
        }
    }
}
