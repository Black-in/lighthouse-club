/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { useBuilderChatStore } from '../store/code/useBuilderChatStore';

export const useCurrentContract = () => {
    const getCurrentContract = useBuilderChatStore((state) => state.getCurrentContract);
    return getCurrentContract();
};
