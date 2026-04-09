'use client';

import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { cn } from '@/src/lib/utils';
import { X, KeyRound, ServerCog } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ByokModelModalProps {
    open: boolean;
    modelLabel: string;
    initialApiKey?: string;
    initialBaseURL?: string;
    onClose: () => void;
    onSave: (payload: { apiKey: string; baseURL?: string }) => void;
}

export default function ByokModelModal({
    open,
    modelLabel,
    initialApiKey = '',
    initialBaseURL = '',
    onClose,
    onSave,
}: ByokModelModalProps) {
    const [apiKey, setApiKey] = useState(initialApiKey);
    const [baseURL, setBaseURL] = useState(initialBaseURL);

    useEffect(() => {
        if (!open) return;
        setApiKey(initialApiKey);
        setBaseURL(initialBaseURL);
    }, [initialApiKey, initialBaseURL, open]);

    if (!open) return null;

    const canSave = apiKey.trim().length > 0;

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-neutral-800 bg-[#050505] shadow-[0_40px_120px_-48px_rgba(0,0,0,0.98)]">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-600 to-transparent" />

                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-800 bg-[#0d0e10] text-neutral-400 transition-colors hover:border-neutral-700 hover:text-white"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="px-5 pb-5 pt-6 md:px-6 md:pb-6">
                    <div className="mb-5 flex items-start gap-3">
                        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-800 bg-[#0b0c0e] text-[#8fb7ff]">
                            <KeyRound className="h-5 w-5" />
                        </div>
                        <div className="pr-10">
                            <div className="text-[15px] font-medium tracking-[0.01em] text-white">
                                Connect {modelLabel}
                            </div>
                            <div className="mt-1 text-sm leading-6 text-neutral-400">
                                Bring your own key for this model. Your credentials are kept in this browser and only sent when you run this model.
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-neutral-500">
                                <KeyRound className="h-3.5 w-3.5" />
                                API Key
                            </label>
                            <Input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Paste your Qwen provider key"
                                className={cn(
                                    'h-11 rounded-2xl border-neutral-800 bg-[#0a0a0a] px-4 text-sm text-white',
                                    'placeholder:text-neutral-500 focus-visible:border-neutral-600 focus-visible:ring-0',
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-neutral-500">
                                <ServerCog className="h-3.5 w-3.5" />
                                Endpoint URL
                                <span className="text-[10px] tracking-[0.12em] text-neutral-600">
                                    Optional
                                </span>
                            </label>
                            <Input
                                type="text"
                                value={baseURL}
                                onChange={(e) => setBaseURL(e.target.value)}
                                placeholder="https://your-openai-compatible-endpoint/v1"
                                className={cn(
                                    'h-11 rounded-2xl border-neutral-800 bg-[#0a0a0a] px-4 text-sm text-white',
                                    'placeholder:text-neutral-500 focus-visible:border-neutral-600 focus-visible:ring-0',
                                )}
                            />
                            <p className="text-xs leading-5 text-neutral-500">
                                Use this if your Qwen provider exposes an OpenAI-compatible API endpoint.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-3">
                        <div className="text-xs leading-5 text-neutral-500">
                            Model: {modelLabel}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                className="rounded-full px-4 text-neutral-300 hover:bg-neutral-900 hover:text-white"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                className="rounded-full bg-[#5483B3] px-5 text-white hover:bg-[#5d8ec3]"
                                disabled={!canSave}
                                onClick={() =>
                                    onSave({
                                        apiKey: apiKey.trim(),
                                        baseURL: baseURL.trim() || undefined,
                                    })
                                }
                            >
                                Save & Use
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
