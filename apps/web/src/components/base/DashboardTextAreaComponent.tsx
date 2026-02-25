/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { cn } from '@/src/lib/utils';
import {
    useState,
    KeyboardEvent,
    ForwardedRef,
    useRef,
    ChangeEvent,
    useEffect,
    WheelEvent,
} from 'react';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { v4 as uuid } from 'uuid';
import LoginModal from '../utility/LoginModal';
import Image from 'next/image';
import useGenerate from '@/src/hooks/useGenerate';
import { useLimitStore } from '@/src/store/code/useLimitStore';
import { ArrowRight, ChevronDown, FileUp, Loader2, Plus, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
import { useHandleClickOutside } from '@/src/hooks/useHandleClickOutside';
import { HoverBorderGradient } from '../ui/hover-border-gradient';
import { shouldSkipAuthClient } from '@/src/lib/auth-bypass';

interface DashboardTextAreaComponentProps {
    inputRef?: ForwardedRef<HTMLTextAreaElement>;
}

interface AttachmentItem {
    id: string;
    file: File;
    kind: 'image' | 'pdf';
    previewUrl?: string;
}

const modelOptions = [
    'Auto Select',
    'OpenAI GPT 5.3 Codex',
    'Claude Sonnet 4.6',
    'Gemini 3.1 Pro',
    'Claude Opus 4.6',
] as const;

const getFileUniqueKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
};

export default function DashboardTextAreaComponent({ inputRef }: DashboardTextAreaComponentProps) {
    const [inputValue, setInputValue] = useState<string>('');
    const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);
    const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
    const [showPlusMenu, setShowPlusMenu] = useState<boolean>(false);
    const [selectedModel, setSelectedModel] = useState<(typeof modelOptions)[number]>(
        'Auto Select',
    );
    const [isTextareaFocused, setIsTextareaFocused] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const plusButtonRef = useRef<HTMLButtonElement | null>(null);
    const plusMenuRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const attachmentsRef = useRef<AttachmentItem[]>([]);

    const { showMessageLimit, showContractLimit } = useLimitStore();
    const { set_states } = useGenerate();
    const { session } = useUserSessionStore();
    const skipAuth = shouldSkipAuthClient();

    useHandleClickOutside([plusButtonRef, plusMenuRef], setShowPlusMenu);

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

    function handleSubmit() {
        if (isSubmitting) return;
        if (!session?.user.id && !skipAuth) {
            setOpenLoginModal(true);
            return;
        }
        if (showMessageLimit || showContractLimit) return;

        setIsSubmitting(true);
        const contractId = uuid();
        set_states(contractId, inputValue, undefined, undefined, { markLoading: true });
    }

    function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    }

    function handleTextareaWheel(e: WheelEvent<HTMLTextAreaElement>) {
        // Keep scroll interaction inside the input when content overflows.
        e.stopPropagation();
    }

    function handleUploadFiles() {
        setShowPlusMenu(false);
        fileInputRef.current?.click();
    }

    function handleFileSelection(e: ChangeEvent<HTMLInputElement>) {
        const picked = Array.from(e.target.files ?? []);
        const supportedFiles = picked.filter((file) => {
            const lower = file.name.toLowerCase();
            const isPdf = file.type === 'application/pdf' || lower.endsWith('.pdf');
            const isImage = file.type.startsWith('image/');
            return isPdf || isImage;
        });

        if (supportedFiles.length > 0) {
            setAttachments((prev) => {
                const existing = new Set(prev.map((attachment) => getFileUniqueKey(attachment.file)));
                const next = [...prev];
                for (const file of supportedFiles) {
                    const key = getFileUniqueKey(file);
                    if (!existing.has(key)) {
                        const isImage = file.type.startsWith('image/');
                        next.push({
                            id: uuid(),
                            file,
                            kind: isImage ? 'image' : 'pdf',
                            previewUrl: isImage ? URL.createObjectURL(file) : undefined,
                        });
                        existing.add(key);
                    }
                }
                return next;
            });
        }

        e.target.value = '';
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

    const isDisabled = isSubmitting || (!inputValue.trim() && attachments.length === 0);

    return (
        <>
            <div className="relative w-full">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf,image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileSelection}
                />
                <HoverBorderGradient
                    as="div"
                    roundedClassName="rounded-[34px]"
                    containerClassName="w-full rounded-[34px]"
                    className="w-full !rounded-[34px] !p-0"
                    gradientColors={
                        isTextareaFocused
                            ? ['rgb(193, 232, 255)', 'rgb(125, 160, 202)', 'rgb(5, 38, 89)']
                            : ['rgb(38, 38, 38)', 'rgb(38, 38, 38)', 'rgb(38, 38, 38)']
                    }
                    duration={5}
                    speed={0.14}
                    noiseIntensity={isTextareaFocused ? 0.18 : 0}
                    animating={isTextareaFocused}
                    backdropBlur
                >
                    <div className="relative overflow-hidden rounded-[34px] bg-[#050505] shadow-[0_24px_64px_-34px_rgba(0,0,0,0.98)]">
                        <div className="px-5 pb-14 pt-3.5 md:px-6 md:pb-15 md:pt-4">
                        {attachments.length > 0 && (
                            <div className="mb-3 flex flex-wrap gap-2">
                                {attachments.map((attachment) => (
                                    <div
                                        key={attachment.id}
                                        className="inline-flex max-w-[16.5rem] items-center gap-2 rounded-xl border border-neutral-700/90 bg-[#1a1a1d] p-2"
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
                                            className="rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <textarea
                            value={inputValue}
                            ref={inputRef}
                            onChange={(e) => setInputValue(e.target.value)}
                            onFocus={() => setIsTextareaFocused(true)}
                            onBlur={() => setIsTextareaFocused(false)}
                            onKeyDown={handleKeyDown}
                            onWheel={handleTextareaWheel}
                            placeholder="Describe your agentic web project"
                            disabled={isSubmitting}
                            className={cn(
                                'w-full h-[3.2rem] md:h-[3.9rem] resize-none bg-transparent border-0 p-0 overflow-y-auto overscroll-contain custom-scrollbar',
                                'text-[clamp(1.15rem,1.45vw,1.45rem)] leading-[1.15] tracking-[-0.01em] text-neutral-100',
                                'placeholder:text-neutral-500',
                                'focus:outline-none caret-neutral-300 disabled:opacity-70 disabled:cursor-not-allowed',
                            )}
                            rows={2}
                        />
                    </div>

                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 pb-2.5 md:px-5 md:pb-3">
                            <button
                                ref={plusButtonRef}
                                type="button"
                                onClick={() => setShowPlusMenu((prev) => !prev)}
                                disabled={isSubmitting}
                                className={cn(
                                    'inline-flex h-9 w-9 items-center justify-center rounded-full border',
                                    'border-neutral-700 bg-[#0a0a0a] text-neutral-200 transition-colors',
                                    showPlusMenu
                                        ? 'border-neutral-500 bg-[#151515] text-white'
                                        : 'hover:border-neutral-500 hover:bg-[#151515] hover:text-white',
                                )}
                            >
                                <Plus className="h-4 w-4" strokeWidth={1.8} />
                            </button>

                            <div className="flex items-center gap-1">
                                <Select
                                    value={selectedModel}
                                    onValueChange={(val) =>
                                        setSelectedModel(val as (typeof modelOptions)[number])
                                    }
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger
                                        className={cn(
                                            'h-9 !rounded-full border border-neutral-700 bg-[#0a0a0a] px-3 text-neutral-300',
                                            'w-fit min-w-fit justify-between gap-1.5 shadow-none hover:bg-[#151515] hover:border-neutral-600 [&>svg]:hidden',
                                        )}
                                    >
                                        <span className="whitespace-nowrap text-neutral-300 text-[12px] leading-none">
                                            {selectedModel}
                                        </span>
                                        <ChevronDown className="h-3 w-3 text-neutral-500" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-neutral-800 bg-[#050505] text-neutral-100">
                                        {modelOptions.map((model) => (
                                            <SelectItem
                                                key={model}
                                                value={model}
                                                className="data-[state=checked]:bg-white data-[state=checked]:text-black data-[highlighted]:bg-neutral-800 data-[highlighted]:text-white"
                                            >
                                                {model}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <button
                                    type="button"
                                    disabled={isDisabled}
                                    onClick={handleSubmit}
                                    className={cn(
                                        'inline-flex h-9 w-9 items-center justify-center rounded-full transition-all',
                                        isDisabled
                                            ? 'cursor-not-allowed bg-neutral-700 text-neutral-500'
                                            : 'bg-neutral-400 text-neutral-900 hover:bg-neutral-300',
                                    )}
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <ArrowRight className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </HoverBorderGradient>

                {showPlusMenu && (
                    <div
                        ref={plusMenuRef}
                        className="absolute bottom-[3.8rem] left-0 z-40 w-48 rounded-xl border border-neutral-800 bg-[#050505] p-1.5 shadow-[0_20px_50px_-30px_rgba(0,0,0,1)]"
                    >
                        <button
                            type="button"
                            onClick={handleUploadFiles}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-neutral-200 transition-colors hover:bg-neutral-800"
                        >
                            <FileUp className="h-3.5 w-3.5 text-neutral-300" />
                            Upload file/image
                        </button>
                    </div>
                )}
            </div>
            <LoginModal opensignInModal={openLoginModal} setOpenSignInModal={setOpenLoginModal} />
        </>
    );
}
