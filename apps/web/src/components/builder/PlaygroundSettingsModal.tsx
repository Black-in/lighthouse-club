/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';

import { Dispatch, SetStateAction } from 'react';
import { cn } from '@/src/lib/utils';
import OpacityBackground from '../utility/OpacityBackground';
import ShaderSplitPanel from '../utility/ShaderSplitPanel';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';

interface PlaygroundSettingsModalProps {
    openSettingsModal: boolean;
    setOpenSettingsModal: Dispatch<SetStateAction<boolean>>;
    profileImageSrc?: string;
}

function SettingsLeftContent() {
    return (
        <div className="absolute inset-0 flex items-end p-4 md:p-8">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        'linear-gradient(to top, rgba(0,0,0,0.78) 10%, rgba(0,0,0,0.52) 35%, rgba(0,0,0,0.18) 62%, rgba(0,0,0,0) 85%)',
                }}
            />
            <div
                className="relative z-10 max-w-[420px] text-left [text-shadow:0_3px_14px_rgba(0,0,0,0.96)]"
                style={{
                    fontFamily:
                        '"Canela", "Ivar Display", "Noe Display", "Baskerville", "Times New Roman", "Georgia", serif',
                }}
            >
                <p className="text-[1rem] md:text-[2rem] font-normal text-white/95 leading-[1.04] tracking-[-0.01em]">
                    Settings for your BlackIn workspace.
                </p>
            </div>
        </div>
    );
}

function SettingsRightContent({ profileImageSrc }: { profileImageSrc?: string }) {
    const { session } = useUserSessionStore();

    return (
        <div className="relative z-10 w-full flex flex-col justify-center space-y-4 md:space-y-6">
            <div className="text-center space-y-1">
                <h2
                    className={cn(
                        'text-base md:text-xl',
                        'font-bold tracking-widest',
                        'bg-gradient-to-br from-[#e9e9e9] to-[#575757]',
                        'bg-clip-text text-transparent',
                    )}
                >
                    Settings
                </h2>
                <p className="text-[10px] md:text-[13px] text-light/80 tracking-wide">
                    Placeholder view. Settings page coming soon.
                </p>
            </div>

            <div className="rounded-[10px] border border-neutral-800 bg-[#0f0f10] px-3 py-3 md:px-4 md:py-4">
                <p className="text-[10px] md:text-xs uppercase tracking-[0.18em] text-light/50">
                    Connected Account
                </p>
                <div className="mt-2 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={profileImageSrc || '/icons/blackin-mark-dark.svg'}
                        alt={session?.user?.name || 'Profile'}
                        className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                        <p className="truncate text-sm md:text-base text-light/95">
                            {session?.user?.name || 'BlackIn User'}
                        </p>
                        <p className="truncate text-[11px] md:text-sm text-light/65">
                            {session?.user?.email || 'No email connected'}
                        </p>
                        <p className="truncate text-[11px] md:text-sm text-light/70">
                            {session?.user?.githubUsername
                                ? `@${session.user.githubUsername}`
                                : 'GitHub not connected'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PlaygroundSettingsModal({
    openSettingsModal,
    setOpenSettingsModal,
    profileImageSrc,
}: PlaygroundSettingsModalProps) {
    if (!openSettingsModal) return null;

    return (
        <OpacityBackground
            className="bg-darkest/70"
            onBackgroundClick={() => setOpenSettingsModal(false)}
        >
            <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                <ShaderSplitPanel
                    imageSrc="/signin.png"
                    leftChildren={<SettingsLeftContent />}
                    rightChildren={<SettingsRightContent profileImageSrc={profileImageSrc} />}
                />
            </div>
        </OpacityBackground>
    );
}
