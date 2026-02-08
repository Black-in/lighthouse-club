/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { Account, AuthOptions, ISODateString } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { JWT } from 'next-auth/jwt';
import axios from 'axios';
import { SIGNIN_URL } from '@/routes/api_routes';

export interface UserType {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    provider?: string | null;
    token?: string | null;
    hasGithub?: boolean;
    githubUsername?: string | null;
}

export interface CustomSession {
    user?: UserType;
    expires: ISODateString;
}

export const authOption: AuthOptions = {
    pages: { signIn: '/' },
    session: { strategy: 'jwt' },

    callbacks: {
        async signIn({ user, account }: { user: UserType; account: Account | null }) {
            try {
                let turnstileToken: string | null = null;
                let linkingUserId: string | null = null;

                if (typeof window === 'undefined') {
                    try {
                        const { cookies } = await import('next/headers');
                        const cookieStore = await cookies();
                        const turnstileCookie = cookieStore.get('turnstile_token');
                        const linkingCookie = cookieStore.get('linking_user_id');

                        turnstileToken = turnstileCookie?.value || null;
                        linkingUserId = linkingCookie?.value || null;
                    } catch (error) {
                        console.error('error reading cookies in signin callback:', error);
                    }
                }

                if (account?.provider === 'google' || account?.provider === 'github') {
                    const response = await axios.post(
                        SIGNIN_URL,
                        {
                            user,
                            account,
                            turnstileToken,
                            linkingUserId,
                        },
                        { withCredentials: true },
                    );

                    const result = response.data;

                    if (result?.success) {
                        user.id = result.user.id;
                        user.name = result.user.name;
                        user.email = result.user.email;
                        user.image = result.user.image;
                        user.provider = result.user.provider;
                        user.hasGithub = result.user.hasGithub;
                        user.githubUsername = result.user.githubUsername;

                        if (result.token) {
                            user.token = result.token;
                        }

                        return true;
                    }
                }

                return false;
            } catch (err) {
                console.error('signin error:', err);
                return false;
            }
        },

        async jwt({ token, user }) {
            if (user) {
                const prev = token.user as UserType | undefined;
                const incoming = user as UserType;

                token.user = {
                    ...prev,
                    ...incoming,
                    token: incoming.token ?? prev?.token ?? null,
                };
            }
            return token;
        },

        async session({ session, token }: { session: CustomSession; token: JWT }) {
            session.user = token.user as UserType;
            return session;
        },
    },

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code',
                },
            },
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
            authorization: {
                params: {
                    scope: 'repo user',
                },
            },
        }),
    ],
};
