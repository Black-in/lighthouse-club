/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { cn } from '@/src/lib/utils';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import React, { useEffect, useState, KeyboardEvent, useRef } from 'react';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useParams } from 'next/navigation';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import LoginModal from '../utility/LoginModal';
import { v4 as uuid } from 'uuid';
import { TbExternalLink } from 'react-icons/tb';
import Image from 'next/image';
import { RxCross2 } from 'react-icons/rx';
import useGenerate from '@/src/hooks/useGenerate';
import { useLimitStore } from '@/src/store/code/useLimitStore';
import { useCurrentContract } from '@/src/hooks/useCurrentContract';
import BuilderChatInputFeatures from './BuilderChatInputFeatures';
import { shouldSkipAuthClient } from '@/src/lib/auth-bypass';
import { HoverBorderGradient } from '../ui/hover-border-gradient';
import { X } from 'lucide-react';
import { usePlaygroundThemeStore } from '@/src/store/code/usePlaygroundThemeStore';

interface AttachmentItem {
    id: string;
    file: File;
    kind: 'image' | 'pdf';
    previewUrl?: string;
}

const getFileUniqueKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
};

export default function BuilderChatInput() {
    const [inputValue, setInputValue] = useState<string>('');
    const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
    const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
    const { session } = useUserSessionStore();
    const attachmentsRef = useRef<AttachmentItem[]>([]);

    // Get contract-specific data
    const contract = useCurrentContract();
    const resetTemplate = useBuilderChatStore((state) => state.resetTemplate);

    const { set_states, handleGeneration } = useGenerate();
    const [hasExistingMessages, setHasExistingMessages] = useState<boolean>(false);
    const params = useParams();
    const contractId = params.contractId as string;
    const { showMessageLimit, setShowMessageLimit, showContractLimit, showRegenerateTime } =
        useLimitStore();
    const { theme } = usePlaygroundThemeStore();
    const skipAuth = shouldSkipAuthClient();

    const borderGradientColors =
        theme === 'light'
            ? ['rgb(193, 232, 255)', 'rgb(125, 160, 202)', 'rgb(5, 38, 89)']
            : theme === 'dark'
              ? ['rgb(170, 170, 170)', 'rgb(116, 116, 116)', 'rgb(46, 46, 46)', 'rgb(10, 10, 10)']
              : ['rgb(164, 164, 164)', 'rgb(103, 103, 103)', 'rgb(36, 36, 36)', 'rgb(8, 8, 8)'];

    const borderAnimationSpeed = theme === 'light' ? 0.34 : theme === 'dark' ? 0.42 : 0.4;
    const borderNoiseIntensity = theme === 'light' ? 0.12 : theme === 'dark' ? 0.06 : 0.04;

    useEffect(() => {
        attachmentsRef.current = attachments;
    }, [attachments]);

    useEffect(() => {
        return () => {
            attachmentsRef.current.forEach((attachment) => {
                if (attachment.previewUrl) {
                    URL.revokeObjectURL(attachment.previewUrl);
                }
            });
        };
    }, []);

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
        if (contract.loading) {
            return;
        }
        if (!inputValue.trim() && attachments.length === 0) {
            return;
        }
        if (!session?.user.id && !skipAuth) {
            setOpenLoginModal(true);
            return;
        }
        if (showContractLimit || showMessageLimit) {
            return;
        }
        set_states(contractId, inputValue, contract.activeTemplate?.id, undefined, {
            markLoading: true,
        });
        handleGeneration(contractId, inputValue, contract.activeTemplate?.id);
        setInputValue('');
        setAttachments((prev) => {
            prev.forEach((attachment) => {
                if (attachment.previewUrl) {
                    URL.revokeObjectURL(attachment.previewUrl);
                }
            });
            return [];
        });
    }

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

    function handleFilesSelected(files: File[]) {
        const supportedFiles = files.filter((file) => {
            const lower = file.name.toLowerCase();
            const isPdf = file.type === 'application/pdf' || lower.endsWith('.pdf');
            const isImage = file.type.startsWith('image/');
            return isPdf || isImage;
        });

        if (supportedFiles.length === 0) return;

        setAttachments((prev) => {
            const existing = new Set(prev.map((attachment) => getFileUniqueKey(attachment.file)));
            const next = [...prev];
            for (const file of supportedFiles) {
                const key = getFileUniqueKey(file);
                if (existing.has(key)) continue;
                const isImage = file.type.startsWith('image/');
                next.push({
                    id: uuid(),
                    file,
                    kind: isImage ? 'image' : 'pdf',
                    previewUrl: isImage ? URL.createObjectURL(file) : undefined,
                });
                existing.add(key);
            }
            return next;
        });
    }

    function removeAttachment(idToRemove: string) {
        setAttachments((prev) => {
            const removing = prev.find((attachment) => attachment.id === idToRemove);
            if (removing?.previewUrl) {
                URL.revokeObjectURL(removing.previewUrl);
            }
            return prev.filter((attachment) => attachment.id !== idToRemove);
        });
    }

    return (
        <>
            <div className="playground-builder-chat-input relative group w-full flex flex-col">
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
                                resetTemplate();
                            }}
                        >
                            <RxCross2 className="size-3 text-red-500 hover:text-red-400" />
                        </div>
                    </div>
                )}

                {showContractLimit && (
                    <div className="w-full px-1">
                        <div className="playground-chat-limit-banner flex flex-col text-[13px] text-light/80 tracking-wider items-center w-full justify-center bg-dark border border-neutral-800 border-b-0 rounded-t-[8px] p-1">
                            <span>You have reached your daily limit, Try again at</span>
                            {formatPretty(showRegenerateTime!)}
                        </div>
                    </div>
                )}

                {showMessageLimit && (
                    <div className="w-full px-1">
                        <div className="playground-chat-limit-banner flex gap-x-2 text-[13px] text-light/80 tracking-wider items-center w-full justify-center bg-dark border border-neutral-800 border-b-0 rounded-t-[8px] p-1">
                            <span>Message limit reached.</span>
                            <span
                                onClick={handleContinueToNewChat}
                                className="playground-chat-limit-action hover:underline cursor-pointer flex items-center gap-x-1"
                            >
                                start new chat
                                <TbExternalLink />
                            </span>
                        </div>
                    </div>
                )}

                <HoverBorderGradient
                    as="div"
                    roundedClassName="rounded-[34px]"
                    containerClassName="w-full rounded-[34px]"
                    className="w-full !rounded-[34px] !p-0"
                    gradientColors={borderGradientColors}
                    duration={5}
                    speed={borderAnimationSpeed}
                    noiseIntensity={borderNoiseIntensity}
                    animating
                    backdropBlur={theme === 'light'}
                >
                    <div
                        className={cn(
                            'playground-chat-input-shell relative overflow-hidden rounded-[34px] bg-[#050505] shadow-[0_24px_64px_-34px_rgba(0,0,0,0.98)] backdrop-blur-sm transition-all duration-200',
                            isInputFocused && 'md:scale-[1.005]',
                        )}
                    >
                        <div
                            className={cn(
                                'px-5 pt-3.5 pb-[3.3rem] md:px-6 md:pt-4 transition-all duration-200',
                                isInputFocused ? 'md:pb-[3.7rem]' : 'md:pb-[3.3rem]',
                            )}
                        >
                            {attachments.length > 0 && (
                                <div className="mb-3 flex flex-wrap gap-2">
                                    {attachments.map((attachment) => (
                                        <div
                                            key={attachment.id}
                                            className="playground-chat-attachment inline-flex max-w-[16.5rem] items-center gap-2 rounded-xl border border-neutral-700/90 bg-[#1a1a1d] p-2"
                                        >
                                            {attachment.kind === 'image' && attachment.previewUrl ? (
                                                <Image
                                                    src={attachment.previewUrl}
                                                    alt={attachment.file.name}
                                                    width={40}
                                                    height={40}
                                                    unoptimized
                                                    className="h-10 w-10 rounded-md object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-500/20 text-[10px] font-semibold tracking-wide text-red-300">
                                                    PDF
                                                </div>
                                            )}
                                            <div className="flex min-w-0 flex-col">
                                                <span className="max-w-[10rem] truncate text-sm text-neutral-200">
                                                    {attachment.file.name}
                                                </span>
                                                <span className="text-xs text-neutral-400">
                                                    {formatFileSize(attachment.file.size)}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeAttachment(attachment.id)}
                                                disabled={contract.loading}
                                                className="playground-chat-attachment-remove rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                                placeholder="Prompt BlackIn to build your next web workflow"
                                disabled={hasExistingMessages || contract.loading}
                                className={cn(
                                    'playground-chat-textarea w-full h-[3.1rem] md:h-[3.8rem] focus:h-[4.9rem] bg-transparent px-0 py-0 text-neutral-200 border-0 shadow-none',
                                    'placeholder:text-neutral-600 placeholder:text-sm resize-none',
                                    'focus:outline-none transition-all duration-200',
                                    'text-md tracking-wider caret-[#e6e0d4]',
                                    (hasExistingMessages || contract.loading) &&
                                        'cursor-not-allowed opacity-50',
                                )}
                                rows={3}
                            />

                            {contract.activeTemplate && !hasExistingMessages && (
                                <div className="mt-3">
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

                        <div className="absolute inset-x-0 bottom-0">
                            <BuilderChatInputFeatures
                                inputValue={inputValue}
                                onSubmit={handleSubmit}
                                onFilesSelected={handleFilesSelected}
                                canSubmit={attachments.length > 0}
                                disabled={hasExistingMessages}
                                submitting={contract.loading}
                            />
                        </div>
                    </div>
                </HoverBorderGradient>
            </div>

            <LoginModal opensignInModal={openLoginModal} setOpenSignInModal={setOpenLoginModal} />
        </>
    );
}
