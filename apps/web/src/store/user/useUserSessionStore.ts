/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSession } from '@/src/types/auth-session';

interface UserSessionStoreType {
    session: AppSession | null;
    setSession: (data: AppSession | null) => void;
    clearSession: () => void;
}

export const useUserSessionStore = create<UserSessionStoreType>()(
    persist(
        (set) => ({
            session: null,
            setSession: (data: AppSession | null) => set({ session: data }),
            clearSession: () => set({ session: null }),
        }),
        {
            name: 'blackin-app-session',
        },
    ),
);
