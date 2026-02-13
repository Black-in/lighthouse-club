/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { signIn } from 'next-auth/react';
import { IoIosPaperPlane, IoLogoGithub } from 'react-icons/io';
import { FaGithub } from 'react-icons/fa';
import ToolTipComponent from '../ui/TooltipComponent';
import { Button } from '../ui/button';
import { WalletPanel } from '../base/WalletPanel';
import ProfileMenu from '../utility/ProfileMenu';
import { toast } from 'sonner';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import ExportPanel from './ExportPanel.';
import { useCurrentContract } from '@/src/hooks/useCurrentContract';
import VersionLockTicker from '../tickers/VersionLockTicker';

export default function BuilderNavbarRightSection() {
    const [openWalletPanel, setOpenWalletPanel] = useState<boolean>(false);
    const [showRepoPanel, setShowRepoPanel] = useState<boolean>(false);
    const [openProfileMenu, setOpenProfleMenu] = useState<boolean>(false);
    const [isConnectingGithub, setIsConnectingGithub] = useState<boolean>(false);
    const contract = useCurrentContract();
    const { session } = useUserSessionStore();
    const { loading } = contract;

    const hasGithub = session?.user?.hasGithub;
    const panelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setShowRepoPanel(false);
            }
        }
        if (showRepoPanel) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showRepoPanel]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('githubLinked') === 'true') {
            toast.success('GitHub connected successfully!');
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, []);

    async function handleConnectGitHub() {
        try {
            setIsConnectingGithub(true);

            if (session?.user?.id) {
                document.cookie = `linking_user_id=${session.user.id}; path=/; max-age=300`;
            }

            await signIn('github', {
                callbackUrl: `${window.location.pathname}`,
                redirect: true,
            });
        } catch (error) {
            toast.error('Failed to connect GitHub');
            console.error('github connection error:', error);
            setIsConnectingGithub(false);
        }
    }

    return (
        <div className="flex items-center justify-between gap-x-3 relative">
            <div className="flex items-center justify-center">
                <ToolTipComponent content="upcoming feature" side="bottom">
                    <Button
                        disabled={loading}
                        onClick={() => setOpenWalletPanel(true)}
                        size="xs"
                        className="bg-light text-darkest hover:bg-light hover:text-darkest tracking-wider cursor-pointer transition-transform hover:-translate-y-0.5 duration-300 font-semibold exec-button-dark !rounded-none !rounded-l-[4px]"
                    >
                        <IoIosPaperPlane className="size-3.5" />
                        <span className="text-[11px]">Deploy</span>
                    </Button>
                </ToolTipComponent>

                {!hasGithub ? (
                    <ToolTipComponent content="Connect GitHub to export code" side="bottom">
                        <Button
                            onClick={handleConnectGitHub}
                            disabled={isConnectingGithub || loading}
                            size="xs"
                            className="bg-[#24292e] text-white hover:bg-[#1a1e22] gap-1.5 tracking-wider cursor-pointer transition-transform hover:-translate-y-0.5 font-semibold rounded-none !rounded-r-[4px] disabled:opacity-50 disabled:cursor-not-allowed exec-button-dark"
                        >
                            <FaGithub className="size-3.5" />
                            <span className="text-[11px]">
                                {isConnectingGithub ? 'Connecting...' : 'Connect GitHub'}
                            </span>
                        </Button>
                    </ToolTipComponent>
                ) : (
                    <div className="relative w-full" ref={panelRef}>
                        <ToolTipComponent content="Export codebase to GitHub" side="bottom">
                            <Button
                                disabled={loading}
                                onClick={() => setShowRepoPanel((prev) => !prev)}
                                size="xs"
                                className="bg-[#24292e] text-white hover:bg-[#1a1e22] gap-1.5 tracking-wider cursor-pointer transition-transform hover:-translate-y-0.5 font-semibold rounded-none !rounded-r-[4px] disabled:opacity-50 disabled:cursor-not-allowed exec-button-dark"
                            >
                                <IoLogoGithub className="size-3.5" />
                            </Button>
                        </ToolTipComponent>

                        {showRepoPanel && <ExportPanel />}
                    </div>
                )}
            </div>

            {session?.user?.image && (
                <Image
                    onClick={() => setOpenProfleMenu((prev) => !prev)}
                    src={session.user.image}
                    alt="user"
                    width={28}
                    height={28}
                    className="rounded-full cursor-pointer hover:ring-2 hover:ring-primary transition"
                />
            )}
            {openProfileMenu && (
                <div className="absolute top-full right-2 mt-2 z-[9999]">
                    <ProfileMenu setOpenProfleMenu={setOpenProfleMenu} />
                </div>
            )}

            {openWalletPanel && <WalletPanel close={() => setOpenWalletPanel(false)} />}
        </div>
    );
}
