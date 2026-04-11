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
        <div
            className={`fixed inset-0 overflow-hidden bg-[#070708] ${className}`}
            aria-hidden="true"
        >
            <div className="pointer-events-none absolute inset-0 bg-black/35" />
        </div>
    );
}
