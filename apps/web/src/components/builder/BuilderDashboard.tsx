/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import { motion, AnimatePresence } from 'framer-motion';
import BuilderChats from './BuilderChats';
import CodeEditor from '../code/CodeEditor';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import BuilderLoader from './BuilderLoader';
import { JSX, useEffect, useRef, useState } from 'react';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { SidePanelValues } from '../code/EditorSidePanel';
import Terminal from '../code/Terminal';
import { useWebSocket } from '@/src/hooks/useWebSocket';
import { useTerminalLogStore } from '@/src/store/code/useTerminalLogStore';
import {
    FileContent,
    FileNode,
    IncomingPayload,
    NODE,
    TerminalSocketData,
    WSServerIncomingPayload,
} from '@lighthouse/types';
import { useSidePanelStore } from '@/src/store/code/useSidePanelStore';
import FileTree from '../code/Filetree';
import PlanPanel from '../code/PlanPanel';
import { useCurrentContract } from '@/src/hooks/useCurrentContract';
import { cn } from '@/src/lib/utils';
import { shouldEnableDevAccessClient } from '@/src/lib/runtime-mode';

const PROJECT_PANEL_WIDTH_STORAGE_KEY = 'blackin.playground.projectPanelWidth';
const DEFAULT_PROJECT_PANEL_WIDTH = 296;
const MIN_PROJECT_PANEL_WIDTH = 220;
const MIN_CODE_PANEL_WIDTH = 420;
const DEV_SAMPLE_FILES: FileContent[] = [
    {
        path: 'src/main.rs',
        content:
            "use anchor_lang::prelude::*;\n\nmod state;\nmod instructions;\n\nuse instructions::*;\n\ndeclare_id!(\"9CHN8A5pN7blackinx3yq8fWmR9z8QwT2s6uQfJx7LJ\");\n\n#[program]\npub mod blackin_demo {\n    use super::*;\n\n    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {\n        initialize::handler(ctx)\n    }\n\n    pub fn update_counter(ctx: Context<UpdateCounter>, value: u64) -> Result<()> {\n        update_counter::handler(ctx, value)\n    }\n}\n",
    },
    {
        path: 'src/state/counter.rs',
        content:
            "use anchor_lang::prelude::*;\n\n#[account]\npub struct Counter {\n    pub authority: Pubkey,\n    pub value: u64,\n}\n\nimpl Counter {\n    pub const LEN: usize = 8 + 32 + 8;\n}\n",
    },
    {
        path: 'src/instructions/mod.rs',
        content: 'pub mod initialize;\npub mod update_counter;\n\npub use initialize::*;\npub use update_counter::*;\n',
    },
    {
        path: 'src/instructions/initialize.rs',
        content:
            "use anchor_lang::prelude::*;\nuse crate::state::counter::Counter;\n\n#[derive(Accounts)]\npub struct Initialize<'info> {\n    #[account(mut)]\n    pub payer: Signer<'info>,\n    #[account(\n        init,\n        payer = payer,\n        space = Counter::LEN,\n        seeds = [b\"counter\", payer.key().as_ref()],\n        bump\n    )]\n    pub counter: Account<'info, Counter>,\n    pub system_program: Program<'info, System>,\n}\n\npub fn handler(ctx: Context<Initialize>) -> Result<()> {\n    let counter = &mut ctx.accounts.counter;\n    counter.authority = ctx.accounts.payer.key();\n    counter.value = 0;\n    Ok(())\n}\n",
    },
    {
        path: 'src/instructions/update_counter.rs',
        content:
            "use anchor_lang::prelude::*;\nuse crate::state::counter::Counter;\n\n#[derive(Accounts)]\npub struct UpdateCounter<'info> {\n    #[account(mut)]\n    pub authority: Signer<'info>,\n    #[account(\n        mut,\n        seeds = [b\"counter\", authority.key().as_ref()],\n        bump,\n        has_one = authority\n    )]\n    pub counter: Account<'info, Counter>,\n}\n\npub fn handler(ctx: Context<UpdateCounter>, value: u64) -> Result<()> {\n    ctx.accounts.counter.value = value;\n    Ok(())\n}\n",
    },
    {
        path: 'tests/blackin_demo.ts',
        content:
            "import * as anchor from '@coral-xyz/anchor';\n\ndescribe('blackin_demo', () => {\n  const provider = anchor.AnchorProvider.env();\n  anchor.setProvider(provider);\n\n  it('initializes counter', async () => {\n    // test placeholder\n  });\n});\n",
    },
    {
        path: 'Anchor.toml',
        content:
            "[features]\nresolution = true\nskip-lint = false\n\n[programs.localnet]\nblackin_demo = \"9CHN8A5pN7blackinx3yq8fWmR9z8QwT2s6uQfJx7LJ\"\n\n[provider]\ncluster = \"Localnet\"\nwallet = \"~/.config/solana/id.json\"\n",
    },
    {
        path: 'README.md',
        content:
            '# BlackIn Demo Workspace\\n\\nThis is a local dev preview file tree used to visualize the playground UI before generation runs.\\n',
    },
];

export default function BuilderDashboard(): JSX.Element {
    const contract = useCurrentContract();
    const { loading } = contract;
    const { collapseChat } = useCodeEditor();
    const { isConnected, subscribeToHandler } = useWebSocket();
    const { addLog, setIsCommandRunning, setTerminalLoader } = useTerminalLogStore();

    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null;
        function handleIncomingTerminalLogs(message: WSServerIncomingPayload<IncomingPayload>) {
            setTerminalLoader(false);
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                setTerminalLoader(true);
            }, 5000);

            if (message.type === TerminalSocketData.EXECUTING_COMMAND) {
                setIsCommandRunning(true);
            }
            if (
                [
                    TerminalSocketData.COMPLETED,
                    TerminalSocketData.ERROR_MESSAGE,
                    TerminalSocketData.BUILD_ERROR,
                    TerminalSocketData.VALIDATION_ERROR,
                ].includes(message.type)
            ) {
                setIsCommandRunning(false);
            }

            const payload = message.payload as IncomingPayload | string;
            const line = typeof payload === 'string' ? payload : payload?.line;
            if (!line) return;
            addLog({
                type: message.type,
                text: line,
            });
        }

        let unsubscribe: (() => void) | undefined;
        if (isConnected) {
            unsubscribe = subscribeToHandler(handleIncomingTerminalLogs);
        }

        return () => {
            if (timeout) clearTimeout(timeout);
            unsubscribe?.();
        };
    }, [isConnected]);

    return (
        <div className="w-full h-full flex flex-row bg-black z-0 overflow-hidden">
            <AnimatePresence mode="wait">
                {!collapseChat && (
                    <motion.div
                        key="builder-chats"
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{
                            duration: 0.3,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                        className="overflow-hidden"
                    >
                        <BuilderChats />
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div
                layout
                transition={{
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1],
                }}
                className="hidden sm:flex sm:flex-1 pt-0 pb-4 px-4 h-full min-h-0 min-w-0"
            >
                <div
                    className={cn(
                        'w-full h-full min-h-0 z-10 relative',
                        collapseChat
                            ? 'border-0 rounded-none overflow-visible bg-transparent'
                            : 'border border-neutral-800/90 rounded-[16px] overflow-hidden bg-[#08090a]',
                    )}
                >
                    {loading ? <BuilderLoader /> : <Editing />}
                </div>
            </motion.div>
        </div>
    );
}

function Editing() {
    const { currentState } = useSidePanelStore();
    const { collapseChat, fileTree, parseFileStructure, selectFile } = useCodeEditor();
    const splitContainerRef = useRef<HTMLDivElement | null>(null);
    const [projectPanelWidth, setProjectPanelWidth] = useState<number>(DEFAULT_PROJECT_PANEL_WIDTH);
    const [isResizingPanels, setIsResizingPanels] = useState<boolean>(false);
    const showDevFileStructure = shouldEnableDevAccessClient();

    useEffect(() => {
        if (!showDevFileStructure) return;
        if (fileTree.length > 0) return;

        const root = parseFileStructure(DEV_SAMPLE_FILES);
        const firstFile = findFirstFile(root);
        if (firstFile) {
            selectFile(firstFile);
        }
    }, [fileTree.length, parseFileStructure, selectFile, showDevFileStructure]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const savedWidth = window.localStorage.getItem(PROJECT_PANEL_WIDTH_STORAGE_KEY);
        if (!savedWidth) return;
        const parsedWidth = Number(savedWidth);
        if (Number.isNaN(parsedWidth)) return;
        setProjectPanelWidth(parsedWidth);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(
            PROJECT_PANEL_WIDTH_STORAGE_KEY,
            String(Math.round(projectPanelWidth)),
        );
    }, [projectPanelWidth]);

    useEffect(() => {
        if (!collapseChat) return;

        function syncWidthWithinBounds() {
            if (!splitContainerRef.current) return;
            const rect = splitContainerRef.current.getBoundingClientRect();
            setProjectPanelWidth((prev) => clampProjectPanelWidth(prev, rect.width));
        }

        syncWidthWithinBounds();
        window.addEventListener('resize', syncWidthWithinBounds);
        return () => window.removeEventListener('resize', syncWidthWithinBounds);
    }, [collapseChat]);

    useEffect(() => {
        function handleResizeMove(event: MouseEvent) {
            if (!isResizingPanels || !splitContainerRef.current) return;
            const rect = splitContainerRef.current.getBoundingClientRect();
            const rawWidth = event.clientX - rect.left;
            const clampedWidth = clampProjectPanelWidth(rawWidth, rect.width);
            setProjectPanelWidth(clampedWidth);
        }

        function handleResizeStop() {
            setIsResizingPanels(false);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }

        if (isResizingPanels) {
            window.addEventListener('mousemove', handleResizeMove);
            window.addEventListener('mouseup', handleResizeStop);
        }

        return () => {
            window.removeEventListener('mousemove', handleResizeMove);
            window.removeEventListener('mouseup', handleResizeStop);
        };
    }, [isResizingPanels]);

    function handleResizeStart(event: React.MouseEvent) {
        event.preventDefault();
        setIsResizingPanels(true);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }

    function renderEditorPanels() {
        switch (currentState) {
            case SidePanelValues.FILE:
                return <CodeEditor />;
            case SidePanelValues.GITHUB:
                return <CodeEditor />;
            case SidePanelValues.PLAN:
                return <PlanPanel />;
        }
    }

    if (collapseChat && showDevFileStructure) {
        return (
            <div ref={splitContainerRef} className="flex h-full min-h-0 gap-3">
                <div
                    className="relative h-full min-h-0 rounded-[16px] border border-neutral-800/90 bg-[#08090a] overflow-hidden"
                    style={{ width: `${projectPanelWidth}px` }}
                >
                    <FileTree />
                    <EdgeResizeHandle side="right" onMouseDown={handleResizeStart} />
                </div>

                <div className="relative min-w-0 flex-1 h-full rounded-[16px] border border-neutral-800/90 bg-[#08090a] overflow-hidden">
                    <EdgeResizeHandle side="left" onMouseDown={handleResizeStart} />
                    {renderEditorPanels()}
                    <Terminal />
                </div>
            </div>
        );
    }

    if (collapseChat) {
        return (
            <div className="flex h-full min-h-0 rounded-[16px] border border-neutral-800/90 bg-[#08090a] overflow-hidden">
                {renderEditorPanels()}
                <Terminal />
            </div>
        );
    }

    return (
        <div className="flex h-full min-h-0 rounded-[16px] overflow-hidden">
            {renderEditorPanels()}
            <Terminal />
        </div>
    );
}

interface EdgeResizeHandleProps {
    side: 'left' | 'right';
    onMouseDown: (event: React.MouseEvent) => void;
}

function EdgeResizeHandle({ side, onMouseDown }: EdgeResizeHandleProps) {
    return (
        <button
            type="button"
            aria-label="Resize panels"
            onMouseDown={onMouseDown}
            className={cn(
                'group absolute top-0 bottom-0 z-20 w-4 cursor-col-resize touch-none',
                side === 'left' ? '-left-2' : '-right-2',
            )}
        >
            <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 rounded-full bg-neutral-600/0 transition-colors group-hover:bg-neutral-500/90 group-focus-visible:bg-neutral-500/90" />
        </button>
    );
}

function clampProjectPanelWidth(width: number, totalWidth: number) {
    const maxProjectWidth = Math.max(MIN_PROJECT_PANEL_WIDTH, totalWidth - MIN_CODE_PANEL_WIDTH);
    return Math.min(Math.max(width, MIN_PROJECT_PANEL_WIDTH), maxProjectWidth);
}

function findFirstFile(node: FileNode): FileNode | null {
    if (node.type === NODE.FILE) return node;
    if (!node.children || node.children.length === 0) return null;

    for (const child of node.children) {
        const result = findFirstFile(child);
        if (result) return result;
    }

    return null;
}
