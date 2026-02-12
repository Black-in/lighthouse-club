/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { useExecutorStore } from '@/src/store/model/useExecutorStore';
import ExecutorSelect from '../base/ExecutorSelect';
import { Button } from '../ui/button';
import { useRef, useState } from 'react';
import useGenerate from '@/src/hooks/useGenerate';
import { useParams } from 'next/navigation';
import { useLimitStore } from '@/src/store/code/useLimitStore';
import { useHandleClickOutside } from '@/src/hooks/useHandleClickOutside';
import { ArrowRight, FileCode } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import { useCurrentContract } from '@/src/hooks/useCurrentContract';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { GoPlus } from 'react-icons/go';
import BuilderMoreOptionsPanel from './BuilderMoreOptionsPanel';
import BuilderTemplatesPanel from './BuilderTemplatesPanel';
import { ChatRole } from '@lighthouse/types';

export default function BuilderChatInputFeatures() {
    const [inputValue, setInputValue] = useState<string>('');
    const { executor, setExecutor } = useExecutorStore();
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

    const isDisabled =
        (!inputValue.trim() && !contract.activeTemplate) ||
        (!contract.activeTemplate && userMessagesLength >= 5) ||
        showContractLimit ||
        showMessageLimit;

    function handleMoreOptions() {
        setShowMoreOptionsPanel(!showMoreOptionsPanel);
    }

    return (
        <div className=" w-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-2.5 ">
                <div className="flex items-center gap-x-1">
                    <div className="hidden sm:flex items-center gap-x-1">
                        <ExecutorSelect value={executor} onChange={setExecutor} />
                        <Button
                            type="button"
                            ref={templateButtonRef}
                            disabled={hasExistingMessages}
                            className={cn(
                                'group/btn bg-transparent hover:bg-transparent flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300',
                                hasExistingMessages && 'cursor-not-allowed opacity-50',
                            )}
                            onClick={() => setShowTemplatePanel((prev) => !prev)}
                        >
                            <FileCode className="w-3.5 h-3.5 mb-0.5" />
                            <span>templates</span>
                        </Button>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-mono">
                        <span className={cn(inputValue.length > 200 && 'text-red-500')}>
                            {inputValue.length}
                        </span>
                        <span className="text-neutral-800">/</span>
                        <span className="text-neutral-700">200</span>
                    </div>
                </div>

                <div className="flex gap-x-1">
                    <Button
                        type="button"
                        onClick={handleMoreOptions}
                        className={cn(
                            'flex items-center gap-2 h-8 w-9 px-2 py-1 rounded-[4px] text-xs font-mono',
                            'disabled:cursor-not-allowed exec-button-dark',
                            'flex sm:hidden',
                        )}
                    >
                        <GoPlus className="w-3 h-3" />
                    </Button>
                    <Button
                        type="button"
                        disabled={isDisabled}
                        onClick={handleSubmit}
                        className={cn(
                            'group/submit flex items-center gap-2 h-8 w-9 px-2 py-1 rounded-[4px] text-xs font-mono',
                            'disabled:cursor-not-allowed exec-button-dark',
                            inputValue.trim() && contract.activeTemplate
                                ? 'bg-neutral-800 text-neutral-300 hover:text-neutral-200'
                                : 'bg-neutral-900 text-neutral-700',
                        )}
                    >
                        <ArrowRight className="w-3 h-3" />
                    </Button>
                </div>
            </div>

            {showTemplatePanel && !hasExistingMessages && (
                <div ref={templatePanelRef}>
                    <BuilderTemplatesPanel
                        closePanel={() => setShowTemplatePanel(false)}
                        className="max-w-[21rem] bottom-16 left-28"
                        setHasExistingMessages={setHasExistingMessages}
                    />
                </div>
            )}

            {showMoreOptionsPanel && (
                <div>
                    <BuilderMoreOptionsPanel
                        close={() => setShowTemplatePanel(false)}
                        className="max-w-[21rem] bottom-16 "
                    />
                </div>
            )}
        </div>
    );
}
