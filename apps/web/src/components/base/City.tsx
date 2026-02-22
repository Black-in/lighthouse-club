/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';

interface City3DProps {
    className?: string;
}

export default function City3D({ className = '' }: City3DProps) {
    return (
        <div className={`fixed inset-0 overflow-hidden ${className}`} aria-hidden="true">
            <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="h-full w-full object-cover"
            >
                <source src="/videos/hero-background.mp4" type="video/mp4" />
            </video>
            <div className="pointer-events-none absolute inset-0 bg-black/45" />
        </div>
    );
}
