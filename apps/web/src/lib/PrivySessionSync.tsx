/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';

import { useEffect, useRef } from 'react';
import { useOAuthTokens, usePrivy, User } from '@privy-io/react-auth';
import axios from 'axios';
import { SIGNIN_URL } from '@/routes/api_routes';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { AppSession, AppUserType } from '@/src/types/auth-session';
import { shouldSkipAuthClient } from '@/src/lib/auth-bypass';

function readCookie(name: string) {
    if (typeof document === 'undefined') return null;
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
    if (typeof document === 'undefined') return;
    const securePart = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${securePart}`;
}

function clearCookie(name: string) {
    if (typeof document === 'undefined') return;
    const securePart = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax${securePart}`;
}

function resolveProvider(user: User): 'google' | 'github' | null {
    if (user.github) return 'github';
    if (user.google) return 'google';
    return null;
}

function getUserIdentity(user: User) {
    const email = user.google?.email ?? user.github?.email ?? user.email?.address ?? null;
    const name = user.google?.name ?? user.github?.name ?? user.github?.username ?? email;
    const githubUsername = user.github?.username ?? null;
    return { email, name, githubUsername };
}

function buildSessionFromUser({
    privyUser,
    token,
    backendUser,
}: {
    privyUser: User;
    token: string | null;
    backendUser?: Partial<AppUserType>;
}): AppSession {
    const provider = resolveProvider(privyUser);
    const identity = getUserIdentity(privyUser);

    return {
        user: {
            id: backendUser?.id ?? null,
            privyId: privyUser.id,
            email: backendUser?.email ?? identity.email,
            name: backendUser?.name ?? identity.name,
            image: backendUser?.image ?? null,
            provider: backendUser?.provider ?? provider,
            token,
            hasGithub: backendUser?.hasGithub ?? Boolean(privyUser.github),
            githubUsername: backendUser?.githubUsername ?? identity.githubUsername,
        },
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
}

function buildDemoSession(): AppSession {
    return {
        user: {
            id: 'dev-local-user',
            privyId: 'dev-local-user',
            email: 'dev@blackin.local',
            name: 'Demo User',
            image: null,
            provider: 'dev',
            token: 'dev-local-token',
            hasGithub: false,
            githubUsername: null,
        },
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
}

export default function PrivySessionSync() {
    const skipAuth = shouldSkipAuthClient();
    const { ready, authenticated, user } = usePrivy();
    const { session, setSession, clearSession } = useUserSessionStore();
    const isCaptchaEnabled = process.env.NEXT_PUBLIC_ENABLE_CAPTCHA === 'true';
    const isSyncingRef = useRef(false);
    const oauthAccessTokensRef = useRef<Partial<Record<'google' | 'github', string>>>({});

    useOAuthTokens({
        onOAuthTokenGrant: ({ oAuthTokens }) => {
            if (oAuthTokens.provider === 'google' || oAuthTokens.provider === 'github') {
                oauthAccessTokensRef.current[oAuthTokens.provider] = oAuthTokens.accessToken;
            }
        },
    });

    useEffect(() => {
        if (skipAuth) {
            const demoSession = buildDemoSession();
            if (session?.user?.id !== demoSession.user.id || session?.user?.token !== demoSession.user.token) {
                setSession(demoSession);
            }
            writeCookie('blackin_token', demoSession.user.token ?? '', 60 * 60 * 24 * 30);
            clearCookie('linking_user_id');
            clearCookie('turnstile_token');
            return;
        }

        if (!ready) return;

        if (!authenticated || !user) {
            const persistedToken = session?.user?.token ?? null;
            if (persistedToken) {
                writeCookie('blackin_token', persistedToken, 60 * 60 * 24 * 30);
                return;
            }
            clearSession();
            clearCookie('blackin_token');
            clearCookie('linking_user_id');
            return;
        }

        const samePrivyUser = session?.user?.privyId === user.id;
        const existingToken = session?.user?.token ?? null;
        const shouldSyncGithubLink = Boolean(user.github) && !session?.user?.hasGithub;
        const linkingCookieUserId = readCookie('linking_user_id');

        if (samePrivyUser && existingToken && !shouldSyncGithubLink) {
            writeCookie('blackin_token', existingToken, 60 * 60 * 24 * 30);
            return;
        }

        const provider = resolveProvider(user);
        if (!provider || isSyncingRef.current) return;

        const turnstileToken = readCookie('turnstile_token');
        const linkingUserId =
            linkingCookieUserId ??
            (provider === 'github' && session?.user?.id ? session.user.id : null);
        const isLinkingFlow = Boolean(linkingUserId && provider === 'github');

        if (isCaptchaEnabled && !turnstileToken && !isLinkingFlow) {
            return;
        }

        const { email, name } = getUserIdentity(user);
        if (!email) return;

        isSyncingRef.current = true;

        const account = {
            provider,
            providerAccountId: provider === 'github' ? user.github?.subject : user.google?.subject,
            access_token: oauthAccessTokensRef.current[provider] ?? null,
        };

        axios
            .post(SIGNIN_URL, {
                user: {
                    email,
                    name,
                    image: null,
                },
                account,
                turnstileToken: isLinkingFlow || !isCaptchaEnabled ? null : turnstileToken,
                linkingUserId: isLinkingFlow ? linkingUserId : null,
            })
            .then((response) => {
                const { user: backendUser, token } = response.data ?? {};
                if (!token) return;

                setSession(
                    buildSessionFromUser({
                        privyUser: user,
                        token,
                        backendUser: backendUser ?? {},
                    }),
                );

                writeCookie('blackin_token', token, 60 * 60 * 24 * 30);
                clearCookie('turnstile_token');
                clearCookie('linking_user_id');
            })
            .catch((error) => {
                console.error('Failed to sync Privy session:', error);
            })
            .finally(() => {
                isSyncingRef.current = false;
            });
    }, [skipAuth, ready, authenticated, user, session, setSession, clearSession, isCaptchaEnabled]);

    return null;
}
