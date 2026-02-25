/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';

import { Skeleton } from '@/components/ui/skeleton';
import AppLogo from '../tickers/AppLogo';
import { JSX } from 'react';

interface BuilderMessageSkeletonProps {
    loading: boolean;
}

export default function BuilderMessageSkeleton({
    loading,
}: BuilderMessageSkeletonProps): JSX.Element {
    if (!loading) {
        return <></>;
    }
    return (
        <div className="playground-chat-skeleton w-full space-y-4 overflow-x-hidden custom-scrollbar">
            <div className="flex justify-end w-full">
                <div className="flex items-start justify-end gap-x-2 max-w-[70%] w-full min-w-0">
                    <div className="flex flex-col items-end gap-2 min-w-0 w-full">
                        <Skeleton className="playground-chat-skeleton-block h-12 w-full rounded-b-[8px] rounded-tl-[8px] bg-dark" />

                        <div className="flex items-center gap-2">
                            <Skeleton className="playground-chat-skeleton-block h-3 w-12 bg-dark" />
                            <Skeleton className="playground-chat-skeleton-block h-3 w-3 rounded-sm bg-dark" />
                        </div>
                    </div>

                    <Skeleton className="playground-chat-skeleton-avatar h-8 w-8 rounded-full shrink-0 bg-dark" />
                </div>
            </div>

            <div className="flex justify-start w-full">
                <div className="flex items-start gap-x-2 max-w-[70%] w-full min-w-0">
                    <div className="playground-chat-skeleton-logo w-8 h-8 rounded-full bg-dark border border-neutral-800 flex items-center justify-center shrink-0">
                        <AppLogo showLogoText={false} size={18} />
                    </div>

                    <div className="flex flex-col gap-2 min-w-0 w-full">
                        <Skeleton className="playground-chat-skeleton-block h-32 w-full rounded-tr-[8px] rounded-b-[8px] bg-dark" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="playground-chat-skeleton-block h-3 w-12 bg-dark" />
                            <Skeleton className="playground-chat-skeleton-block h-3 w-3 rounded-sm bg-dark" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-start w-full">
                <div className="w-full space-y-2">
                    <Skeleton className="playground-chat-skeleton-block h-60 w-full max-w-[80%] bg-dark" />
                </div>
            </div>
            <div className="flex justify-end w-full">
                <div className="flex items-start justify-end gap-x-2 max-w-[70%] w-full min-w-0">
                    <div className="flex flex-col items-end gap-2 min-w-0 w-full">
                        <Skeleton className="playground-chat-skeleton-block h-12 w-full rounded-b-[8px] rounded-tl-[8px] bg-dark" />

                        <div className="flex items-center gap-2">
                            <Skeleton className="playground-chat-skeleton-block h-3 w-12 bg-dark" />
                            <Skeleton className="playground-chat-skeleton-block h-3 w-3 rounded-sm bg-dark" />
                        </div>
                    </div>

                    <Skeleton className="playground-chat-skeleton-avatar h-8 w-8 rounded-full shrink-0 bg-dark" />
                </div>
            </div>
            <div className="flex justify-start w-full">
                <div className="flex items-start gap-x-2 max-w-[70%] w-full min-w-0">
                    <div className="playground-chat-skeleton-logo w-8 h-8 rounded-full bg-dark border border-neutral-800 flex items-center justify-center shrink-0">
                        <AppLogo showLogoText={false} size={18} />
                    </div>

                    <div className="flex flex-col gap-2 min-w-0 w-full">
                        <Skeleton className="playground-chat-skeleton-block h-32 w-full rounded-tr-[8px] rounded-b-[8px] bg-dark" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="playground-chat-skeleton-block h-3 w-12 bg-dark" />
                            <Skeleton className="playground-chat-skeleton-block h-3 w-3 rounded-sm bg-dark" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
