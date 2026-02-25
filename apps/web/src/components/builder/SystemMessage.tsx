/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';

import { cn } from '@/src/lib/utils';
import { Message } from '@lighthouse/types';
import {
    FILE_STRUCTURE_TYPES,
    LOADER_STATES,
    PHASE_TYPES,
    STAGE,
} from '@/src/types/stream_event_types';

import { useEffect, useMemo, useRef, useState } from 'react';
import { FaListUl } from 'react-icons/fa6';
import { BsCheck2All } from 'react-icons/bs';
import { Check } from 'lucide-react';

import { CircleDotDashed } from '../ui/animated/circle-dot-dashed';
import { useReviewModalStore } from '@/src/store/user/useReviewModalStore';
import { usePlaygroundThemeStore } from '@/src/store/code/usePlaygroundThemeStore';

interface StageItem {
    stage: STAGE;
    show: string;
}

const stages: StageItem[] = [
    { stage: STAGE.PLANNING, show: 'Planning' },
    { stage: STAGE.GENERATING_CODE, show: 'Generating Code' },
    { stage: STAGE.BUILDING, show: 'Building' },
    { stage: STAGE.CREATING_FILES, show: 'Structuring Files' },
    { stage: STAGE.FINALIZING, show: 'Finalizing' },
    { stage: STAGE.END, show: 'Completed' },
];

interface SystemMessageProps {
    message: Message;
    currentPhase?: PHASE_TYPES | FILE_STRUCTURE_TYPES;
    currentFile?: string;
}

export default function SystemMessage({ message }: SystemMessageProps) {
    const [currentStage, setCurrentStage] = useState<STAGE>(STAGE.PLANNING);
    const initialStageRef = useRef<STAGE | null>(null);
    const lastReviewedContractRef = useRef<string | null>(null);
    const { show } = useReviewModalStore();
    const { theme } = usePlaygroundThemeStore();

    useEffect(() => {
        if (initialStageRef.current === null && message?.stage) {
            initialStageRef.current = message.stage;
        }
    }, [message?.stage]);

    useEffect(() => {
        if (!message?.stage) return;
        setCurrentStage(message.stage);
    }, [message?.stage]);

    useEffect(() => {
        if (!message?.stage || !message.contractId) return;

        if (currentStage === STAGE.END) {
            if (lastReviewedContractRef.current === message.contractId) return;

            const timer = setTimeout(() => {
                show(message.contractId);
                lastReviewedContractRef.current = message.contractId;
            }, 3000);

            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStage, message?.contractId, show]);

    const currentStageIndex = useMemo(() => {
        const index = stages.findIndex((s) => s.stage === currentStage);
        return index === -1 ? 0 : index;
    }, [currentStage]);

    const stagesExceptEnd = stages.filter((s) => s.stage !== STAGE.END);
    const allCompleted = currentStage === STAGE.END;
    const completedStage = stages[stages.length - 1];

    return (
        <div
            className={cn(
                'playground-system-message relative w-[80%] overflow-hidden rounded-[4px] border select-none',
                theme === 'light'
                    ? 'border-neutral-300 bg-linear-to-br from-[#f5f8fd] via-white to-[#f5f8fd] text-[#334155]'
                    : theme === 'dark'
                      ? 'border-[#302b2b] bg-linear-to-br from-[#171515] via-[#1b1818] to-[#171515] text-neutral-300'
                      : 'border-neutral-800 bg-linear-to-br from-[#0d0e0e] via-[#111212] to-[#0d0e0e] text-neutral-300',
            )}
        >
            <div className="px-5 pt-4 flex items-center gap-x-1.5 text-light/90">
                <FaListUl />
                <div>Execution strategy</div>
            </div>

            <div className="relative z-10 w-full flex flex-col gap-y-3 px-5 py-4.5">
                {stagesExceptEnd.map(({ stage, show }, index) => {
                    const status =
                        index < currentStageIndex
                            ? LOADER_STATES.COMPLETED
                            : index === currentStageIndex
                              ? LOADER_STATES.BUFFERING
                              : LOADER_STATES.HUNG;

                    const isCompleted = status === LOADER_STATES.COMPLETED;
                    const isBuffering = status === LOADER_STATES.BUFFERING;
                    const isHung = status === LOADER_STATES.HUNG;

                    return (
                        <div key={stage} className="flex items-start gap-x-3">
                            <div
                                className={cn(
                                    'flex items-center justify-center rounded-full transition-all',
                                    isCompleted &&
                                        'border border-green-600 text-green-600 w-3.5 h-3.5 p-0.5',
                                    isBuffering && 'w-4 h-4',
                                    isHung && 'border border-neutral-700 w-4 h-4 p-0.5',
                                )}
                            >
                                {isBuffering ? (
                                    <CircleDotDashed
                                        className="size-4 text-light/70 animate-spin"
                                        shouldAnimate
                                    />
                                ) : isCompleted ? (
                                    <Check strokeWidth={3} className="size-2" />
                                ) : null}
                            </div>

                            <div className="flex flex-col gap-y-1.5">
                                <div
                                    className={cn(
                                        'tracking-wider text-[13px] transition-all',
                                        isHung && 'opacity-50',
                                        isCompleted && 'text-light/70',
                                    )}
                                >
                                    {show}
                                </div>

                                {/* {stage === STAGE.GENERATING_CODE &&
                                    currentStage === STAGE.GENERATING_CODE && (
                                        <div className="pl-5 text-xs opacity-50">
                                            {currentFile
                                                ? `editing ${currentFile}`
                                                : currentPhase
                                                  ? `phase: ${currentPhase}`
                                                  : 'editing files'}
                                        </div>
                                    )} */}
                            </div>
                        </div>
                    );
                })}
            </div>

            {allCompleted && (
                <div className="px-5 pb-4 flex items-center gap-x-3 animate-fade-in">
                    <div className="text-green-600">
                        <BsCheck2All className="size-4" />
                    </div>
                    <div className="text-light/70 tracking-wider text-[13px]">
                        {completedStage.show}
                    </div>
                </div>
            )}
        </div>
    );
}
