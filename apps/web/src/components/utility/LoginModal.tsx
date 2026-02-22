/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import { signIn } from 'next-auth/react';
import { Dispatch, SetStateAction, useState } from 'react';
import Turnstile from 'react-turnstile';
import { FaGithub } from 'react-icons/fa';
import { SiRust, SiSolana } from 'react-icons/si';
import { IoSparkles } from 'react-icons/io5';
import OpacityBackground from '../utility/OpacityBackground';
import { Button } from '../ui/button';
import AppLogo from '../tickers/AppLogo';
import { cn } from '@/src/lib/utils';
import ShaderSplitPanel from './ShaderSplitPanel';
import LighthouseMark from '../ui/svg/LighthouseMark';

interface LoginModalProps {
    opensignInModal: boolean;
    setOpenSignInModal: Dispatch<SetStateAction<boolean>>;
}

function LoginLeftContent() {
    const logos = [
        { logo: IoSparkles, color: '#9e83ff' },
        { logo: SiRust, color: '#ff6b35' },
        { logo: SiSolana, color: '#14f195' },
    ];

    return (
        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
            <div className="flex items-start">
                <AppLogo className="text-sm" />
            </div>

            <div className="space-y-2 md:space-y-4 text-left">
                <h3 className="text-xs md:text-2xl font-bold text-light tracking-wide leading-tight">
                    Where AI meets Anchor.
                    <br />
                    <span className="text-light">No PhD required.</span>
                </h3>

                <p className="text-[8px] md:text-sm text-light/70 leading-relaxed max-w-[300px]">
                    Generate Rust smart contracts, deploy to Solana, and ship production-ready
                    dApps. All with the confidence of someone who actually read the Anchor docs.
                </p>

                <div className="flex items-center gap-2 mb-2">
                    {logos.map((l, i) => (
                        <div
                            key={i}
                            className={cn(
                                `text-[${l.color}] text-xl h-6 md:h-10 w-6 md:w-10 p-1 md:p-2 border-[0.5px] md:border border-neutral-500 rounded-[8px]`,
                                'flex justify-center items-center',
                            )}
                        >
                            <l.logo className={cn('size-4 md:size-5')} />
                        </div>
                    ))}
                </div>
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
                    <span className="text-[#9e83ff] hover:underline cursor-pointer">
                        Terms & Service
                    </span>{' '}
                    and
                    <span className="text-[#9e83ff] hover:underline cursor-pointer">
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
                imageSrc="/icons/lighthouse-mark-dark.svg"
                leftChildren={<LoginLeftContent />}
                rightChildren={<LoginRightContent />}
            />
        </OpacityBackground>
    );
}
