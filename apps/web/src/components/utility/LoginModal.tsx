/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import { useLoginWithOAuth } from '@privy-io/react-auth';
import { usePrivy } from '@privy-io/react-auth';
import { Component, Dispatch, ErrorInfo, ReactNode, SetStateAction, useEffect, useState } from 'react';
import Turnstile from 'react-turnstile';
import OpacityBackground from '../utility/OpacityBackground';
import { Button } from '../ui/button';
import { cn } from '@/src/lib/utils';
import ShaderSplitPanel from './ShaderSplitPanel';
import LighthouseMark from '../ui/svg/LighthouseMark';

interface LoginModalProps {
    opensignInModal: boolean;
    setOpenSignInModal: Dispatch<SetStateAction<boolean>>;
}

interface UIErrorBoundaryProps {
    children: ReactNode;
    fallback: ReactNode;
    onError?: (error: Error) => void;
}

interface UIErrorBoundaryState {
    hasError: boolean;
}

class UIErrorBoundary extends Component<UIErrorBoundaryProps, UIErrorBoundaryState> {
    public state: UIErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
        this.props.onError?.(error);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }

        return this.props.children;
    }
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
    const [isCaptchaUnavailable, setIsCaptchaUnavailable] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const { initOAuth, state } = useLoginWithOAuth();
    const { login } = usePrivy();
    const isCaptchaEnabled = process.env.NEXT_PUBLIC_ENABLE_CAPTCHA === 'true';
    const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? '';
    const hasConfiguredCaptcha =
        turnstileSiteKey.length > 0 && !turnstileSiteKey.includes('replace_with_turnstile_site_key');

    useEffect(() => {
        if (state.status === 'error') {
            setAuthError(
                state.error?.message ||
                    'Google sign-in failed. Ensure localhost:3000 is allowed in Privy app settings.',
            );
            return;
        }
        if (state.status === 'initial' || state.status === 'done') {
            setAuthError(null);
        }
    }, [state]);

    async function handleSignInWithGoogle() {
        if (isCaptchaEnabled && !turnstileToken) {
            return;
        }
        setAuthError(null);

        try {
            if (turnstileToken) {
                const isSecureOrigin = window.location.protocol === 'https:';
                const secureAttr = isSecureOrigin ? '; Secure' : '';
                document.cookie = `turnstile_token=${turnstileToken}; path=/; max-age=300; SameSite=Lax${secureAttr}`;
            }
            await initOAuth({
                provider: 'google',
            });
        } catch (error) {
            console.error('Sign in error:', error);
            setAuthError(
                error instanceof Error
                    ? error.message
                    : 'Google OAuth redirect failed. Trying embedded login fallback.',
            );
            login({
                loginMethods: ['google'],
            });
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
                onClick={handleSignInWithGoogle}
                disabled={state.status === 'loading' || (isCaptchaEnabled && !turnstileToken)}
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
                    {state.status === 'loading' ? 'Signing in...' : 'Continue with Google'}
                </span>
            </Button>
            {authError ? (
                <div className="w-full rounded-md border border-amber-500/30 bg-amber-900/20 px-3 py-2">
                    <p className="text-[10px] md:text-xs text-amber-200">{authError}</p>
                </div>
            ) : null}

            <div className="w-full flex justify-center md:py-2">
                {!isCaptchaEnabled ? (
                    <span className="text-[10px] md:text-xs text-neutral-400 tracking-wide">
                        Captcha disabled.
                    </span>
                ) : !hasConfiguredCaptcha || isCaptchaUnavailable ? (
                    <span className="text-[10px] md:text-xs text-amber-300/90 tracking-wide">
                        Captcha is not configured for this domain.
                    </span>
                ) : (
                    <UIErrorBoundary
                        fallback={
                            <span className="text-[10px] md:text-xs text-amber-300/90 tracking-wide">
                                Captcha is not available on this domain.
                            </span>
                        }
                        onError={(error) => {
                            setTurnstileToken(null);
                            setIsCaptchaUnavailable(true);
                            console.error('Turnstile render failed:', error);
                        }}
                    >
                        <Turnstile
                            className="bg-darkest border-0 rounded-full"
                            sitekey={turnstileSiteKey}
                            onVerify={(token) => setTurnstileToken(token)}
                            onError={() => {
                                setTurnstileToken(null);
                                setIsCaptchaUnavailable(true);
                            }}
                            onExpire={() => setTurnstileToken(null)}
                            theme="dark"
                        />
                    </UIErrorBoundary>
                )}
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
                rightChildren={
                    <UIErrorBoundary
                        fallback={
                            <div className="text-center px-4 space-y-2">
                                <p className="text-sm text-amber-200">
                                    Sign in is unavailable in this local runtime.
                                </p>
                                <p className="text-xs text-neutral-400">
                                    Use your deployed domain for full auth flow.
                                </p>
                            </div>
                        }
                        onError={(error) => {
                            console.error('Login modal initialization failed:', error);
                        }}
                    >
                        <LoginRightContent />
                    </UIErrorBoundary>
                }
            />
        </OpacityBackground>
    );
}
