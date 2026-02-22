/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { cn } from '@/src/lib/utils';
import { useState, KeyboardEvent, ForwardedRef, useRef } from 'react';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { v4 as uuid } from 'uuid';
import LoginModal from '../utility/LoginModal';
import useGenerate from '@/src/hooks/useGenerate';
import { useLimitStore } from '@/src/store/code/useLimitStore';
import { Template } from '@lighthouse/types';
import { ArrowRight, ChevronDown, Plus, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
import { useHandleClickOutside } from '@/src/hooks/useHandleClickOutside';
import BaseContractTemplatesPanel from './BaseContractTemplatePanel';

interface DashboardTextAreaComponentProps {
    inputRef?: ForwardedRef<HTMLTextAreaElement>;
}

const modelOptions = [
    'Auto Select',
    'OpenAI GPT 5.3 Codex',
    'Claude Sonnet 4.6',
    'Gemini 3.1 Pro',
    'Claude Opus 4.6',
] as const;

export default function DashboardTextAreaComponent({ inputRef }: DashboardTextAreaComponentProps) {
    const [inputValue, setInputValue] = useState<string>('');
    const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);
    const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
    const [showTemplatePanel, setShowTemplatePanel] = useState<boolean>(false);
    const [selectedModel, setSelectedModel] = useState<(typeof modelOptions)[number] | null>(null);
    const templateButtonRef = useRef<HTMLButtonElement | null>(null);
    const templatePanelRef = useRef<HTMLDivElement | null>(null);

    const { showMessageLimit, showContractLimit } = useLimitStore();
    const { set_states } = useGenerate();
    const { session } = useUserSessionStore();

    useHandleClickOutside([templateButtonRef, templatePanelRef], setShowTemplatePanel);

    function handleSubmit() {
        if (!session?.user.id) {
            setOpenLoginModal(true);
            return;
        }
        if (showMessageLimit || showContractLimit) return;

        const contractId = uuid();
        set_states(contractId, inputValue, activeTemplate?.id, activeTemplate ?? undefined);
    }

    function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    }

    const isDisabled = !inputValue.trim() && !activeTemplate;

    return (
        <>
            <div className="relative w-full">
                <div className="relative overflow-hidden rounded-[34px] border border-neutral-800/90 bg-[#050505] shadow-[0_24px_64px_-34px_rgba(0,0,0,0.98)] backdrop-blur-sm">
                    <div className="px-5 pb-14 pt-3.5 md:px-6 md:pb-15 md:pt-4">
                        <textarea
                            value={inputValue}
                            ref={inputRef}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type @ for connectors and sources"
                            className={cn(
                                'w-full h-[3.2rem] md:h-[3.9rem] resize-none bg-transparent border-0 p-0',
                                'text-[clamp(1.15rem,1.45vw,1.45rem)] leading-[1.15] tracking-[-0.01em] text-neutral-100',
                                'placeholder:text-neutral-500',
                                'focus:outline-none caret-neutral-300',
                            )}
                            rows={2}
                        />
                    </div>

                    {activeTemplate && (
                        <div className="absolute left-5 bottom-[3rem] md:left-6">
                            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-600/80 bg-neutral-800/90 px-3 py-1 text-xs text-neutral-200">
                                <span className="max-w-40 truncate">{activeTemplate.title}</span>
                                <button
                                    type="button"
                                    onClick={() => setActiveTemplate(null)}
                                    className="rounded-full p-0.5 text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 pb-2.5 md:px-5 md:pb-3">
                        <button
                            ref={templateButtonRef}
                            type="button"
                            onClick={() => setShowTemplatePanel((prev) => !prev)}
                            className={cn(
                                'inline-flex h-9 w-9 items-center justify-center rounded-full border',
                                'border-neutral-700 bg-[#0a0a0a] text-neutral-200 transition-colors',
                                showTemplatePanel
                                    ? 'border-neutral-500 bg-[#151515] text-white'
                                    : 'hover:border-neutral-500 hover:bg-[#151515] hover:text-white',
                            )}
                        >
                            <Plus className="h-4 w-4" strokeWidth={1.8} />
                        </button>

                        <div className="flex items-center gap-1">
                            <Select
                                value={selectedModel ?? undefined}
                                onValueChange={(val) =>
                                    setSelectedModel(val as (typeof modelOptions)[number])
                                }
                            >
                                <SelectTrigger
                                    className={cn(
                                        'h-9 rounded-full border border-neutral-700 bg-[#0a0a0a] px-2.5 text-neutral-300',
                                        'w-fit min-w-fit justify-between gap-1.5 shadow-none hover:bg-[#151515] hover:border-neutral-600 [&>svg]:hidden',
                                    )}
                                >
                                    <span className="whitespace-nowrap text-neutral-300 text-[12px] leading-none">
                                        {selectedModel ?? 'Model'}
                                    </span>
                                    <ChevronDown className="h-3 w-3 text-neutral-500" />
                                </SelectTrigger>
                                <SelectContent className="border-neutral-800 bg-[#050505] text-neutral-100">
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
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {showTemplatePanel && (
                    <div ref={templatePanelRef} className="relative">
                        <BaseContractTemplatesPanel
                            setActiveTemplate={setActiveTemplate}
                            closePanel={() => setShowTemplatePanel(false)}
                            className="left-0 bottom-[3.8rem] max-w-[min(92vw,34rem)] rounded-xl border-neutral-700 bg-neutral-950"
                        />
                    </div>
                )}
            </div>
            <LoginModal opensignInModal={openLoginModal} setOpenSignInModal={setOpenLoginModal} />
        </>
    );
}
