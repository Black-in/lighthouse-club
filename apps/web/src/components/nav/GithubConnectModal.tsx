/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { cn } from '@/src/lib/utils';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import OpacityBackground from '../utility/OpacityBackground';
import ShaderSplitPanel from '../utility/ShaderSplitPanel';
import { Button } from '../ui/button';
import { usePrivy } from '@privy-io/react-auth';

interface GithubConnectModalProps {
    openGithubModal: boolean;
    setOpenGithubModal: Dispatch<SetStateAction<boolean>>;
}

function GithubConnectLeftContent() {
    return (
        <div className="playground-github-left absolute inset-0 flex items-end p-4 md:p-8">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        'linear-gradient(to top, rgba(0,0,0,0.78) 10%, rgba(0,0,0,0.52) 35%, rgba(0,0,0,0.18) 62%, rgba(0,0,0,0) 85%)',
                }}
            />
            <div
                className="playground-github-left-copy relative z-10 max-w-[420px] text-left [text-shadow:0_3px_14px_rgba(0,0,0,0.96)]"
                style={{
                    fontFamily:
                        '"Canela", "Ivar Display", "Noe Display", "Baskerville", "Times New Roman", "Georgia", serif',
                }}
            >
                <p className="text-[1rem] md:text-[2rem] font-normal text-white/95 leading-[1.04] tracking-[-0.01em]">
                    Connect your GitHub repository and push code directly from BlackIn.
                </p>
            </div>
        </div>
    );
}

function GithubConnectRightContent({
    onConnect,
    isConnecting,
    hasGithub,
}: {
    onConnect: () => Promise<void>;
    isConnecting: boolean;
    hasGithub: boolean;
}) {
    return (
        <div className="playground-github-right relative z-10 w-full flex flex-col items-center justify-center space-y-3 md:space-y-5">
            <div className="text-center space-y-1">
                <h2
                    className={cn(
                        'playground-github-title',
                        'text-base md:text-xl',
                        'font-bold tracking-widest',
                        'bg-gradient-to-br from-[#e9e9e9] to-[#575757]',
                        'bg-clip-text text-transparent',
                    )}
                >
                    Connect Git Repository
                </h2>
                <p className="playground-github-subtitle text-[10px] md:text-[13px] text-light/80 tracking-wide">
                    Link GitHub to export and sync your project.
                </p>
            </div>

            <Button
                onClick={onConnect}
                disabled={isConnecting || hasGithub}
                className={cn(
                    'playground-github-connect-btn',
                    'w-full flex items-center justify-center gap-2 md:gap-3',
                    'px-2 md:px-6 py-1 md:py-5',
                    'text-sm font-medium',
                    'bg-[#0f0f0f] hover:bg-[#141414]',
                    'border border-neutral-800 rounded-[8px]',
                    'transition-all disabled:opacity-60 disabled:cursor-not-allowed',
                )}
            >
                <FaGithub className="playground-github-connect-icon text-[#d4d8de] size-4 md:size-5" />
                <span className="playground-github-connect-text text-[#d4d8de] text-[10px] md:text-sm tracking-wide">
                    {hasGithub
                        ? 'GitHub connected'
                        : isConnecting
                          ? 'Connecting...'
                          : 'Connect GitHub Repository'}
                </span>
            </Button>
        </div>
    );
}

export default function GithubConnectModal({
    openGithubModal,
    setOpenGithubModal,
}: GithubConnectModalProps) {
    const [isConnecting, setIsConnecting] = useState(false);
    const { session } = useUserSessionStore();
    const { linkGithub } = usePrivy();
    const hasGithub = Boolean(session?.user?.hasGithub || session?.user?.githubUsername);

    if (!openGithubModal) return null;

    async function handleConnectGithub() {
        try {
            setIsConnecting(true);
            if (session?.user?.id) {
                document.cookie = `linking_user_id=${session.user.id}; path=/; max-age=300; SameSite=Lax; Secure`;
            }
            linkGithub();
        } finally {
            setIsConnecting(false);
        }
    }

    return (
        <OpacityBackground
            className="playground-github-overlay bg-darkest/70"
            onBackgroundClick={() => setOpenGithubModal(false)}
        >
            <div
                className="playground-github-modal"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <ShaderSplitPanel
                    imageSrc="/github connect.png"
                    leftChildren={<GithubConnectLeftContent />}
                    rightChildren={
                        <GithubConnectRightContent
                            onConnect={handleConnectGithub}
                            isConnecting={isConnecting}
                            hasGithub={hasGithub}
                        />
                    }
                />
            </div>
        </OpacityBackground>
    );
}
