/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import BuilderDashboard from '@/src/components/builder/BuilderDashboard';
import BuilderNavbar from '@/src/components/nav/BuilderNavbar';
import { cleanWebSocketClient } from '@/src/lib/singletonWebSocket';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useChatStore } from '@/src/store/user/useChatStore';
import React, { useEffect, use } from 'react';
import ContractReviewCard from '@/src/components/base/ContractReviewCard';
import Playground from '@/src/lib/server/playground';
import { useReviewModalStore } from '@/src/store/user/useReviewModalStore';
import { ChatRole } from '@lighthouse/types';
import Marketplace from '@/src/lib/server/marketplace-server';
import { useTemplateStore } from '@/src/store/user/useTemplateStore';
import { useCurrentContract } from '@/src/hooks/useCurrentContract';

export default function Page({ params }: { params: Promise<{ contractId: string }> }) {
    const { setLoading, setCurrentContractId, cleanContract } = useBuilderChatStore();
    const { reset, collapseFileTree, setCollapseFileTree } = useCodeEditor();
    const unwrappedParams = React.use(params);
    const { contractId } = unwrappedParams;
    const { resetContractId } = useChatStore();
    const { session } = useUserSessionStore();
    const { open, hide } = useReviewModalStore();
    const { setTemplates } = useTemplateStore();
    const contract = useCurrentContract();

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

    useEffect(() => {
        function handleHideContractReviewCard(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                hide();
            }
        }
        document.addEventListener('keydown', handleHideContractReviewCard);
        return () => document.removeEventListener('keydown', handleHideContractReviewCard);
    });

    useEffect(() => {
        if (contractId) setCurrentContractId(contractId);
    }, [contractId, setCurrentContractId]);

    useEffect(() => {
        if (!session || !session.user) return;

        const { messages } = contract;
        if (messages.length === 0) return;

        const last = messages[messages.length - 1];

        if (last.role === ChatRole.SYSTEM || last.role === ChatRole.USER) setLoading(true);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractId, session]);

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
        <div className="h-screen w-screen flex flex-col overflow-hidden tracking-wider bg-black">
            <BuilderNavbar />
            <div className="flex-1 min-h-0 flex flex-col">
                <BuilderDashboard />
            </div>
            <ContractReviewCard
                contractId={use(params).contractId}
                open={open}
                onClose={hide}
                onSubmit={() => hide()}
            />
        </div>
    );
}
