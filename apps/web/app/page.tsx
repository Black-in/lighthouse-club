/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import Hero from '@/src/components/base/Hero';
import LenisProvider from '@/src/providers/LenisProvider';
import Navbar from '@/src/components/nav/Navbar';
import { useRef } from 'react';

export default function Page() {
    const inputRef = useRef<HTMLTextAreaElement>(null);

    return (
        <LenisProvider>
            <div className="min-h-screen w-full flex flex-col bg-dark relative select-none">
                <Navbar />
                <Hero inputRef={inputRef} />
            </div>
        </LenisProvider>
    );
}
