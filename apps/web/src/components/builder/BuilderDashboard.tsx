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
import { JSX, useEffect } from 'react';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import SidePanel from '../code/SidePanel';
import EditorSidePanel, { SidePanelValues } from '../code/EditorSidePanel';
import Terminal from '../code/Terminal';
import { useWebSocket } from '@/src/hooks/useWebSocket';
import { useTerminalLogStore } from '@/src/store/code/useTerminalLogStore';
import { IncomingPayload, TerminalSocketData, WSServerIncomingPayload } from '@lighthouse/types';
import { useSidePanelStore } from '@/src/store/code/useSidePanelStore';
import FileTree from '../code/Filetree';
import GithubPanel from '../code/GithubPanel';
import PlanPanel from '../code/PlanPanel';
import { useCurrentContract } from '@/src/hooks/useCurrentContract';

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
            setIsCommandRunning(true);
            if (message.type === TerminalSocketData.COMPLETED) setIsCommandRunning(false);
            const { line } = message.payload;
            addLog({
                type: message.type,
                text: line,
            });
        }

        if (isConnected) {
            subscribeToHandler(handleIncomingTerminalLogs);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                className="hidden sm:flex sm:flex-1 pb-4 px-4 h-full min-h-0 min-w-0"
            >
                <div className="w-full h-full min-h-0 z-10 border-neutral-800 border rounded-[4px] relative overflow-hidden bg-[#08090a]">
                    {loading ? <BuilderLoader /> : <Editing />}
                </div>
            </motion.div>
        </div>
    );
}

function Editing() {
    const { currentState } = useSidePanelStore();
    function renderSidePanels() {
        switch (currentState) {
            case SidePanelValues.FILE:
                return <FileTree />;
            case SidePanelValues.GITHUB:
                return <GithubPanel />;
            default:
                return <div></div>;
        }
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

    return (
        <div className="flex h-full min-h-0">
            <EditorSidePanel />
            <SidePanel>{renderSidePanels()}</SidePanel>
            {renderEditorPanels()}
            <Terminal />
        </div>
    );
}
