/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { TiHome } from 'react-icons/ti';
import DustParticles from '@/src/components/base/DustParticles';
import Link from 'next/link';
import Navbar from '@/src/components/nav/Navbar';
import { Button } from '@/src/components/ui/button';

export default function NotFoundPage() {
    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div className="bg-[#080808] text-neutral-400 antialiased min-h-screen flex flex-col relative overflow-hidden selection:bg-primary selection:text-white">
            <DustParticles particleColor={0xfdf9f0} />
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"></div>
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary opacity-[0.08] blur-[120px] rounded-full mix-blend-screen"></div>
            </div>

            <Navbar />

            <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 w-full max-w-7xl mx-auto">
                <div className="w-full max-w-2xl relative">
                    <div className="flex flex-col items-center text-center p-8 md:p-12">
                        <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 shadow-[0_0_10px_-4px_#5483B3]">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                            </span>
                            <span className="text-[11px] font-medium text-primary tracking-wide uppercase">
                                404 Error
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-4 drop-shadow-sm bg-linear-to-t from-neutral-700 via-neutral-300 to-neutral-200 bg-clip-text text-transparent">
                            Page not found
                        </h1>

                        <p className="text-neutral-500 text-sm md:text-base max-w-md mx-auto mb-10 leading-relaxed font-normal">
                            The requested resource could not be found on this server. It might have
                            been moved to a new URL or removed entirely.
                        </p>

                        <div className="w-full max-w-sm flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <Button
                                    onClick={handleGoBack}
                                    className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs font-medium transition-all"
                                >
                                    <ArrowLeft size={14} strokeWidth={1.5} />
                                    Go Back
                                </Button>
                                <Link
                                    href="/"
                                    className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-linear-to-b from-[#5483B3] to-[#052659] border-[#5483B3] hover:bg-[#052659] text-white text-xs font-medium transition-all shadow-[0_4px_20px_-8px_rgba(84,131,179,0.5)] border"
                                >
                                    <TiHome size={14} strokeWidth={1.5} />
                                    Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
