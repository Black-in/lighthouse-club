/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { Message } from '@lighthouse/types';
import { JSX, useState } from 'react';
import AppLogo from '../tickers/AppLogo';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import Image from 'next/image';
import PlanExecutorPanel from '../code/PlanExecutorPanel';
import { useSidePanelStore } from '@/src/store/code/useSidePanelStore';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { useExecutorStore } from '@/src/store/model/useExecutorStore';
import { SidePanelValues } from '../code/EditorSidePanel';
import { useEditPlanStore } from '@/src/store/code/useEditPlanStore';
import SystemMessage from './SystemMessage';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { useCurrentContract } from '@/src/hooks/useCurrentContract';
import { usePlaygroundThemeStore } from '@/src/store/code/usePlaygroundThemeStore';
import { usePacedText } from '@/src/hooks/usePacedText';
import ClarificationQuestionCard, { parseClarificationPayload } from './ClarificationQuestionCard';

interface BuilderMessageProps {
    message: Message;
    loading: boolean;
    returnParsedData: (message: string) => string;
}

export default function BuilderMessage({
    message,
    loading,
    returnParsedData,
}: BuilderMessageProps): JSX.Element {
    const { session } = useUserSessionStore();
    const contract = useCurrentContract();
    const { messages } = contract;
    const [collapsePanel, setCollapsePanel] = useState<boolean>(false);
    const { editExeutorPlanPanel, setEditExeutorPlanPanel } = useExecutorStore();
    const { setCollapseFileTree } = useCodeEditor();
    const { setCurrentState } = useSidePanelStore();
    const { setMessage } = useEditPlanStore();
    const { theme } = usePlaygroundThemeStore();
    const latestAIMessageId = messages.filter((entry) => entry.role === 'AI').at(-1)?.id;
    const shouldAnimateAIMessage = message.role === 'AI' && message.id === latestAIMessageId;
    const pacedAIText = usePacedText(returnParsedData(message.content), shouldAnimateAIMessage);
    const clarificationPayload = message.role === 'AI'
        ? parseClarificationPayload(message.plannerContext)
        : null;

    const [copiedId, setCopiedId] = useState<string | null>(null);

    async function handleCopy(text: string, id: string) {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    }

    return (
        <div className="w-full shrink-0">
            {message.role === 'USER' && (
                <div className="flex justify-end items-start w-full">
                    <div className="flex items-start gap-x-2 max-w-[86%]">
                        <div className="group">
                            <div className="playground-user-message-bubble mt-3 ml-auto w-fit max-w-[32rem] rounded-2xl border border-neutral-800 bg-[#08090a] px-4 py-2 text-left text-sm font-normal text-white whitespace-pre-wrap break-words">
                                {message.content}
                            </div>

                            <div className="flex justify-end items-center mt-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
                                <button
                                    type="button"
                                    className="text-xs cursor-pointer"
                                    onClick={() => handleCopy(message.content, message.id)}
                                >
                                    {copiedId === message.id ? (
                                        <FiCheck strokeWidth={2.5} size={12} color="#5483B3" />
                                    ) : (
                                        <FiCopy
                                            size={12}
                                            color={theme === 'light' ? '#334155' : '#ffffff'}
                                        />
                                    )}
                                </button>
                            </div>
                        </div>

                        {session?.user.image && (
                            <Image
                                className="rounded-full shrink-0"
                                src={session.user.image}
                                alt="user"
                                width={32}
                                height={32}
                            />
                        )}
                    </div>
                </div>
            )}

            {message.role === 'TEMPLATE' && (
                <div className="flex justify-end items-start w-full">
                    <div className="flex items-start gap-x-2 max-w-[86%]">
                        <div className="flex flex-col gap-y-2">
                            <div className="relative w-full h-34 aspect-[4/3] rounded-b-[8px] rounded-tl-[8px] overflow-hidden flex items-center justify-end mt-3">
                                {message.template?.imageUrl && (
                                    <Image
                                        src={message.template.imageUrl}
                                        alt="Contract preview"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                )}
                            </div>
                        </div>

                        {session?.user.image && (
                            <Image
                                className="rounded-full shrink-0"
                                src={session.user.image}
                                alt="user"
                                width={32}
                                height={32}
                            />
                        )}
                    </div>
                </div>
            )}

            {message.role === 'PLAN' && message.plannerContext && (
                <PlanExecutorPanel
                    plan={JSON.parse(String(message.plannerContext))}
                    editExeutorPlanPanel={editExeutorPlanPanel}
                    onCollapse={() => setCollapsePanel((prev) => !prev)}
                    onEdit={() => {
                        setMessage(JSON.parse(String(message.plannerContext)));
                        setEditExeutorPlanPanel(true);
                        setCurrentState(SidePanelValues.PLAN);
                        setCollapseFileTree(false);
                        setCollapsePanel(true);
                    }}
                    onExpand={() => {
                        setMessage(JSON.parse(String(message.plannerContext)));
                        setCollapseFileTree(false);
                        setCurrentState(SidePanelValues.PLAN);
                        setCollapsePanel(true);
                    }}
                    collapse={collapsePanel}
                    expanded={false}
                    hidePlanSvg={true}
                    className="playground-plan-message-card border border-neutral-800 rounded-[8px] bg-[#1b1d20]"
                />
            )}

            {message.role === 'USER' && loading && !messages.some((m) => m.role === 'AI') && (
                <div className="flex justify-start w-full mt-2 ">
                    <div className="flex items-start gap-x-2 max-w-[86%]">
                        <AppLogo showLogoText={false} size={22} />
                        <div className="playground-ai-loading-bubble px-4 py-2 rounded-2xl border border-neutral-800 text-sm font-normal bg-[#08090a] text-white text-left tracking-wider text-[13px] italic">
                            <div className="flex items-center gap-x-1">
                                <div className="flex space-x-1">
                                    <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {message.role === 'AI' && (
                <div className="flex justify-start w-full">
                    <div className="flex items-start gap-x-2 max-w-[86%]">
                        <div className="playground-ai-message-avatar w-8 h-8 aspect-square rounded-full bg-dark border border-neutral-800 flex items-center justify-center">
                            <AppLogo showLogoText={false} size={22} />
                        </div>
                        <div className="flex flex-col group">
                            {clarificationPayload ? (
                                <ClarificationQuestionCard payload={clarificationPayload} />
                            ) : (
                                <div className="playground-ai-message-bubble mt-2.5 w-fit max-w-[32rem] rounded-2xl border border-neutral-800 bg-[#08090a] px-4 py-2 text-sm font-normal text-white text-left tracking-wider whitespace-pre-wrap break-words">
                                    {pacedAIText}
                                </div>
                            )}

                            <div className="flex items-center mt-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
                                <button
                                    type="button"
                                    className="text-xs cursor-pointer"
                                    onClick={() => handleCopy(message.content, message.id)}
                                >
                                    {copiedId === message.id ? (
                                        <FiCheck size={12} color="#5483B3" />
                                    ) : (
                                        <FiCopy
                                            size={12}
                                            color={theme === 'light' ? '#334155' : '#ffffff'}
                                        />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {message.role === 'SYSTEM' && (
                <div className="flex justify-start items-start w-full my-4 ">
                    <div className="flex items-start gap-x-2 w-full">
                        <div className="rounded-[4px] text-sm font-normal w-full text-light text-left tracking-wider text-[13px]">
                            <SystemMessage message={message} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
