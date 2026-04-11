'use client';

import { useEffect, useRef, useState } from 'react';

const TEXT_RENDER_PACE_MS = 24;
const TEXT_RENDER_SNAP = /[\s.,!?;:)\]]/;

function step(size: number) {
    if (size <= 12) return 2;
    if (size <= 48) return 4;
    if (size <= 96) return 8;
    return Math.min(24, Math.ceil(size / 8));
}

function nextChunkBoundary(text: string, start: number) {
    const end = Math.min(text.length, start + step(text.length - start));
    const max = Math.min(text.length, end + 8);
    for (let index = end; index < max; index++) {
        if (TEXT_RENDER_SNAP.test(text[index] ?? '')) return index + 1;
    }
    return end;
}

export function usePacedText(text: string, live: boolean) {
    const [value, setValue] = useState(live ? '' : text);
    const shownRef = useRef(live ? '' : text);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const clear = () => {
            if (!timeoutRef.current) return;
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        };

        const sync = (next: string) => {
            shownRef.current = next;
            setValue(next);
        };

        const run = () => {
            timeoutRef.current = null;

            if (!live) {
                sync(text);
                return;
            }

            if (!text.startsWith(shownRef.current) || text.length <= shownRef.current.length) {
                sync(text);
                return;
            }

            const boundary = nextChunkBoundary(text, shownRef.current.length);
            sync(text.slice(0, boundary));

            if (boundary < text.length) {
                timeoutRef.current = setTimeout(run, TEXT_RENDER_PACE_MS);
            }
        };

        if (!live) {
            clear();
            sync(text);
            return clear;
        }

        if (!text.startsWith(shownRef.current) || text.length < shownRef.current.length) {
            clear();
            sync('');
        }

        if (text.length !== shownRef.current.length && !timeoutRef.current) {
            timeoutRef.current = setTimeout(run, TEXT_RENDER_PACE_MS);
        }

        return clear;
    }, [live, text]);

    return value;
}
