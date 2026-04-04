/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import BuilderDashboard from '@/src/components/builder/BuilderDashboard';
import PlaygroundLeftRail from '@/src/components/builder/PlaygroundLeftRail';
import BuilderNavbar from '@/src/components/nav/BuilderNavbar';
import { cleanWebSocketClient } from '@/src/lib/singletonWebSocket';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { useChatStore } from '@/src/store/user/useChatStore';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ChatRole, STAGE } from '@lighthouse/types';
import Marketplace from '@/src/lib/server/marketplace-server';
import { useTemplateStore } from '@/src/store/user/useTemplateStore';
import { useCurrentContract } from '@/src/hooks/useCurrentContract';
import { usePlaygroundThemeStore } from '@/src/store/code/usePlaygroundThemeStore';
import { cn } from '@/src/lib/utils';

export default function Page({ params }: { params: Promise<{ contractId: string }> }) {
    const { setLoading, setCurrentContractId, cleanContract } = useBuilderChatStore();
    const { reset, collapseFileTree, setCollapseFileTree } = useCodeEditor();
    const unwrappedParams = React.use(params);
    const { contractId } = unwrappedParams;
    const { resetContractId } = useChatStore();
    const { setTemplates } = useTemplateStore();
    const contract = useCurrentContract();
    const { messages } = contract;
    const { theme } = usePlaygroundThemeStore();
    const [showLeftRail, setShowLeftRail] = useState(true);

    useEffect(() => {
        const get_templates = async () => {
            const response = await Marketplace.getTemplates();
            setTemplates(response);
        };
        get_templates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if ((event.metaKey || event.ctrlKey) && event.key === 'e') {
                event.preventDefault();
                setCollapseFileTree(!collapseFileTree);
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    });

    useLayoutEffect(() => {
        document.body.classList.add('playground-theme');
        document.body.classList.toggle('playground-theme-light', theme === 'light');
        document.body.classList.toggle('playground-theme-dark', theme === 'dark');
        document.body.classList.toggle('playground-theme-legacy', theme === 'legacy');

        return () => {
            document.body.classList.remove(
                'playground-theme',
                'playground-theme-light',
                'playground-theme-dark',
                'playground-theme-legacy',
            );
        };
    }, [theme]);

    useEffect(() => {
        if (contractId) setCurrentContractId(contractId);
    }, [contractId, setCurrentContractId]);

    useEffect(() => {
        if (messages.length === 0) {
            setLoading(false);
            return;
        }

        let lastUserIndex = -1;
        for (let i = messages.length - 1; i >= 0; i -= 1) {
            if (messages[i].role === ChatRole.USER) {
                lastUserIndex = i;
                break;
            }
        }

        if (lastUserIndex === -1) {
            setLoading(false);
            return;
        }

        const hasCompletionAfterLastUser = messages.slice(lastUserIndex + 1).some((message) => {
            if (message.role === ChatRole.AI) return true;
            return message.role === ChatRole.SYSTEM && message.stage === STAGE.END;
        });

        setLoading(!hasCompletionAfterLastUser);
    }, [messages, setLoading]);

    useEffect(() => {
        return () => {
            cleanContract(contractId);
            resetContractId();
            reset();
            cleanWebSocketClient();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractId]);

    return (
        <div className="playground-theme-scope relative h-screen w-screen overflow-hidden tracking-wider bg-black">
            <PlaygroundLeftRail visible={showLeftRail} onToggle={() => setShowLeftRail((prev) => !prev)} />

            <div
                className={cn(
                    'h-full w-full flex flex-col transition-[padding-left] duration-300 ease-out',
                    showLeftRail ? 'pl-16' : 'pl-0',
                )}
            >
                <BuilderNavbar leftRailVisible={showLeftRail} />
                <div className="relative flex-1 min-h-0 flex flex-col">
                    <BuilderDashboard />
                </div>
            </div>
        </div>
    );
}
