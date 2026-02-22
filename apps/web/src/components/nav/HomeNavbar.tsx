'use client';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import Image from 'next/image';
import ProfileMenu from '../utility/ProfileMenu';
import { useState } from 'react';
import { IoIosCreate } from 'react-icons/io';

export default function HomeNavbar() {
    const [showLogoutDropdown, setShowLogoutDropdown] = useState<boolean>(false);
    const { session } = useUserSessionStore();

    return (
        <div className="w-full min-h-14 text-light/70 px-6 select-none relative flex justify-between items-center z-10">
            <div className="flex items-center overflow-hidden rounded-[4px] border border-neutral-700/80 bg-[#1f2227]">
                <div className="flex h-10 w-10 items-center justify-center border-r border-neutral-700/80 bg-[#171a1f]">
                    <Image
                        src="/icons/lighthouse-mark.svg"
                        alt="BlackIn logo"
                        width={18}
                        height={18}
                        className="h-[18px] w-[18px] object-contain"
                    />
                </div>
                <span
                    className="px-4 text-[18px] font-medium leading-none tracking-[-0.01em] text-white"
                    style={{
                        fontFamily:
                            '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, "Helvetica Neue", Arial, sans-serif',
                    }}
                >
                    BlackIn
                </span>
            </div>
            <div className="flex items-center justify-center gap-x-6 text-sm">
                <div className="font-semibold cursor-pointer flex items-center justify-center gap-x-2 hover:text-primary text-light/70 transition-transform hover:-translate-y-0.5">
                    <IoIosCreate className="hover:bg-neutral-700/70 hidden md:block rounded-sm p-[4px] h-7 w-7 select-none cursor-pointer" />
                    <span className="">Playgroud</span>
                </div>
                <div className="">
                    {session?.user?.image && (
                        <Image
                            onClick={() => setShowLogoutDropdown((prev) => !prev)}
                            src={session.user.image}
                            alt="user"
                            width={28}
                            height={28}
                            className="rounded-full cursor-pointer"
                        />
                    )}
                    {showLogoutDropdown && (
                        <div className="absolute top-full right-2 mt-2 z-9999">
                            <ProfileMenu setOpenProfleMenu={setShowLogoutDropdown} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
