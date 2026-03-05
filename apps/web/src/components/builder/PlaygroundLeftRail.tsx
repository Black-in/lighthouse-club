/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';

import { useRef, useState } from 'react';
import EditorSidePanel from '../code/EditorSidePanel';
import ToolTipComponent from '../ui/TooltipComponent';
import PlaygroundSettingsModal from './PlaygroundSettingsModal';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import GithubConnectModal from '../nav/GithubConnectModal';
import { useRouter } from 'next/navigation';
import { useHandleClickOutside } from '@/src/hooks/useHandleClickOutside';
import { usePlaygroundThemeStore } from '@/src/store/code/usePlaygroundThemeStore';
import Image from 'next/image';

interface PlaygroundLeftRailProps {
    visible: boolean;
    onToggle: () => void;
}

export default function PlaygroundLeftRail({ visible, onToggle }: PlaygroundLeftRailProps) {
    const [openSettings, setOpenSettings] = useState(false);
    const [openGithubModal, setOpenGithubModal] = useState(false);
    const [openHomeConfirmModal, setOpenHomeConfirmModal] = useState(false);
    const homePopoverRef = useRef<HTMLDivElement>(null);
    const { session } = useUserSessionStore();
    const router = useRouter();
    const defaultProfilePhotos = [
        '/Profile default/prop1.jpg',
        '/Profile default/prop%202.jpg',
        '/Profile default/prop3.jpg',
        '/Profile default/prop4.jpg',
        '/Profile default/prop5%20.jpg',
        '/Profile default/prop6.jpg',
    ];
    const [randomDefaultPhoto] = useState(
        () => defaultProfilePhotos[Math.floor(Math.random() * defaultProfilePhotos.length)],
    );
    const { theme } = usePlaygroundThemeStore();

    const profileImageSrc = session?.user?.image || randomDefaultPhoto;

    useHandleClickOutside([homePopoverRef], setOpenHomeConfirmModal);

    return (
        <>
            {visible ? (
                <aside className="playground-left-rail absolute left-0 top-0 z-40 h-full w-16 bg-black">
                    <div className="flex h-full flex-col">
                        <div className="flex h-14 items-center justify-center px-2">
                            <ToolTipComponent side="right" content="Close sidebar">
                                <button
                                    type="button"
                                    onClick={onToggle}
                                    aria-label="Close sidebar"
                                    className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-[#16181d]"
                                >
                                    <Image
                                        src={
                                            theme === 'light'
                                                ? '/icons/blackin-mark-light.svg'
                                                : '/icons/blackin-mark-dark.svg'
                                        }
                                        alt="BlackIn official logo"
                                        width={28}
                                        height={28}
                                        draggable={false}
                                        className="h-7 w-7 select-none object-contain transition-transform duration-300 ease-out rotate-180"
                                    />
                                </button>
                            </ToolTipComponent>
                        </div>

                        <div className="min-h-0 flex-1 py-2">
                            <EditorSidePanel
                                showShell={false}
                                onHomeClick={() => setOpenHomeConfirmModal((prev) => !prev)}
                                onGithubClick={() => setOpenGithubModal(true)}
                                className="h-full w-full min-w-0 border-0 bg-transparent"
                            />
                        </div>

                        <div className="flex items-center justify-center px-3 pb-3 pt-2">
                            <ToolTipComponent side="right" content="Profile & Settings">
                                <button
                                    type="button"
                                    onClick={() => setOpenSettings(true)}
                                    aria-label="Open settings"
                                    className="playground-left-rail-profile flex items-center justify-center rounded-full p-[2px] ring-1 ring-neutral-700/80 transition hover:ring-neutral-500"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={profileImageSrc}
                                        alt={session?.user?.name || 'Profile'}
                                        className="h-7 w-7 rounded-full object-cover"
                                    />
                                </button>
                            </ToolTipComponent>
                        </div>
                    </div>

                    {openHomeConfirmModal && (
                        <div
                            ref={homePopoverRef}
                            className="playground-home-popover absolute left-[calc(100%+0.75rem)] top-4 z-50 w-[13.75rem] rounded-xl border border-neutral-800 bg-[#0b0d10] p-2 shadow-[0_20px_60px_-36px_rgba(0,0,0,1)]"
                        >
                            <div className="playground-home-popover-text text-xs leading-4 text-light/75">
                                <p className="whitespace-nowrap">Close current session and move</p>
                                <p className="whitespace-nowrap">to home page?</p>
                            </div>
                            <div className="mt-2 flex items-center justify-end gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setOpenHomeConfirmModal(false)}
                                    className="playground-home-popover-cancel rounded-md border border-neutral-800 bg-[#111317] px-2.5 py-1.5 text-xs font-medium text-light/80 transition hover:bg-[#171a20]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpenHomeConfirmModal(false);
                                        router.push('/');
                                    }}
                                    className="playground-home-popover-confirm rounded-md bg-[#d8e9ff] px-2.5 py-1.5 text-xs font-semibold text-black transition hover:bg-[#c7dcf7]"
                                >
                                    Home
                                </button>
                            </div>
                        </div>
                    )}
                </aside>
            ) : (
                <div className="absolute left-2 top-2 z-50">
                    <ToolTipComponent side="right" content="Open sidebar">
                        <button
                            type="button"
                            onClick={onToggle}
                            aria-label="Open sidebar"
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-black transition hover:bg-[#16181d]"
                        >
                            <Image
                                src={
                                    theme === 'light'
                                        ? '/icons/blackin-mark-light.svg'
                                        : '/icons/blackin-mark-dark.svg'
                                }
                                alt="BlackIn official logo"
                                width={28}
                                height={28}
                                draggable={false}
                                className="h-7 w-7 select-none object-contain transition-transform duration-300 ease-out"
                            />
                        </button>
                    </ToolTipComponent>
                </div>
            )}

            <PlaygroundSettingsModal
                openSettingsModal={openSettings}
                setOpenSettingsModal={setOpenSettings}
                profileImageSrc={profileImageSrc}
            />
            <GithubConnectModal
                openGithubModal={openGithubModal}
                setOpenGithubModal={setOpenGithubModal}
            />
        </>
    );
}
