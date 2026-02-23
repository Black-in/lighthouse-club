/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';

import { useRef, useState } from 'react';
import { cn } from '@/src/lib/utils';
import EditorSidePanel from '../code/EditorSidePanel';
import ToolTipComponent from '../ui/TooltipComponent';
import PlaygroundSettingsModal from './PlaygroundSettingsModal';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import GithubConnectModal from '../nav/GithubConnectModal';
import { useRouter } from 'next/navigation';
import { useHandleClickOutside } from '@/src/hooks/useHandleClickOutside';

interface PlaygroundLeftRailProps {
    visible: boolean;
}

export default function PlaygroundLeftRail({ visible }: PlaygroundLeftRailProps) {
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

    const profileImageSrc = session?.user?.image || randomDefaultPhoto;

    useHandleClickOutside([homePopoverRef], setOpenHomeConfirmModal);

    return (
        <>
            <aside
                className={cn(
                    'absolute left-0 top-0 z-40 h-full w-20 border-r border-transparent bg-[#060709] transition-transform duration-300 ease-out',
                    visible
                        ? 'translate-x-0 pointer-events-auto'
                        : '-translate-x-full pointer-events-none',
                )}
            >
                <div className="flex h-full flex-col">
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
                                className="flex items-center justify-center rounded-full p-[2px] ring-1 ring-neutral-700/80 transition hover:ring-neutral-500"
                            >
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
                        className="absolute left-[calc(100%+0.75rem)] top-4 z-50 w-[13.75rem] rounded-xl border border-neutral-800 bg-[#0b0d10] p-2 shadow-[0_20px_60px_-36px_rgba(0,0,0,1)]"
                    >
                        <div className="text-xs leading-4 text-light/75">
                            <p className="whitespace-nowrap">Close current session and move</p>
                            <p className="whitespace-nowrap">to home page?</p>
                        </div>
                        <div className="mt-2 flex items-center justify-end gap-1.5">
                            <button
                                type="button"
                                onClick={() => setOpenHomeConfirmModal(false)}
                                className="rounded-md border border-neutral-800 bg-[#111317] px-2.5 py-1.5 text-xs font-medium text-light/80 transition hover:bg-[#171a20]"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setOpenHomeConfirmModal(false);
                                    router.push('/');
                                }}
                                className="rounded-md bg-[#d8e9ff] px-2.5 py-1.5 text-xs font-semibold text-black transition hover:bg-[#c7dcf7]"
                            >
                                Home
                            </button>
                        </div>
                    </div>
                )}
            </aside>

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
