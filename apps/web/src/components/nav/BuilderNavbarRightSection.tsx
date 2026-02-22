/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import Image from 'next/image';
import { useState } from 'react';
import ProfileMenu from '../utility/ProfileMenu';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';

export default function BuilderNavbarRightSection() {
    const [openProfileMenu, setOpenProfleMenu] = useState<boolean>(false);
    const { session } = useUserSessionStore();

    return (
        <div className="flex items-center justify-end gap-x-3 relative">
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
