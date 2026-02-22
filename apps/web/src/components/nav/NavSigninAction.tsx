/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import { MdChevronRight } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useState, useRef } from 'react';
import LoginModal from '../utility/LoginModal';
import ProfileMenu from '../utility/ProfileMenu';
import { HoverBorderGradient } from '../ui/hover-border-gradient';

export default function NavbarSigninAction() {
    const { session } = useUserSessionStore();
    const router = useRouter();
    const [opensignInModal, setOpenSignInModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    function handler() {
        if (!session?.user || !session?.user.token) {
            setOpenSignInModal(true);
        } else {
            router.push('/home');
        }
    }

    return (
        <div className="relative">
            {!session?.user ? (
                <HoverBorderGradient
                    as="button"
                    onClick={handler}
                    containerClassName="rounded-full"
                    className="flex items-center gap-x-1.5 rounded-full bg-[#05070a] px-5 py-2 text-[13px] font-semibold tracking-wide text-white"
                    gradientColors={['rgb(193, 232, 255)', 'rgb(125, 160, 202)', 'rgb(5, 38, 89)']}
                    duration={5}
                    speed={0.14}
                    noiseIntensity={0.18}
                    backdropBlur
                >
                    <span>Sign in</span>
                    <MdChevronRight className="text-white" />
                </HoverBorderGradient>
            ) : (
                <div ref={dropdownRef} className="relative">
                    <div
                        onClick={() => setShowDropdown((prev) => !prev)}
                        className="flex items-center justify-center gap-x-3 hover:bg-neutral-700/70 py-1.5 px-3 rounded-lg cursor-pointer select-none"
                    >
                        <span className="text-light text-sm tracking-wider font-semibold hidden md:block">
                            {`${session?.user?.name?.split(' ')[0]}'s BlackIn`}
                        </span>
                        {session?.user.image && (
                            <Image
                                src={session?.user.image}
                                alt="user"
                                width={28}
                                height={28}
                                className="rounded-full"
                            />
                        )}
                    </div>

                    {showDropdown && (
                        <div className="absolute top-full right-2 mt-2 z-[9999]">
                            <ProfileMenu setOpenProfleMenu={setShowDropdown} />
                        </div>
                    )}
                </div>
            )}
            <LoginModal opensignInModal={opensignInModal} setOpenSignInModal={setOpenSignInModal} />
        </div>
    );
}
