/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { cn } from '@/src/lib/utils';
import { Textarea } from '../ui/textarea';
import { Terminal } from 'lucide-react';
import { useState, KeyboardEvent, ForwardedRef } from 'react';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { v4 as uuid } from 'uuid';
import LoginModal from '../utility/LoginModal';
import Image from 'next/image';
import { RxCross2 } from 'react-icons/rx';
import DashboardTextAreaBottom from './DashboardTextAreaBottom';
import useGenerate from '@/src/hooks/useGenerate';
import { useLimitStore } from '@/src/store/code/useLimitStore';
import { Template } from '@lighthouse/types';

interface DashboardTextAreaComponentProps {
    inputRef?: ForwardedRef<HTMLTextAreaElement>;
}

export default function DashboardTextAreaComponent({ inputRef }: DashboardTextAreaComponentProps) {
    const [inputValue, setInputValue] = useState<string>('');
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);
    const { showMessageLimit, showContractLimit } = useLimitStore();
    const { set_states } = useGenerate();
    const { session } = useUserSessionStore();
    const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
    // const { activeTemplate, resetTemplate } = useTemplateStore();

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

    return (
        <>
            <div className="relative group ">
                <div className="absolute -inset-1 bg-gradient-to-r from-neutral-600/20 via-neutral-500/20 to-neutral-600/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-neutral-950 rounded-lg border border-neutral-800 overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-between px-2.5 py-1 md:px-4 md:py-3 border-b border-neutral-800/50 bg-neutral-900/50">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                                <div className="h-2 w-2 md:w-2.5 md:h-2.5 rounded-full bg-neutral-700" />
                                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-neutral-700" />
                                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-neutral-700" />
                            </div>
                            <div className="flex items-center gap-2 text-neutral-500 text-[10px] md:text-xs font-mono h-full">
                                <Terminal className="w-2 h-2 md:w-3.5 md:h-3.5" />
                                <div className="h-full items-center pt-0.5">lighthouse.dev</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-x-1.5 justify-center">
                            <div
                                className={cn(
                                    'h-1.5 w-1.5 rounded-full transition-colors duration-300 mb-0.5',
                                    isTyping
                                        ? 'bg-green-500 shadow-lg shadow-green-500/50'
                                        : 'bg-neutral-700',
                                )}
                            />
                            <span className="text-[10px] pt-0.5 md:text-xs text-neutral-600 font-mono">
                                {isTyping ? 'active' : 'idle'}
                            </span>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute left-4 top-5 text-neutral-600 font-mono text-xs md:text-sm select-none">
                            &gt;
                        </div>
                        <Textarea
                            value={inputValue}
                            ref={inputRef}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                setIsTyping(e.target.value.length > 0);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="create a counter contract..."
                            className={cn(
                                'w-full h-20 md:h-28 bg-transparent pl-10 pr-4 py-5 text-neutral-200 border-0',
                                'placeholder:text-neutral-800 placeholder:font-mono placeholder:text-xs md:placeholder:text-sm resize-none',
                                'focus:outline-none transition-all duration-200',
                                'text-md tracking-wider',
                                'caret-[#e6e0d4]',
                            )}
                            rows={3}
                        />
                        {activeTemplate && (
                            <div className="mx-3 mb-3">
                                <div className="h-25 w-25 relative rounded-sm overflow-hidden shadow-lg">
                                    <div
                                        onClick={() => setActiveTemplate(null)}
                                        className="absolute rounded-full h-4.5 w-4.5 flex justify-center items-center right-1 top-1 text-[13px] z-10 bg-light text-darkest transition-colors transform duration-100 cursor-pointer shadow-sm"
                                    >
                                        <RxCross2 />
                                    </div>
                                    <Image
                                        src={activeTemplate.imageUrl}
                                        alt=""
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                    <div className="absolute bottom-0 text-[13px] text-darkest w-full bg-light px-1 py-px lowercase truncate shadow-lg font-semibold tracking-wide">
                                        {activeTemplate.title}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <DashboardTextAreaBottom
                        activeTemplate={activeTemplate}
                        setActiveTemplate={setActiveTemplate}
                        inputValue={inputValue}
                        handleSubmit={handleSubmit}
                    />
                </div>

                <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-600 to-transparent opacity-50" />
            </div>
            <LoginModal opensignInModal={openLoginModal} setOpenSignInModal={setOpenLoginModal} />
        </>
    );
}
