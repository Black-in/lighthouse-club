/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { TbGitCompare } from 'react-icons/tb';
import ToolTipComponent from '../ui/TooltipComponent';
import { Button } from '../ui/button';
import { useCurrentContract } from '@/src/hooks/useCurrentContract';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { FileNode, NODE } from '@lighthouse/types';

export default function RightPanelActions() {
    const [showDiffPanel, setShowDiffPanel] = useState<boolean>(false);
    const contract = useCurrentContract();
    const { loading } = contract;
    const { fileTree, originalFileContents } = useCodeEditor();

    const panelRef = useRef<HTMLDivElement | null>(null);
    const diffSummary = useMemo(
        () => buildDiffSummary(fileTree, originalFileContents),
        [fileTree, originalFileContents],
    );
    const hasDiffChanges = diffSummary.totalAdded > 0 || diffSummary.totalRemoved > 0;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setShowDiffPanel(false);
            }
        }
        if (showDiffPanel) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDiffPanel]);

    return (
        <div className="pointer-events-auto flex items-center justify-end gap-x-3">
            <div className="relative" ref={panelRef}>
                <ToolTipComponent content="View repo changes" side="bottom">
                    <button
                        type="button"
                        onClick={() => setShowDiffPanel((prev) => !prev)}
                        aria-label="Toggle differences panel"
                        className="inline-flex h-8 items-center justify-center text-light/75 transition-colors hover:text-light"
                    >
                        <TbGitCompare
                            className={`size-5 transition-transform ${showDiffPanel ? 'scale-105 text-light' : ''}`}
                        />
                    </button>
                </ToolTipComponent>

                {showDiffPanel && (
                    <div className="absolute top-[calc(100%+0.7rem)] right-0 z-50 w-[14.5rem] rounded-xl border border-neutral-800 bg-black px-3 py-2.5 shadow-[0_24px_60px_-35px_rgba(0,0,0,1)]">
                        <div className="flex items-center gap-x-2">
                            <TbGitCompare className="size-4 text-light/70" />
                            <p className="text-xs font-medium text-light/90">Toggle difference</p>
                        </div>
                        {hasDiffChanges ? (
                            <p className="mt-1 pl-6 text-[11px]">
                                <span className="text-[#3fb950]">+{diffSummary.totalAdded}</span>
                                <span className="mx-1.5 text-light/55"> </span>
                                <span className="text-[#f85149]">-{diffSummary.totalRemoved}</span>
                            </p>
                        ) : (
                            <p className="mt-1 pl-6 text-[11px] text-light/55">No changes</p>
                        )}
                    </div>
                )}
            </div>

            <ToolTipComponent content="upcoming feature" side="bottom">
                <Button
                    disabled={loading}
                    size="xs"
                    className="bg-light text-darkest hover:bg-light hover:text-darkest tracking-wider cursor-pointer transition-transform hover:-translate-y-0.5 duration-300 font-semibold exec-button-dark rounded-[4px]"
                >
                    <span className="text-[11px]">Deploy</span>
                </Button>
            </ToolTipComponent>
        </div>
    );
}

interface DiffSummary {
    totalAdded: number;
    totalRemoved: number;
}

function buildDiffSummary(fileTree: FileNode[], originalFileContents: Record<string, string>): DiffSummary {
    const currentFileContents: Record<string, string> = {};
    collectFileContents(fileTree, currentFileContents);

    const allPaths = new Set<string>([
        ...Object.keys(originalFileContents),
        ...Object.keys(currentFileContents),
    ]);

    let totalAdded = 0;
    let totalRemoved = 0;

    for (const path of allPaths) {
        const previous = originalFileContents[path] ?? '';
        const current = currentFileContents[path] ?? '';
        if (previous === current) continue;

        const { added, removed } = calculateLineDelta(previous, current);
        totalAdded += added;
        totalRemoved += removed;
    }

    return { totalAdded, totalRemoved };
}

function collectFileContents(nodes: FileNode[], target: Record<string, string>) {
    for (const node of nodes) {
        if (node.type === NODE.FILE) {
            target[node.id] = node.content ?? '';
        }
        if (node.children?.length) {
            collectFileContents(node.children, target);
        }
    }
}

function calculateLineDelta(previous: string, current: string) {
    const previousLines = splitLines(previous);
    const currentLines = splitLines(current);
    if (previousLines.length === 0 && currentLines.length === 0) {
        return { added: 0, removed: 0 };
    }

    const previousCount = new Map<string, number>();
    const currentCount = new Map<string, number>();

    for (const line of previousLines) {
        previousCount.set(line, (previousCount.get(line) ?? 0) + 1);
    }
    for (const line of currentLines) {
        currentCount.set(line, (currentCount.get(line) ?? 0) + 1);
    }

    let common = 0;
    for (const [line, count] of previousCount.entries()) {
        common += Math.min(count, currentCount.get(line) ?? 0);
    }

    return {
        added: Math.max(0, currentLines.length - common),
        removed: Math.max(0, previousLines.length - common),
    };
}

function splitLines(content: string) {
    if (!content) return [];
    return content.replace(/\r\n/g, '\n').split('\n');
}
