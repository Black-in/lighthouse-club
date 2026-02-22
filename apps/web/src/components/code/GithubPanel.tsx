/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { PiGithubLogoFill } from 'react-icons/pi';
import { Button } from '../ui/button';
import { FaGithub } from 'react-icons/fa';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';

export default function GithubPanel() {
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const { session } = useUserSessionStore();
    const hasGithub = Boolean(session?.user?.hasGithub || session?.user?.githubUsername);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (new URLSearchParams(window.location.search).get('githubLinked') === 'true') {
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, []);

    async function handleGithubConnect() {
        try {
            setIsConnecting(true);
            if (session?.user?.id) {
                document.cookie = `linking_user_id=${session.user.id}; path=/; max-age=300`;
            }
            await signIn('github', {
                callbackUrl: `${window.location.pathname}`,
                redirect: true,
            });
        } finally {
            setIsConnecting(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-start h-full w-full text-light/90">
            <div className="flex flex-col items-center gap-y-4 px-5 py-6">
                <PiGithubLogoFill size={48} />
                <h2 className="text-lg font-semibold">Connect your GitHub</h2>
                <p className="text-[13px] text-light/60 text-center tracking-wide">
                    Connect your GitHub account to automatically push your generated contract to
                    your repository.
                </p>
                {!hasGithub ? (
                    <Button
                        onClick={handleGithubConnect}
                        disabled={isConnecting}
                        size="xs"
                        className="bg-[#24292e] text-light hover:bg-[#24292e] gap-2.5 tracking-wider cursor-pointer font-semibold rounded-[4px] w-full"
                    >
                        <FaGithub className="size-3.5 text-light" />
                        <span className="text-[11px]">
                            {isConnecting ? 'Connecting...' : 'Connect GitHub'}
                        </span>
                    </Button>
                ) : (
                    <Button
                        disabled={true}
                        className="mt-2 bg-light/10 hover:bg-light/20 text-primary rounded-[4px] px-6 py-2"
                    >
                        <PiGithubLogoFill size={20} />
                        connected to github
                    </Button>
                )}
            </div>
        </div>
    );
}
