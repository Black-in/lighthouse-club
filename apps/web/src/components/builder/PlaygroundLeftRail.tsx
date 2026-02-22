/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';

import { useState } from 'react';
import { cn } from '@/src/lib/utils';
import EditorSidePanel from '../code/EditorSidePanel';
import ToolTipComponent from '../ui/TooltipComponent';
import PlaygroundSettingsModal from './PlaygroundSettingsModal';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import GithubConnectModal from '../nav/GithubConnectModal';

interface PlaygroundLeftRailProps {
    visible: boolean;
}

export default function PlaygroundLeftRail({ visible }: PlaygroundLeftRailProps) {
    const [openSettings, setOpenSettings] = useState(false);
    const [openGithubModal, setOpenGithubModal] = useState(false);
    const { session } = useUserSessionStore();
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
