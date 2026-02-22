'use client';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import Image from 'next/image';
import ProfileMenu from '../utility/ProfileMenu';
import { useState } from 'react';
import CompanyNavbarLogo from './CompanyNavbarLogo';
import { MdHomeFilled } from 'react-icons/md';
import { usePathname, useRouter } from 'next/navigation';

export default function HomeNavbar() {
    const [showLogoutDropdown, setShowLogoutDropdown] = useState<boolean>(false);
    const { session } = useUserSessionStore();
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div className="w-full min-h-14 text-light/70 px-6 select-none relative flex justify-between items-center z-10">
            <CompanyNavbarLogo />
            <div className="flex items-center justify-center gap-x-6 text-sm">
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
                {pathname === '/pricing' && (
                    <MdHomeFilled
                        onClick={() => router.push('/')}
                        className="h-7 w-7 cursor-pointer rounded-sm p-[4px] text-light/70 transition-transform hover:-translate-y-0.5 hover:bg-neutral-700/70"
                    />
                )}
            </div>
        </div>
    );
}
