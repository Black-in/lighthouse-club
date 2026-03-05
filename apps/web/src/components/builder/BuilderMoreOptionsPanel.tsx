/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { cn } from '@/src/lib/utils';
import { useExecutorStore } from '@/src/store/model/useExecutorStore';
import { GoChevronRight, GoInfinity } from 'react-icons/go';
import { Button } from '../ui/button';
import { FileCode } from 'lucide-react';
import { useState } from 'react';
import BuilderTemplatesPanel from './BuilderTemplatesPanel';
import { EXECUTOR } from '@lighthouse/types';
import { FaTelegramPlane } from 'react-icons/fa';

interface BuilderMoreOptionsPanelProps {
    close: () => void;
    className: string;
}

const executorData = {
    [EXECUTOR.AGENTIC]: {
        title: 'Agentic',
        icon: GoInfinity,
        color: '#5483B3',
    },
    [EXECUTOR.PLAN]: {
        title: 'Plan',
        icon: FaTelegramPlane,
        color: '#FFD93D',
    },
};

export default function BuilderMoreOptionsPanel({
    close: _close,
    className,
}: BuilderMoreOptionsPanelProps) {
    const { executor } = useExecutorStore();
    const [showTemplatePanel, setShowTemplatePanel] = useState<boolean>(false);

    const meta = executorData[executor];

    return (
        <>
            <div
                data-lenis-prevent
                className={cn(
                    'w-fit max-h-54 flex flex-col items-start',
                    'absolute right-14 z-50 bottom-12',
                    'bg-darkest border border-neutral-800 shadow-md',
                    'rounded-[4px] rounded-bl-none overflow-visible overflow-y-auto',
                    className,
                )}
            >
                {/* agent / plan */}
                <Button
                    type="button"
                    className={cn(
                        'w-full',
                        'bg-transparent hover:bg-transparent flex items-center justify-between text-xs text-neutral-500 hover:text-neutral-300',
                    )}
                >
                    <div className="flex gap-x-1.5">
                        {<meta.icon className={`w-3.5 h-3.5 text-[${meta.color}] `} />}
                        <span>{meta.title}</span>
                    </div>
                    <GoChevronRight />
                </Button>

                {/* templates */}
                <Button
                    type="button"
                    className={cn(
                        'w-full',
                        'bg-transparent hover:bg-transparent flex items-center justify-between text-xs text-neutral-500 hover:text-neutral-300',
                    )}
                    onClick={() => setShowTemplatePanel(!showTemplatePanel)}
                >
                    <div className="flex justify-center gap-x-1.5">
                        <FileCode className="w-3.5 h-3.5 text-white " />
                        <span>templates</span>
                    </div>
                    <GoChevronRight />
                </Button>
            </div>
            {showTemplatePanel && (
                <BuilderTemplatesPanel
                    closePanel={() => setShowTemplatePanel(false)}
                    setHasExistingMessages={(_x) => {}}
                />
            )}
        </>
    );
}
