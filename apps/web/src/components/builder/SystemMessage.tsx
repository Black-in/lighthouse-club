'use client';

import { cn } from '@/src/lib/utils';
import { Message } from '@lighthouse/types';
import { PHASE_TYPES, STAGE } from '@/src/types/stream_event_types';
import { useEffect, useMemo, useState } from 'react';
import { usePlaygroundThemeStore } from '@/src/store/code/usePlaygroundThemeStore';
import { useCurrentContract } from '@/src/hooks/useCurrentContract';
import { formatThoughtSummary, resolveAgentActivity } from '@/src/lib/agent-activity';

interface SystemMessageProps {
    message: Message;
}

export default function SystemMessage({ message }: SystemMessageProps) {
    const [currentStage, setCurrentStage] = useState<STAGE>(STAGE.START);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const { theme } = usePlaygroundThemeStore();
    const contract = useCurrentContract();

    useEffect(() => {
        if (!message?.stage) return;
        setCurrentStage(message.stage);
    }, [message?.stage]);

    useEffect(() => {
        const startedAt = contract.loadingStartedAt;
        if (!startedAt) {
            setElapsedSeconds(0);
            return;
        }

        const syncElapsed = () => {
            setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)));
        };

        syncElapsed();
        const intervalId = window.setInterval(syncElapsed, 1000);
        return () => window.clearInterval(intervalId);
    }, [contract.loadingStartedAt]);

    const activity = useMemo(
        () => resolveAgentActivity(contract.phase, currentStage, contract.currentFileEditing),
        [contract.currentFileEditing, contract.phase, currentStage],
    );
    const isComplete = currentStage === STAGE.END || contract.phase === PHASE_TYPES.COMPLETE;
    const textClass = theme === 'light' ? 'text-[#0f172a]' : 'text-light/90';
    const subTextClass = theme === 'light' ? 'text-[#64748b]' : 'text-light/55';
    const pulseClass = theme === 'light' ? 'bg-[#1f2937]' : 'bg-white';
    const haloClass = theme === 'light' ? 'bg-[#cbd5e1]/60' : 'bg-white/20';

    if (isComplete) {
        return (
            <div className="w-full max-w-[34rem]">
                <div className={cn('text-[13px] leading-6', subTextClass)}>
                    {formatThoughtSummary(elapsedSeconds)}
                </div>
            </div>
        );
    }

    return (
        <div className="playground-system-message relative w-full max-w-[34rem] select-none">
            <div className="flex items-start gap-3">
                <div className="relative mt-[0.45rem] flex h-3 w-3 shrink-0 items-center justify-center">
                    <span className={cn('absolute h-3 w-3 animate-ping rounded-full', haloClass)} />
                    <span className={cn('relative h-2.5 w-2.5 rounded-full', pulseClass)} />
                </div>
                <div className="min-w-0">
                    <div className={cn('text-[13px] font-medium leading-6', textClass)}>
                        {activity.label}
                    </div>
                    {contract.currentFileEditing && (
                        <div className={cn('text-[12px] leading-5', subTextClass)}>
                            {contract.currentFileEditing}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
