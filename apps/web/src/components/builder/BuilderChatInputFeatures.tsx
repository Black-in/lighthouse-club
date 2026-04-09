/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { cn } from '@/src/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { HoverBorderGradient } from '../ui/hover-border-gradient';
import { ArrowRight, ChevronDown, FileUp, Loader2, Plus } from 'lucide-react';
import { useRef, useState, ChangeEvent } from 'react';
import { useHandleClickOutside } from '@/src/hooks/useHandleClickOutside';
import { toast } from 'sonner';
import { isByokModelOption, isProModelOption, MODEL_OPTIONS, type ModelOption } from '@/src/lib/model-options';
const ProTag = () => (
    <HoverBorderGradient
        as="span"
        roundedClassName="rounded-full"
        containerClassName="rounded-full"
        className="!px-2 !py-0.5 text-[9px] font-semibold leading-none tracking-[0.08em] text-white"
        gradientColors={['rgb(193, 232, 255)', 'rgb(125, 160, 202)', 'rgb(5, 38, 89)']}
        duration={5}
        speed={0.14}
        noiseIntensity={0.18}
    >
        PRO
    </HoverBorderGradient>
);

interface BuilderChatInputFeaturesProps {
    inputValue: string;
    selectedModel: ModelOption;
    onModelChange: (model: ModelOption) => void;
    onSubmit: () => void;
    onFilesSelected?: (files: File[]) => void;
    canSubmit?: boolean;
    disabled?: boolean;
    submitting?: boolean;
}

export default function BuilderChatInputFeatures({
    inputValue,
    selectedModel,
    onModelChange,
    onSubmit,
    onFilesSelected,
    canSubmit = false,
    disabled = false,
    submitting = false,
}: BuilderChatInputFeaturesProps) {
    const [showPlusMenu, setShowPlusMenu] = useState<boolean>(false);
    const plusButtonRef = useRef<HTMLButtonElement | null>(null);
    const plusMenuRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useHandleClickOutside([plusButtonRef, plusMenuRef], setShowPlusMenu);

    function handleUploadFiles() {
        setShowPlusMenu(false);
        fileInputRef.current?.click();
    }

    function handleFileSelection(e: ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        if (files.length > 0) {
            onFilesSelected?.(files);
        }
        e.target.value = '';
    }

    const controlsDisabled = disabled || submitting;
    const isDisabled = controlsDisabled || (!inputValue.trim() && !canSubmit);

    return (
        <div className="playground-chat-input-footer relative flex items-center justify-between px-4 pb-2.5 md:px-5 md:pb-3">
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf,image/*"
                multiple
                className="hidden"
                onChange={handleFileSelection}
            />

            <button
                ref={plusButtonRef}
                type="button"
                onClick={() => setShowPlusMenu((prev) => !prev)}
                disabled={controlsDisabled}
                className={cn(
                    'playground-chat-plus-btn inline-flex h-9 w-9 items-center justify-center rounded-full border',
                    'border-neutral-700 bg-[#0a0a0a] text-neutral-200 transition-colors',
                    showPlusMenu
                        ? 'border-neutral-500 bg-[#151515] text-white'
                        : 'hover:border-neutral-500 hover:bg-[#151515] hover:text-white',
                )}
            >
                <Plus className="playground-chat-plus-icon h-4 w-4" strokeWidth={1.8} />
            </button>

            <div className="flex items-center gap-1">
                <Select
                    value={selectedModel}
                    onValueChange={(val) => {
                        if (isByokModelOption(val)) {
                            onModelChange(val as ModelOption);
                            return;
                        }
                        if (isProModelOption(val)) {
                            toast.info('Upgrade to Pro to access this model');
                            return;
                        }
                        onModelChange(val as ModelOption);
                    }}
                    disabled={controlsDisabled}
                >
                    <SelectTrigger
                        className={cn(
                            'playground-chat-model-trigger h-9 !rounded-full border border-neutral-700 bg-[#0a0a0a] px-3 text-neutral-300',
                            'w-fit min-w-fit justify-between gap-1.5 shadow-none hover:bg-[#151515] hover:border-neutral-600 [&>svg]:hidden',
                        )}
                    >
                        <span className="playground-chat-model-label flex items-center gap-1.5 whitespace-nowrap text-[12px] leading-none text-neutral-300">
                            {selectedModel}
                            {isProModelOption(selectedModel) && <ProTag />}
                        </span>
                        <ChevronDown className="playground-chat-model-chevron h-3 w-3 text-neutral-500" />
                    </SelectTrigger>
                    <SelectContent className="playground-chat-model-menu rounded-2xl border-neutral-800 bg-[#050505] text-neutral-100">
                        {MODEL_OPTIONS.map((model) => {
                            const isPro = isProModelOption(model);
                            const item = (
                                <SelectItem
                                    key={model}
                                    value={model}
                                    onSelect={
                                        isPro
                                            ? (e) => {
                                                  e.preventDefault();
                                                  toast.info(
                                                      'Upgrade to Pro to access this model',
                                                  );
                                              }
                                            : undefined
                                    }
                                    className="playground-chat-model-option"
                                >
                                    <span className="flex items-center gap-2">
                                        <span>{model}</span>
                                        {isPro && <ProTag />}
                                    </span>
                                </SelectItem>
                            );

                            if (!isPro) return item;

                            return (
                                <Tooltip key={model}>
                                    <TooltipTrigger asChild>{item}</TooltipTrigger>
                                    <TooltipContent side="right" sideOffset={8}>
                                        Upgrade to Pro to access this model
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </SelectContent>
                </Select>

                <button
                    type="button"
                    disabled={isDisabled}
                    onClick={onSubmit}
                    className={cn(
                        'playground-chat-send-btn inline-flex h-9 w-9 items-center justify-center rounded-full font-semibold tracking-wider exec-button-dark',
                        isDisabled
                            ? 'cursor-not-allowed opacity-45 hover:translate-y-0 active:scale-100'
                            : 'bg-light text-darkest hover:bg-light hover:text-darkest cursor-pointer transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
                    )}
                >
                    {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <ArrowRight className="h-4 w-4" />
                    )}
                </button>
            </div>

            {showPlusMenu && (
                <div
                    ref={plusMenuRef}
                    className="playground-chat-upload-menu absolute bottom-[3.8rem] left-0 z-40 w-48 rounded-xl border border-neutral-800 bg-[#050505] p-1.5 shadow-[0_20px_50px_-30px_rgba(0,0,0,1)]"
                >
                    <button
                        type="button"
                        onClick={handleUploadFiles}
                        className="playground-chat-upload-action flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-neutral-200 transition-colors hover:bg-neutral-800"
                    >
                        <FileUp className="h-3.5 w-3.5 text-neutral-300" />
                        Upload file/image
                    </button>
                </div>
            )}
        </div>
    );
}
