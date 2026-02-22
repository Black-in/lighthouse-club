/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import { cn } from '@/src/lib/utils';
import Card from '../ui/Card';
import { PiStar, PiStarFill } from 'react-icons/pi';
import React, { useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { SiMinutemailer } from 'react-icons/si';
import { motion, AnimatePresence } from 'framer-motion';
import { public_review_schema } from '@lighthouse/types';
import axios from 'axios';
import { PUBLIC_REVIEW_URL } from '@/routes/api_routes';
import { toast } from 'sonner';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import Image from 'next/image';

interface ReviewForm {
    rating: number;
    content: string;
}

export default function PublicReviewCard() {
    const { session } = useUserSessionStore();
    const [form, setForm] = useState<ReviewForm>({
        rating: 0,
        content: '',
    });

    const hasRating = form.rating > 0;
    const updateForm = (updates: Partial<ReviewForm>) =>
        setForm((prev) => ({ ...prev, ...updates }));

    async function handleSubmit() {
        if (!session?.user?.token) {
            toast.info('Ghosts cant leave reviews, Log in to continue!');
            return;
        }
        const validation = public_review_schema.safeParse(form);
        if (!validation.success) return;

        try {
            const res = await axios.post(PUBLIC_REVIEW_URL, form, {
                headers: { Authorization: `Bearer ${session.user.token}` },
            });

            if (res.data.success) {
                toast.success('Thanks for the feedback!');
                setForm({ rating: 0, content: '' });
            }
        } catch {
            toast.error('Failed to submit the review');
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    }

    const handleStarClick = (value: number) => {
        if (value === form.rating) {
            updateForm({ rating: 0, content: '' });
        } else {
            updateForm({ rating: value });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
        >
            <Card
                className={cn(
                    'relative w-full max-w-sm rounded-lg p-5 overflow-hidden mt-4',
                    'bg-neutral-950/60 backdrop-blur-xl border border-neutral-800/80',
                    'shadow-[inset_1px_10px_15px_-10px_rgba(50,50,50,0.9)]',
                    'flex flex-col gap-3',
                )}
            >
                {session?.user && (
                    <div className="flex justify-between">
                        <div className="flex items-center gap-x-3">
                            <div className="flex items-center gap-3 relative h-7 w-7 rounded-full overflow-hidden">
                                <Image
                                    src={session.user.image || '/icons/blackin-mark-dark.svg'}
                                    alt=""
                                    fill
                                    unoptimized
                                    className="rounded-full object-cover"
                                />
                            </div>
                            <div className="text-neutral-300 text-md tracking-wide">
                                Hey, {session.user.name?.split(' ')[0]}
                            </div>
                        </div>
                        {form.rating > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex justify-end"
                            >
                                <Button
                                    onClick={handleSubmit}
                                    size="sm"
                                    className={cn(
                                        'px-4 py-2 rounded-[4px] text-sm',
                                        'text-neutral-200 border border-neutral-900 exec-button-dark',
                                    )}
                                >
                                    <SiMinutemailer className="size-4 mr-1 text-light" />
                                </Button>
                            </motion.div>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div className="text-md text-light/60 tracking-wide">Rate your experience</div>

                    <div className="flex gap-1.5 group">
                        {[1, 2, 3, 4, 5].map((value) => {
                            const active = value <= form.rating;
                            const Icon = active ? PiStarFill : PiStar;

                            return (
                                <motion.button
                                    key={value}
                                    whileHover={{ scale: 1.12 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleStarClick(value)}
                                    className="p-[5px] rounded-md"
                                >
                                    <motion.div
                                        animate={active ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                                        transition={{ duration: 0.22 }}
                                    >
                                        <Icon
                                            size={20}
                                            className={cn(
                                                active
                                                    ? 'text-neutral-100'
                                                    : 'text-neutral-500 group-hover:text-neutral-300',
                                                'transition-all transform cursor-pointer duration-300',
                                            )}
                                        />
                                    </motion.div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                <AnimatePresence initial={false}>
                    {hasRating && (
                        <motion.div
                            key="expanded"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.28 }}
                            className="flex flex-col gap-3 overflow-hidden"
                        >
                            <Textarea
                                value={form.content}
                                placeholder="What do you like?"
                                onKeyDown={handleKeyDown}
                                onChange={(e) => updateForm({ content: e.target.value })}
                                className={cn(
                                    'w-full min-h-[60px] resize-none px-3 py-3 rounded-lg text-sm',
                                    'bg-neutral-900/40 border border-neutral-800 text-neutral-300',
                                    'focus:ring-1 focus:ring-neutral-700 focus:border-neutral-700 tracking-wide placeholder:text-sm',
                                    'transition-all duration-150',
                                )}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </motion.div>
    );
}
