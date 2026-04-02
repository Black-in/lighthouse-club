/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/src/components/nav/Navbar';

const youtubeWatchUrl = 'https://www.youtube.com/watch?v=UGXNKP0y-ZM';
const youtubeEmbedUrl = 'https://www.youtube.com/embed/UGXNKP0y-ZM?rel=0';

export const metadata: Metadata = {
    title: 'BlackIn OpenAPI',
    description: 'Watch the BlackIn OpenAPI walkthrough video.',
};

export default function OpenApiPage() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#07090c] text-light">
            <div className="absolute inset-0 bg-grid opacity-40" />
            <div className="absolute left-1/2 top-32 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute right-8 top-56 h-64 w-64 rounded-full bg-sky-200/10 blur-3xl" />

            <Navbar />

            <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-16 pt-28 sm:px-6 lg:px-8">
                <section className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
                    <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary-light">
                        OpenAPI Walkthrough
                    </span>
                    <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                        Embedded product video for BlackIn OpenAPI
                    </h1>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-light/70 sm:text-lg">
                        This page embeds the requested YouTube video so it can be viewed directly
                        from the <span className="text-white">/openapi</span> route.
                    </p>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
                        <Link
                            href={youtubeWatchUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="exec-button-dark rounded-full px-5 py-2.5 font-semibold text-white"
                        >
                            Watch on YouTube
                        </Link>
                        <Link
                            href="/"
                            className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 font-semibold text-light/80 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            Back to BlackIn
                        </Link>
                    </div>
                </section>

                <section className="mx-auto mt-10 w-full max-w-5xl">
                    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black/40 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm">
                        <div className="border-b border-white/10 px-5 py-4 text-sm text-light/60">
                            Video source: {youtubeWatchUrl}
                        </div>
                        <div className="aspect-video w-full bg-black">
                            <iframe
                                className="h-full w-full"
                                src={youtubeEmbedUrl}
                                title="BlackIn OpenAPI walkthrough video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
