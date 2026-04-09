'use client';

import { cn } from '@/src/lib/utils';
import { useMemo, useState } from 'react';

interface ClarificationOption {
    id: string;
    label: string;
    description: string;
}

interface ClarificationQuestion {
    id: string;
    question: string;
    recommendedOptionId: string;
    options: ClarificationOption[];
}

interface RawClarificationPayload {
    kind: 'clarification';
    title: string;
    description: string;
    question?: ClarificationQuestion;
    questions?: ClarificationQuestion[];
    step?: number;
    totalSteps?: number;
}

interface ClarificationPayload {
    kind: 'clarification';
    title: string;
    description: string;
    question: ClarificationQuestion;
    step: number;
    totalSteps: number;
}

interface ClarificationQuestionCardProps {
    payload: ClarificationPayload;
}

export function parseClarificationPayload(value: unknown): ClarificationPayload | null {
    if (!value) return null;

    try {
        const parsed =
            typeof value === 'string'
                ? (JSON.parse(value) as RawClarificationPayload)
                : (value as RawClarificationPayload);

        if (parsed?.kind !== 'clarification') return null;

        const question = parsed.question || parsed.questions?.[0];
        if (!question || !Array.isArray(question.options)) return null;

        return {
            kind: 'clarification',
            title: parsed.title,
            description: parsed.description,
            question,
            step: parsed.step ?? 1,
            totalSteps: parsed.totalSteps ?? 1,
        };
    } catch {
        return null;
    }
}

export default function ClarificationQuestionCard({
    payload,
}: ClarificationQuestionCardProps) {
    const [selectedOptionId, setSelectedOptionId] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedOption = useMemo(
        () => payload.question.options.find((option) => option.id === selectedOptionId) ?? null,
        [payload.question.options, selectedOptionId],
    );

    function handleContinue() {
        if (!selectedOption || isSubmitting) return;
        setIsSubmitting(true);

        const response = `${payload.question.question} ${selectedOption.label}. ${selectedOption.description}`;

        window.dispatchEvent(
            new CustomEvent('builder-prefill-input', {
                detail: {
                    value: selectedOption.label,
                    submitValue: response,
                    submit: true,
                },
            }),
        );
    }

    return (
        <div className="mt-2.5 w-full min-w-0 rounded-2xl border border-neutral-800 bg-[#08090a] px-4 py-4 text-white">
            <div className="mb-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 text-sm font-medium leading-6">
                        {payload.title}
                    </div>
                    {payload.totalSteps > 1 && (
                        <div className="shrink-0 rounded-full border border-neutral-800 bg-[#0d0e10] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                            Step {payload.step} of {payload.totalSteps}
                        </div>
                    )}
                </div>
                <div className="mt-1 text-xs leading-5 text-neutral-400">{payload.description}</div>
            </div>

            <div className="flex flex-col gap-3">
                <div className="text-sm font-medium leading-6 text-neutral-100">
                    {payload.question.question}
                </div>

                <div className="flex flex-col gap-2">
                    {payload.question.options.slice(0, 3).map((option) => {
                        const selected = selectedOptionId === option.id;
                        const recommended = payload.question.recommendedOptionId === option.id;

                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => setSelectedOptionId(option.id)}
                                className={cn(
                                    'w-full rounded-xl border p-3 text-left transition-colors',
                                    selected
                                        ? 'border-[#5483B3] bg-[#101822]'
                                        : 'border-neutral-800 bg-[#0d0e10] hover:border-neutral-700',
                                )}
                            >
                                <div className="mb-1 flex flex-wrap items-start justify-between gap-2">
                                    <span className="min-w-0 flex-1 text-sm font-medium leading-6 text-neutral-100">
                                        {option.label}
                                    </span>
                                    {recommended && (
                                        <span className="shrink-0 rounded-full border border-[#5483B3]/40 bg-[#0f1823] px-2 py-0.5 text-[10px] text-[#8fb7ff]">
                                            Recommended
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs leading-5 text-neutral-400">
                                    {option.description}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs leading-5 text-neutral-500">
                    Select one option and I will continue from there.
                </div>
                <button
                    type="button"
                    onClick={handleContinue}
                    disabled={!selectedOption || isSubmitting}
                    className={cn(
                        'rounded-full px-4 py-2 text-sm font-medium transition-colors sm:self-auto',
                        selectedOption && !isSubmitting
                            ? 'bg-[#5483B3] text-white hover:bg-[#5d8ec3]'
                            : 'bg-neutral-800 text-neutral-500',
                    )}
                >
                    {isSubmitting ? 'Continuing...' : 'Continue'}
                </button>
            </div>
        </div>
    );
}
