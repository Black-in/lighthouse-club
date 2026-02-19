/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { Contract } from '@lighthouse/types';
import { create } from 'zustand';

interface ContractStoreProps {
    userContracts: Contract[] | [];
    setUserContracts: (contracts: Contract[]) => void;
    removeContract: (contractId: string) => void;
}

export const useContractStore = create<ContractStoreProps>((set) => ({
    userContracts: [],
    setUserContracts: (userContracts) => set({ userContracts }),
    removeContract: (contractId) =>
        set((state) => ({
            userContracts: state.userContracts.filter((contract) => contract.id !== contractId),
        })),
}));
