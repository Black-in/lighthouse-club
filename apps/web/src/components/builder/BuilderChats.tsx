/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import BuilderChatInput from './BuilderChatInput';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '@/src/store/user/useChatStore';
import BuilderMessage from './BuilderMessage';
import useGenerate from '@/src/hooks/useGenerate';
import { useCurrentContract } from '@/src/hooks/useCurrentContract';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import Playground from '@/src/lib/server/playground';
import BuilderChatSkeletons from './BuilderChatSkeletons';

export default function BuilderChats() {
    const params = useParams();
    const contractId = params.contractId as string;
    const hasInitialized = useRef<boolean>(false);
    const messageEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const shouldAutoScrollRef = useRef<boolean>(true);
    const [chatLoading, setChatLoading] = useState<boolean>(false);
    const { session } = useUserSessionStore();
    const { setContractId } = useChatStore();
    const { handleGeneration } = useGenerate();
    const contract = useCurrentContract();
    const { messages, loading } = contract;
    const { activeTemplate } = contract;
    const { resetTemplate } = useBuilderChatStore();
    const hasLocalMessages = messages.some((message) => message.contractId === contractId);

    useEffect(() => {
        if (messageEndRef.current && shouldAutoScrollRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    function handleChatScroll() {
        const el = chatContainerRef.current;
        if (!el) return;
        const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        shouldAutoScrollRef.current = distanceFromBottom < 72;
    }

    useEffect(() => {
        async function fetchChats() {
            if (contract.loading || hasLocalMessages || !session || !session.user || !session.user.token)
                return;
            setChatLoading(true);
            await Playground.get_chat(session.user.token, contractId);
            setChatLoading(false);
        }
        fetchChats();
    }, [contractId, session, contract.loading, hasLocalMessages]);

    useEffect(() => {
        if (hasInitialized.current) {
            return;
        }
        if (!messages || messages.length === 0) return;
        if (messages.length <= 2 && messages[0].contractId === contractId) {
            hasInitialized.current = true;
            if (activeTemplate) {
                startChat(messages[0].content, activeTemplate.id);
            } else {
                startChat(messages[0].content);
            }
            setContractId(contractId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractId, messages.length]);

    async function startChat(instruction: string, template_id?: string) {
        handleGeneration(contractId, instruction, template_id);
        if (activeTemplate) resetTemplate();
    }

    function returnParsedData(message: string) {
        const result = message.split('<stage>')[0];
        return result;
    }

    return (
        <div className="w-full h-full min-h-0 flex flex-col pt-4">
            <div
                ref={chatContainerRef}
                data-lenis-prevent
                onScroll={handleChatScroll}
                className="flex-1 flex flex-col gap-y-3 text-light text-sm px-4 overflow-y-auto min-h-0 custom-scrollbar soft-scroll"
            >
                {chatLoading ? (
                    <BuilderChatSkeletons loading={chatLoading} />
                ) : (
                    <>
                        {messages.map((message) => (
                            <BuilderMessage
                                returnParsedData={returnParsedData}
                                key={message.id}
                                message={message}
                                loading={loading}
                            />
                        ))}
                    </>
                )}
                <div ref={messageEndRef} />
            </div>
            <div className="flex items-center justify-center w-full py-4 px-6 shrink-0 relative">
                <BuilderChatInput />
            </div>
        </div>
    );
}
