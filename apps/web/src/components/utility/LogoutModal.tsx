/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import { Dispatch, SetStateAction } from 'react';
import { IoShieldCheckmark } from 'react-icons/io5';
import { MdSecurity } from 'react-icons/md';
import { HiOutlineLogout } from 'react-icons/hi';
import OpacityBackground from '../utility/OpacityBackground';
import { Button } from '../ui/button';
import { cn } from '@/src/lib/utils';
import ShaderSplitPanel from './ShaderSplitPanel';
import { IoMdLogOut } from 'react-icons/io';
import { usePrivy } from '@privy-io/react-auth';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';

interface LogoutModalProps {
    openLogoutModal: boolean;
    setOpenLogoutModal: Dispatch<SetStateAction<boolean>>;
}

function LogoutLeftContent() {
    return (
        <div className="absolute inset-0 flex flex-col justify-end p-8">
            <div className="space-y-4 text-left">
                <h3 className="text-2xl font-bold text-light tracking-wide leading-tight">
                    Secure Session Management
                    <br />
                    <span className="text-light">Your data stays protected.</span>
                </h3>

                <p className="text-sm text-light/70 leading-relaxed max-w-[300px]">
                    When you log out, all your session data is cleared from this device. Your
                    projects and settings remain safely stored in the cloud.
                </p>

                <div className="flex items-center gap-2 mb-2">
                    <IoShieldCheckmark
                        className={cn(
                            'text-[#14F195] text-xl h-10 w-10 p-2 border border-neutral-500 rounded-[8px]',
                        )}
                    />
                    <MdSecurity
                        className={cn(
                            'text-[#7DA0CA] text-xl h-10 w-10 p-2 border border-neutral-500 rounded-[8px]',
                        )}
                    />
                    <HiOutlineLogout
                        className={cn(
                            'text-light text-xl h-10 w-10 p-2 border border-light/70 rounded-[8px]',
                        )}
                    />
                </div>
            </div>
        </div>
    );
}

function LogoutRightContent({
    setOpenLogoutModal,
}: {
    setOpenLogoutModal: Dispatch<SetStateAction<boolean>>;
}) {
    const { logout } = usePrivy();
    const { clearSession } = useUserSessionStore();

    async function LogoutHandler() {
        await logout();
        clearSession();
        const secureAttr = window.location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = `blackin_token=; path=/; max-age=0; SameSite=Lax${secureAttr}`;
        window.location.href = '/';
    }

    return (
        <div className="relative z-10 w-full flex flex-col items-start justify-center space-y-6 text-left">
            <div className="space-y-3">
                <h2
                    className={cn(
                        'text-2xl font-bold tracking-wide',
                        'bg-gradient-to-br from-[#e9e9e9] to-[#575757]',
                        'bg-clip-text text-transparent',
                    )}
                >
                    Sign Out?
                </h2>
                <p className="text-sm text-neutral-400 font-normal tracking-wide leading-relaxed">
                    You&apos;ll be logged out of your current session and redirected to the sign-in
                    page.
                </p>
            </div>

            <div className="w-full space-y-3 py-2">
                <div className="flex items-start gap-3 p-3 bg-neutral-900/40 border border-neutral-800 rounded-[8px]">
                    <IoShieldCheckmark className="text-green-500 mt-0.5 flex-shrink-0 text-lg" />
                    <div className="space-y-0.5">
                        <p className="text-xs font-medium text-neutral-300">Session cleared</p>
                        <p className="text-xs text-neutral-500">
                            Local data removed from this device
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-neutral-900/40 border border-neutral-800 rounded-[8px]">
                    <MdSecurity className="text-[#7DA0CA] mt-0.5 flex-shrink-0 text-lg" />
                    <div className="space-y-0.5">
                        <p className="text-xs font-medium text-neutral-300">Data protected</p>
                        <p className="text-xs text-neutral-500">
                            Projects safely stored in the cloud
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full pt-2">
                <div className="flex gap-3 w-full">
                    <Button
                        onClick={() => setOpenLogoutModal(false)}
                        className={cn(
                            'flex-1 px-6 py-5 text-sm font-medium',
                            'bg-[#0f0f0f] hover:bg-[#141414]',
                            'border border-neutral-800 rounded-[8px]',
                            'cursor-pointer tracking-wide transition-all',
                        )}
                    >
                        <span className="text-[#d4d8de]">Cancel</span>
                    </Button>
                    <Button
                        onClick={LogoutHandler}
                        className={cn(
                            'flex-1 px-6 py-5 text-sm font-medium',
                            'bg-red-600/60 hover:bg-red-700/70',
                            'rounded-[8px]',
                            'cursor-pointer tracking-wide transition-all',
                        )}
                    >
                        <span className="text-light">Sign Out</span>
                        <IoMdLogOut />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function LogoutModal({ openLogoutModal, setOpenLogoutModal }: LogoutModalProps) {
    if (!openLogoutModal) return null;

    return (
        <OpacityBackground
            className="bg-darkest/70"
            onBackgroundClick={() => setOpenLogoutModal(false)}
        >
            <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                <ShaderSplitPanel
                    imageSrc="/icons/blackin-mark-dark.svg"
                    leftChildren={<LogoutLeftContent />}
                    rightChildren={<LogoutRightContent setOpenLogoutModal={setOpenLogoutModal} />}
                />
            </div>
        </OpacityBackground>
    );
}
