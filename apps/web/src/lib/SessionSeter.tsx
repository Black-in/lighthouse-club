/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';

import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useEffect } from 'react';
import { AppSession } from '@/src/types/auth-session';

interface SessionSetterProps {
    session: AppSession | null;
}
export default function SessionSetter({ session }: SessionSetterProps) {
    const { setSession } = useUserSessionStore();
    useEffect(() => {
        setSession(session);
    }, [session, setSession]);

    return null;
}
