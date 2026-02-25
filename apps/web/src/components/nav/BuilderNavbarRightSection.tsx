/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import Image from 'next/image';
import { useState } from 'react';
import ProfileMenu from '../utility/ProfileMenu';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import RightPanelActions from '../builder/RightPanelActions';
import ToolTipComponent from '../ui/TooltipComponent';
import { Circle, MoonStar, SunMedium } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { usePlaygroundThemeStore } from '@/src/store/code/usePlaygroundThemeStore';

export default function BuilderNavbarRightSection() {
    const [openProfileMenu, setOpenProfleMenu] = useState<boolean>(false);
    const { session } = useUserSessionStore();
    const { theme, toggleTheme, isThemeSwitchEnabled } = usePlaygroundThemeStore();
    const nextThemeLabel =
        theme === 'light' ? 'dark mode' : theme === 'dark' ? 'legacy black mode' : 'light mode';

    return (
        <div className="flex items-center justify-end gap-x-3 relative">
            {isThemeSwitchEnabled && (
                <ToolTipComponent content={`Switch to ${nextThemeLabel}`} side="bottom">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label="Toggle playground theme"
                        className={cn(
                            'inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors',
                            theme === 'light'
                                ? 'border-neutral-300 bg-white text-[#1e293b] hover:border-neutral-400 hover:bg-[#f5f7fb]'
                                : theme === 'legacy'
                                  ? 'border-neutral-700 bg-[#111317] text-light/80 hover:border-neutral-500 hover:bg-[#181c22]'
                                  : 'border-neutral-700 bg-[#1c1c1c] text-light/80 hover:border-neutral-500 hover:bg-[#242424]',
                        )}
                    >
                        {theme === 'light' ? (
                            <MoonStar className="size-4" />
                        ) : theme === 'dark' ? (
                            <Circle className="size-4" />
                        ) : (
                            <SunMedium className="size-4" />
                        )}
                    </button>
                </ToolTipComponent>
            )}
            <RightPanelActions />
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
        </div>
    );
}
