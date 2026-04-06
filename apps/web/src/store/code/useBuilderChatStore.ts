/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { Message, MODEL, Template } from '@lighthouse/types';
import { create } from 'zustand';

interface ContractState {
    messages: Message[];
    phase: string;
    loading: boolean;
    loadingStartedAt: number | null;
    currentFileEditing: string | null;
    selectedModel: MODEL;
    activeTemplate: Template | null; // Move template state here too
}

interface BuilderChatState {
    contracts: Record<string, ContractState>; // Key by contractId
    currentContractId: string | null;
    setCurrentContractId: (contractId: string) => void;
    getCurrentContract: () => ContractState;
    setCurrentFileEditing: (file: string | null) => void;
    setSelectedModel: (model: MODEL, contractId?: string) => void;
    setLoading: (loading: boolean) => void;
    setPhase: (phase: string) => void;
    setMessage: (message: Message) => void;
    upsertMessage: (message: Partial<Message> & { id: string }) => void;
    setActiveTemplate: (template: Template | null) => void;
    resetTemplate: () => void;
    cleanContract: (contractId: string) => void;
}

const getDefaultContractState = (): ContractState => ({
    messages: [],
    phase: '',
    loading: false,
    loadingStartedAt: null,
    currentFileEditing: null,
    selectedModel: MODEL.GEMINI,
    activeTemplate: null,
});

export const useBuilderChatStore = create<BuilderChatState>((set, get) => ({
    contracts: {},
    currentContractId: null,

    setCurrentContractId: (contractId) => {
        set({ currentContractId: contractId });
        // Initialize contract state if it doesn't exist
        const { contracts } = get();
        if (!contracts[contractId]) {
            set({
                contracts: {
                    ...contracts,
                    [contractId]: getDefaultContractState(),
                },
            });
        }
    },

    getCurrentContract: () => {
        const { contracts, currentContractId } = get();
        if (!currentContractId || !contracts[currentContractId]) {
            return getDefaultContractState();
        }
        return contracts[currentContractId];
    },

    setCurrentFileEditing: (file) => {
        const { contracts, currentContractId } = get();
        if (!currentContractId) return;

        set({
            contracts: {
                ...contracts,
                [currentContractId]: {
                    ...contracts[currentContractId],
                    currentFileEditing: file,
                },
            },
        });
    },

    setSelectedModel: (model, contractId) => {
        const { contracts, currentContractId } = get();
        const targetContractId = contractId || currentContractId;
        if (!targetContractId) return;

        const currentContract = contracts[targetContractId] || getDefaultContractState();
        set({
            contracts: {
                ...contracts,
                [targetContractId]: {
                    ...currentContract,
                    selectedModel: model,
                },
            },
        });
    },

    setLoading: (loading) => {
        const { contracts, currentContractId } = get();
        if (!currentContractId) return;
        const currentContract = contracts[currentContractId] || getDefaultContractState();
        const nextLoadingStartedAt = loading
            ? currentContract.loadingStartedAt ?? Date.now()
            : null;

        set({
            contracts: {
                ...contracts,
                [currentContractId]: {
                    ...currentContract,
                    loading,
                    loadingStartedAt: nextLoadingStartedAt,
                },
            },
        });
    },

    setPhase: (phase) => {
        const { contracts, currentContractId } = get();
        if (!currentContractId) return;

        set({
            contracts: {
                ...contracts,
                [currentContractId]: {
                    ...contracts[currentContractId],
                    phase,
                },
            },
        });
    },

    setMessage: (message) => {
        const { contracts, currentContractId } = get();
        if (!currentContractId) return;

        const currentContract = contracts[currentContractId] || getDefaultContractState();
        const lastMessage = currentContract.messages.at(-1);
        const isAdjacentDuplicate =
            lastMessage?.contractId === message.contractId &&
            lastMessage?.role === message.role &&
            lastMessage?.content === message.content &&
            lastMessage?.templateId === message.templateId;

        if (isAdjacentDuplicate) {
            return;
        }

        set({
            contracts: {
                ...contracts,
                [currentContractId]: {
                    ...currentContract,
                    messages: [...currentContract.messages, message],
                },
            },
        });
    },

    upsertMessage: (message: Partial<Message> & { id: string }) => {
        const { contracts, currentContractId } = get();
        if (!currentContractId) return;

        const currentContract = contracts[currentContractId] || getDefaultContractState();
        const messages = currentContract.messages;
        const existingIndex = messages.findIndex((msg) => msg.id === message.id);
        const duplicateContentIndex =
            existingIndex === -1
                ? messages.findIndex(
                      (msg) =>
                          msg.contractId === message.contractId &&
                          msg.role === message.role &&
                          msg.content === message.content &&
                          msg.role === 'USER',
                  )
                : -1;

        let updatedMessages: Message[];
        if (existingIndex !== -1) {
            updatedMessages = messages.map((msg) =>
                msg.id === message.id ? { ...msg, ...message } : msg,
            );
        } else if (duplicateContentIndex !== -1) {
            updatedMessages = messages.map((msg, index) =>
                index === duplicateContentIndex ? ({ ...msg, ...message } as Message) : msg,
            );
        } else {
            updatedMessages = [...messages, message as Message];
        }

        updatedMessages.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateA - dateB;
        });

        set({
            contracts: {
                ...contracts,
                [currentContractId]: {
                    ...currentContract,
                    messages: updatedMessages,
                },
            },
        });
    },

    setActiveTemplate: (template) => {
        const { contracts, currentContractId } = get();
        if (!currentContractId) return;

        const currentContract = contracts[currentContractId] || getDefaultContractState();
        set({
            contracts: {
                ...contracts,
                [currentContractId]: {
                    ...currentContract,
                    activeTemplate: template,
                },
            },
        });
    },

    resetTemplate: () => {
        const { contracts, currentContractId } = get();
        if (!currentContractId) return;

        const currentContract = contracts[currentContractId] || getDefaultContractState();
        set({
            contracts: {
                ...contracts,
                [currentContractId]: {
                    ...currentContract,
                    activeTemplate: null,
                },
            },
        });
    },

    cleanContract: (contractId) => {
        const { contracts } = get();
        const newContracts = { ...contracts };
        delete newContracts[contractId];
        set({ contracts: newContracts });
    },
}));
