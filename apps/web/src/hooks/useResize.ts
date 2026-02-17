/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import { useCallback, useEffect, useState } from 'react';

interface useResizeProps {
    side: 'height' | 'width';
    min: number;
    max: number;
    onClose: () => void;
}

export default function useResize({ side, min, max, onClose }: useResizeProps) {
    const [dimension, setDimension] = useState<number>(min);
    const [isResizing, setIsResizing] = useState<boolean>(false);

    const startResize = useCallback(() => {
        setIsResizing(true);
    }, []);

    useEffect(() => {
        const doResize = (e: MouseEvent) => {
            if (!isResizing) return;
            const newDimension =
                side === 'height' ? window.innerHeight - e.clientY : window.innerWidth - e.clientX;
            if (newDimension < 50) {
                onClose();
                setIsResizing(false);
                return;
            }
            if (newDimension > min && newDimension < max) setDimension(newDimension);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isResizing, onClose]);

    return {
        dimension,
        startResize,
    };
}
