/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import BuilderChats from './BuilderChats';
import CodeEditor from '../code/CodeEditor';
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
import { useParams } from 'next/navigation';

const PROJECT_PANEL_WIDTH_STORAGE_KEY = 'blackin.playground.projectPanelWidth';
const CHAT_PANEL_WIDTH_STORAGE_KEY = 'blackin.playground.chatPanelWidth';
const DEFAULT_PROJECT_PANEL_WIDTH = 296;
const DEFAULT_CHAT_PANEL_WIDTH = 520;
const MIN_PROJECT_PANEL_WIDTH = 220;
const MIN_CODE_PANEL_WIDTH = 420;
const MIN_CHAT_PANEL_WIDTH = 360;
const DEV_SAMPLE_FILES: FileContent[] = [
    {
        path: 'apps/web/app/page.tsx',
        content:
            "export default function HomePage() {\n  return (\n    <main>\n      <h1>BlackIn Base App</h1>\n      <p>Generated Base-native app scaffold.</p>\n    </main>\n  );\n}\n",
    },
    {
        path: 'apps/web/app/layout.tsx',
        content:
            "export default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang=\"en\">\n      <body>{children}</body>\n    </html>\n  );\n}\n",
    },
    {
        path: 'contracts/src/BaseApp.sol',
        content:
            "// SPDX-License-Identifier: MIT\npragma solidity ^0.8.24;\n\ncontract BaseApp {\n    string public appName = \"BlackIn Base App\";\n}\n",
    },
    {
        path: 'contracts/script/DeployBaseApp.s.sol',
        content:
            "// SPDX-License-Identifier: MIT\npragma solidity ^0.8.24;\n\nimport {Script} from \"forge-std/Script.sol\";\nimport {BaseApp} from \"../src/BaseApp.sol\";\n\ncontract DeployBaseApp is Script {\n    function run() external {\n        vm.startBroadcast();\n        new BaseApp();\n        vm.stopBroadcast();\n    }\n}\n",
    },
    {
        path: 'contracts/test/BaseApp.t.sol',
        content:
            "// SPDX-License-Identifier: MIT\npragma solidity ^0.8.24;\n\nimport {Test} from \"forge-std/Test.sol\";\nimport {BaseApp} from \"../src/BaseApp.sol\";\n\ncontract BaseAppTest is Test {\n    function test_AppName() public {\n        BaseApp appContract = new BaseApp();\n        assertEq(appContract.appName(), \"BlackIn Base App\");\n    }\n}\n",
    },
    {
        path: 'contracts/foundry.toml',
        content:
            "[profile.default]\nsrc = \"src\"\nout = \"out\"\nlibs = [\"lib\"]\nsolc_version = \"0.8.24\"\n",
    },
    {
        path: '.env.example',
        content:
            "NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org\nNEXT_PUBLIC_BASE_MAINNET_RPC_URL=https://mainnet.base.org\nNEXT_PUBLIC_ONCHAINKIT_API_KEY=\n",
    },
    {
        path: 'README.md',
        content:
            '# BlackIn Base Demo Workspace\\n\\nThis local preview demonstrates a Base-first app and Solidity workspace.\\n',
    },
];

export default function BuilderDashboard(): JSX.Element {
    const contract = useCurrentContract();
    const params = useParams();
    const contractId = params?.contractId as string | undefined;
    const { loading } = contract;
    const { collapseChat, livePreviewFilePath } = useCodeEditor();
    const { isConnected, subscribeToHandler } = useWebSocket();
    const { addLog, setLogs, setIsCommandRunning, setTerminalLoader } = useTerminalLogStore();
    const chatSplitContainerRef = useRef<HTMLDivElement | null>(null);
    const [chatPanelWidth, setChatPanelWidth] = useState<number>(DEFAULT_CHAT_PANEL_WIDTH);
    const [isResizingChatPanels, setIsResizingChatPanels] = useState<boolean>(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null;
        function handleIncomingTerminalLogs(message: WSServerIncomingPayload<IncomingPayload>) {
            const payload = message.payload as IncomingPayload | string;
            if (
                typeof payload !== 'string' &&
                payload?.contractId &&
                contractId &&
                payload.contractId !== contractId
            ) {
                return;
            }

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

            const line = typeof payload === 'string' ? payload : payload?.line;
            if (!line) return;

            if (message.type === TerminalSocketData.CONNECTED) {
                setLogs([
                    {
                        type: message.type,
                        text: line,
                    },
                ]);
                setIsCommandRunning(false);
                return;
            }

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
    }, [
        addLog,
        contractId,
        isConnected,
        setIsCommandRunning,
        setLogs,
        setTerminalLoader,
        subscribeToHandler,
    ]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const savedWidth = window.localStorage.getItem(CHAT_PANEL_WIDTH_STORAGE_KEY);
        if (!savedWidth) return;
        const parsedWidth = Number(savedWidth);
        if (Number.isNaN(parsedWidth)) return;
        setChatPanelWidth(parsedWidth);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(CHAT_PANEL_WIDTH_STORAGE_KEY, String(Math.round(chatPanelWidth)));
    }, [chatPanelWidth]);

    useEffect(() => {
        if (collapseChat) return;

        function syncWidthWithinBounds() {
            if (!chatSplitContainerRef.current) return;
            const rect = chatSplitContainerRef.current.getBoundingClientRect();
            setChatPanelWidth((prev) => clampChatPanelWidth(prev, rect.width));
        }

        syncWidthWithinBounds();
        window.addEventListener('resize', syncWidthWithinBounds);
        return () => window.removeEventListener('resize', syncWidthWithinBounds);
    }, [collapseChat]);

    useEffect(() => {
        function handleResizeMove(event: MouseEvent) {
            if (!isResizingChatPanels || !chatSplitContainerRef.current) return;
            const rect = chatSplitContainerRef.current.getBoundingClientRect();
            const rawWidth = event.clientX - rect.left;
            setChatPanelWidth(clampChatPanelWidth(rawWidth, rect.width));
        }

        function handleResizeStop() {
            setIsResizingChatPanels(false);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }

        if (isResizingChatPanels) {
            window.addEventListener('mousemove', handleResizeMove);
            window.addEventListener('mouseup', handleResizeStop);
        }

        return () => {
            window.removeEventListener('mousemove', handleResizeMove);
            window.removeEventListener('mouseup', handleResizeStop);
        };
    }, [isResizingChatPanels]);

    function handleChatResizeStart(event: React.MouseEvent) {
        event.preventDefault();
        setIsResizingChatPanels(true);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }

    return (
        <div className="playground-builder-dashboard w-full h-full flex flex-row bg-black z-0 overflow-hidden">
            {!collapseChat && (
                <>
                    <div className="w-full h-full min-h-0 sm:hidden">
                        <BuilderChats />
                    </div>
                    <div
                        ref={chatSplitContainerRef}
                        className="hidden sm:flex sm:flex-1 h-full min-h-0 min-w-0"
                    >
                        <div className="relative h-full min-h-0" style={{ width: `${chatPanelWidth}px` }}>
                            <BuilderChats />
                            <EdgeResizeHandle side="right" onMouseDown={handleChatResizeStart} />
                        </div>
                        <div className="flex flex-1 pt-0 pb-4 pr-4 pl-0 h-full min-h-0 min-w-0">
                            <div className="playground-main-panel w-full h-full min-h-0 z-10 relative border border-neutral-800/90 rounded-[16px] overflow-hidden bg-[#08090a]">
                                {loading && !livePreviewFilePath ? <BuilderLoader /> : <Editing />}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {collapseChat && (
                <div className="hidden sm:flex sm:flex-1 pt-0 pb-4 px-4 h-full min-h-0 min-w-0">
                    <div className="playground-main-panel w-full h-full min-h-0 z-10 relative border-0 rounded-none overflow-visible bg-transparent">
                        {loading && !livePreviewFilePath ? <BuilderLoader /> : <Editing />}
                    </div>
                </div>
            )}
        </div>
    );
}

function Editing() {
    const params = useParams();
    const contractId = params?.contractId as string | undefined;
    const { currentState } = useSidePanelStore();
    const { collapseChat, fileTree, parseFileStructure, selectFile } = useCodeEditor();
    const splitContainerRef = useRef<HTMLDivElement | null>(null);
    const [projectPanelWidth, setProjectPanelWidth] = useState<number>(DEFAULT_PROJECT_PANEL_WIDTH);
    const [isResizingPanels, setIsResizingPanels] = useState<boolean>(false);
    const showDevFileStructure = shouldEnableDevAccessClient() && !contractId;
    const showWorkspaceFileTree = showDevFileStructure || fileTree.length > 0;

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

    if (collapseChat && showWorkspaceFileTree) {
        return (
            <div ref={splitContainerRef} className="flex h-full min-h-0 gap-3">
                <div
                    className="playground-split-panel relative h-full min-h-0 rounded-[16px] border border-neutral-800/90 bg-[#08090a] overflow-hidden"
                    style={{ width: `${projectPanelWidth}px` }}
                >
                    <FileTree />
                    <EdgeResizeHandle side="right" onMouseDown={handleResizeStart} />
                </div>

                <div className="playground-split-panel relative min-w-0 flex-1 h-full rounded-[16px] border border-neutral-800/90 bg-[#08090a] overflow-hidden">
                    <EdgeResizeHandle side="left" onMouseDown={handleResizeStart} />
                    {renderEditorPanels()}
                    <Terminal />
                </div>
            </div>
        );
    }

    if (collapseChat) {
        return (
            <div className="playground-split-panel flex h-full min-h-0 rounded-[16px] border border-neutral-800/90 bg-[#08090a] overflow-hidden">
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

function clampChatPanelWidth(width: number, totalWidth: number) {
    const maxChatWidth = Math.max(MIN_CHAT_PANEL_WIDTH, totalWidth - MIN_CODE_PANEL_WIDTH);
    return Math.min(Math.max(width, MIN_CHAT_PANEL_WIDTH), maxChatWidth);
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
