/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { cn } from '@/src/lib/utils';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import React, { useState, KeyboardEvent, useRef } from 'react';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useParams } from 'next/navigation';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import LoginModal from '../utility/LoginModal';
import { ChatRole } from '@lighthouse/types';
import { v4 as uuid } from 'uuid';
import { useHandleClickOutside } from '@/src/hooks/useHandleClickOutside';
import { TbExternalLink } from 'react-icons/tb';
import Image from 'next/image';
import { RxCross2 } from 'react-icons/rx';
import useGenerate from '@/src/hooks/useGenerate';
import { useLimitStore } from '@/src/store/code/useLimitStore';
import { useCurrentContract } from '@/src/hooks/useCurrentContract';
import BuilderChatInputFeatures from './BuilderChatInputFeatures';

export default function BuilderChatInput() {
    const [inputValue, setInputValue] = useState<string>('');
    const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);
    const { session } = useUserSessionStore();

    // Get contract-specific data
    const contract = useCurrentContract();
    const resetTemplate = useBuilderChatStore((state) => state.resetTemplate);

    const templateButtonRef = useRef<HTMLButtonElement | null>(null);
    const templatePanelRef = useRef<HTMLDivElement | null>(null);
    const [showTemplatePanel, setShowTemplatePanel] = useState<boolean>(false);
    const { set_states, handleGeneration } = useGenerate();
    const [hasExistingMessages, setHasExistingMessages] = useState<boolean>(false);
    const params = useParams();
    const contractId = params.contractId as string;
    const { showMessageLimit, setShowMessageLimit, showContractLimit, showRegenerateTime } =
        useLimitStore();
    const [showMoreOptionsPanel, setShowMoreOptionsPanel] = useState<boolean>(false);

    useHandleClickOutside([templateButtonRef, templatePanelRef], setShowTemplatePanel);

    function formatPretty(isoString: string) {
        const date = new Date(isoString);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const suffix =
            day % 10 === 1 && day !== 11
                ? 'st'
                : day % 10 === 2 && day !== 12
                  ? 'nd'
                  : day % 10 === 3 && day !== 13
                    ? 'rd'
                    : 'th';
        const time = date
            .toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            })
            .toLowerCase();
        return `${day}${suffix} ${month}, ${time}`;
    }

    async function handleSubmit() {
        if (!session?.user.id) {
            setOpenLoginModal(true);
            return;
        }
        if (showContractLimit || showMessageLimit) {
            return;
        }
        set_states(contractId, inputValue, contract.activeTemplate?.id);
        handleGeneration(contractId, inputValue, contract.activeTemplate?.id);
    }

    const userMessagesLength = contract.messages.filter((m) => m.role === ChatRole.USER).length;

    function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (hasExistingMessages && contract.activeTemplate) return;
            handleSubmit();
        }
    }

    function handleContinueToNewChat() {
        const redirect_contract_id = uuid();
        // Copy current contract's template to the new contract before navigating
        if (contract.activeTemplate) {
            set_states(
                redirect_contract_id,
                inputValue,
                contract.activeTemplate.id,
                contract.activeTemplate,
            );
        }
        if (showMessageLimit) {
            setShowMessageLimit(false);
        }
    }

    return (
        <>
            <div className="relative group w-full flex flex-col">
                {hasExistingMessages && (
                    <div className="flex gap-x-2 items-center w-full justify-center">
                        <Button
                            onClick={handleContinueToNewChat}
                            size={'mini'}
                            className="w-fit bg-dark hover:bg-dark/70 text-light/70 py-1 px-2.5 font-normal text-xs rounded-[4px] flex items-center border border-neutral-800"
                        >
                            continue to new chat
                            <TbExternalLink />
                        </Button>
                        <div
                            className="bg-red-600/20 hover:bg-red-500/20 transition-colors duration-100 rounded-[4px] aspect-square h-5.5 w-5.5 leading-snug cursor-pointer flex items-center justify-center"
                            onClick={() => {
                                setHasExistingMessages(false);
                                setShowTemplatePanel(false);
                                resetTemplate();
                            }}
                        >
                            <RxCross2 className="size-3 text-red-500 hover:text-red-400" />
                        </div>
                    </div>
                )}

                {showContractLimit && (
                    <div className="w-full px-1">
                        <div className="flex flex-col text-[13px] text-light/80 tracking-wider items-center w-full justify-center bg-dark border border-neutral-800 border-b-0 rounded-t-[8px] p-1">
                            <span>You have reached your daily limit, Try again at</span>
                            {formatPretty(showRegenerateTime!)}
                        </div>
                    </div>
                )}

                {showMessageLimit && (
                    <div className="w-full px-1">
                        <div className="flex gap-x-2 text-[13px] text-light/80 tracking-wider items-center w-full justify-center bg-dark border border-neutral-800 border-b-0 rounded-t-[8px] p-1">
                            <span>Message limit reached.</span>
                            <span
                                onClick={handleContinueToNewChat}
                                className="hover:underline cursor-pointer flex items-center gap-x-1"
                            >
                                start new chat
                                <TbExternalLink />
                            </span>
                        </div>
                    </div>
                )}

                <div className="relative rounded-[8px] border border-neutral-800/80 bg-darkest">
                    <div className="relative flex flex-col">
                        <div className="absolute left-4 top-5 text-neutral-600 font-mono text-sm select-none">
                            &gt;
                        </div>

                        <Textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="create a counter program..."
                            disabled={hasExistingMessages}
                            className={cn(
                                'w-full focus:h-28 h-15 bg-transparent pl-10 pr-4 py-5 text-neutral-200 border-0 shadow-none',
                                'placeholder:text-neutral-800 placeholder:text-sm resize-none',
                                'focus:outline-none transition-all duration-200',
                                'text-md tracking-wider caret-[#e6e0d4]',
                                hasExistingMessages && 'cursor-not-allowed opacity-50',
                            )}
                            rows={3}
                        />

                        {contract.activeTemplate && !hasExistingMessages && (
                            <div className="mx-3 mb-3">
                                <div className="h-25 w-25 relative rounded-sm overflow-hidden shadow-lg">
                                    <div
                                        onClick={() => resetTemplate()}
                                        className="absolute rounded-full h-4.5 w-4.5 flex justify-center items-center right-1 top-1 text-[13px] z-10 bg-light text-darkest cursor-pointer shadow-sm"
                                    >
                                        <RxCross2 />
                                    </div>
                                    <Image
                                        src={contract.activeTemplate.imageUrl}
                                        alt=""
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                    <div className="absolute bottom-0 text-[13px] text-darkest w-full bg-light px-1 py-px lowercase truncate font-semibold tracking-wide">
                                        {contract.activeTemplate.title}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <BuilderChatInputFeatures />
                </div>
            </div>

            <LoginModal opensignInModal={openLoginModal} setOpenSignInModal={setOpenLoginModal} />
        </>
    );
}
