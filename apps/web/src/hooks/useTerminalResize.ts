/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { useState, useEffect, useCallback } from 'react';

interface UseTerminalResizeProps {
    onClose: () => void;
}

export function useTerminalResize({ onClose }: UseTerminalResizeProps) {
    const STORAGE_KEY = 'blackin.terminal.height.v1';
    const [height, setHeight] = useState(220);
    const [isResizing, setIsResizing] = useState(false);

    const startResize = useCallback(() => {
        setIsResizing(true);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const storedHeight = window.localStorage.getItem(STORAGE_KEY);
        if (!storedHeight) return;
        const parsed = Number(storedHeight);
        if (!Number.isNaN(parsed) && parsed >= 100 && parsed <= 600) {
            setHeight(parsed);
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(STORAGE_KEY, String(Math.round(height)));
    }, [height]);

    useEffect(() => {
        const doResize = (e: MouseEvent) => {
            if (!isResizing) return;
            const newHeight = window.innerHeight - e.clientY;
            if (newHeight < 50) {
                onClose();
                setIsResizing(false);
                return;
            }
            if (newHeight > 100 && newHeight < 600) setHeight(newHeight);
        };

        const stopResize = () => setIsResizing(false);

        if (isResizing) {
            window.addEventListener('mousemove', doResize);
            window.addEventListener('mouseup', stopResize);
        }

        return () => {
            window.removeEventListener('mousemove', doResize);
            window.removeEventListener('mouseup', stopResize);
        };
    }, [isResizing, onClose]);

    return {
        height,
        startResize,
    };
}
