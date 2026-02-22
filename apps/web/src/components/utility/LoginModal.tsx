/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import { signIn } from 'next-auth/react';
import { Dispatch, SetStateAction, useState } from 'react';
import Turnstile from 'react-turnstile';
import { FaGithub } from 'react-icons/fa';
import OpacityBackground from '../utility/OpacityBackground';
import { Button } from '../ui/button';
import { cn } from '@/src/lib/utils';
import ShaderSplitPanel from './ShaderSplitPanel';
import LighthouseMark from '../ui/svg/LighthouseMark';

interface LoginModalProps {
    opensignInModal: boolean;
    setOpenSignInModal: Dispatch<SetStateAction<boolean>>;
}

function LoginLeftContent() {
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
                    The software that codes, builds, and ships on its own.
                </p>
            </div>
        </div>
    );
}

function LoginRightContent() {
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const [signingInProvider, setSigningInProvider] = useState<'GOOGLE' | 'GITHUB' | null>(null);

    async function handleSignIn(type: 'GOOGLE' | 'GITHUB') {
        if (!turnstileToken) {
            return;
        }

        setSigningInProvider(type);

        try {
            document.cookie = `turnstile_token=${turnstileToken}; path=/; max-age=300; SameSite=Lax; Secure`;
            await signIn(type === 'GOOGLE' ? 'google' : 'github', {
                redirect: false,
                callbackUrl: '/',
            });
        } catch (error) {
            console.error('Sign in error:', error);
        } finally {
            setSigningInProvider(null);
        }
    }

    return (
        <div className="relative z-10 w-full flex flex-col items-center justify-center space-y-3 md:space-y-5">
            <div className="text-center space-y-1">
                <h2
                    className={cn(
                        'text-base md:text-xl',
                        'font-bold tracking-widest',
                        'bg-gradient-to-br from-[#e9e9e9] to-[#575757]',
                        'bg-clip-text text-transparent',
                    )}
                >
                    Welcome to BlackIn
                </h2>
                <p className="text-[8px] md:text-[13px] text-light/80 tracking-wide">
                    Sign in to your account
                </p>
            </div>

            <Button
                onClick={() => handleSignIn('GOOGLE')}
                disabled={!turnstileToken || signingInProvider !== null}
                className={cn(
                    'w-full flex items-center justify-center gap-2 md:gap-3',
                    'px-2 md:px-6 py-1 md:py-5 ',
                    'text-sm font-medium',
                    'bg-[#0f0f0f] hover:bg-[#141414]',
                    'border border-neutral-800 rounded-[8px]',
                    'transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                )}
            >
                <LighthouseMark size={16} className="text-[#d4d8de]" aria-hidden="true" />
                <span className="text-[#d4d8de] text-[8px] text-[8px] md:text-sm tracking-wide">
                    {signingInProvider === 'GOOGLE' ? 'Signing in...' : 'Continue with Google'}
                </span>
            </Button>

            <Button
                onClick={() => handleSignIn('GITHUB')}
                disabled={!turnstileToken || signingInProvider !== null}
                className={cn(
                    'w-full flex items-center justify-center gap-2 md:gap-3',
                    'px-2 md:px-6 py-1 md:py-5 ',
                    'text-sm font-medium',
                    'bg-[#0f0f0f] hover:bg-[#141414]',
                    'border border-neutral-800 rounded-[8px]',
                    'transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                )}
            >
                <FaGithub className="text-[#d4d8de] size-4 md:size-5" />
                <span className="text-[#d4d8de] text-[8px] md:text-sm tracking-wide">
                    {signingInProvider === 'GITHUB' ? 'Signing in...' : 'Continue with GitHub'}
                </span>
            </Button>

            <div className="w-full flex justify-center md:py-2">
                <Turnstile
                    className="bg-darkest border-0 rounded-full"
                    sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                    onVerify={(token) => setTurnstileToken(token)}
                    onError={() => setTurnstileToken(null)}
                    onExpire={() => setTurnstileToken(null)}
                    theme="dark"
                />
            </div>

            <div className="flex md:flex-none">
                <span className="text-[8px] md:text-xs text-neutral-300 tracking-wider">
                    By signing in, you agree to our <br className="hidden md:flex" />
                    <span className="text-[#7DA0CA] hover:underline cursor-pointer">
                        Terms & Service
                    </span>{' '}
                    and
                    <span className="text-[#7DA0CA] hover:underline cursor-pointer">
                        {' '}
                        Privacy Policy
                    </span>
                </span>
            </div>
        </div>
    );
}

export default function LoginModal({ opensignInModal, setOpenSignInModal }: LoginModalProps) {
    if (!opensignInModal) return null;

    return (
        <OpacityBackground
            className="bg-darkest/70"
            onBackgroundClick={() => setOpenSignInModal(false)}
        >
            <ShaderSplitPanel
                imageSrc="/signin.png"
                leftChildren={<LoginLeftContent />}
                rightChildren={<LoginRightContent />}
            />
        </OpacityBackground>
    );
}
