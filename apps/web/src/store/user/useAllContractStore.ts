/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { Contract } from '@lighthouse/types';
import { create } from 'zustand';

interface AllContractStoreProps {
    allContracts: Contract[] | [];
    setAllContracts: (contract: Contract[]) => void;
}

export const useAllContractStore = create<AllContractStoreProps>((set) => ({
    allContracts: [],
    setAllContracts: (allContracts) => set({ allContracts }),
}));
