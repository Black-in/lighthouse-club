/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import 'react-complex-tree/lib/style-modern.css';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import useResize from '@/src/hooks/useResize';
import { ReactNode } from 'react';

interface SidePanelProps {
    children: ReactNode;
}

export default function SidePanel({ children }: SidePanelProps) {
    const { collapseFileTree, setCollapseFileTree } = useCodeEditor();
    const { dimension } = useResize({
        side: 'width',
        min: 240,
        max: 288,
        onClose: () => setCollapseFileTree(false),
    });

    if (!collapseFileTree) return null;

    return (
        <div
            className="playground-side-panel flex max-h-full bg-[#090a0b] text-neutral-200 border-r border-neutral-800 min-w-[15rem] max-w-[18rem] cursor-ew-resize "
            style={{
                width: `min(${dimension}px, calc(100% - 6rem))`,
                maxWidth: 'calc(100% - 6rem)',
            }}
        >
            <div className="flex-1 flex-col h-full select-none cursor-default ">
                <div className="w-full h-full ">{children}</div>
            </div>
        </div>
    );
}
