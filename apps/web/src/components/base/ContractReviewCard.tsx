/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { useState } from 'react';
import {
    PiSmileyAngryThin,
    PiSmileySadThin,
    PiSmileyMehThin,
    PiSmileyThin,
    PiSmileyWinkThin,
    PiCaretDownThin,
} from 'react-icons/pi';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import Card from '../ui/Card';
import { cn } from '@/src/lib/utils';
import OpacityBackground from '../utility/OpacityBackground';
import axios from 'axios';
import { toast } from 'sonner';
import { contractReviewSchema } from '@lighthouse/types';
import { CONTRACT_REVIEW_URL } from '@/routes/api_routes';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';

interface ContractReviewCardProps {
    open: boolean;
    onClose: () => void;
    contractId: string;
    onSubmit?: (data: { rating: number; liked: string; disliked: string }) => void;
}

interface ReviewForm {
    rating: number;
    liked: string;
    disliked: string;
    showLiked: boolean;
    showDisliked: boolean;
}

export default function ContractReviewCard({
    open,
    onClose,
    contractId,
    onSubmit,
}: ContractReviewCardProps) {
    const [form, setForm] = useState<ReviewForm>({
        rating: 0,
        liked: '',
        disliked: '',
        showLiked: false,
        showDisliked: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { session } = useUserSessionStore();
    if (!open) return null;

    const emotions = [
        { icon: PiSmileyAngryThin, value: 1 },
        { icon: PiSmileySadThin, value: 2 },
        { icon: PiSmileyMehThin, value: 3 },
        { icon: PiSmileyThin, value: 4 },
        { icon: PiSmileyWinkThin, value: 5 },
    ];

    const updateForm = (updates: Partial<ReviewForm>) => {
        setForm((prev) => ({ ...prev, ...updates }));
    };

    async function handleSubmit() {
        if (!session || !session.user || !session.user.token) return;
        try {
            setIsSubmitting(true);

            const validatedData = contractReviewSchema.safeParse({
                contractId,
                rating: form.rating,
                liked: form.liked || null,
                disliked: form.disliked || null,
            });

            if (!validatedData.success) {
                return;
            }

            const response = await axios.post(CONTRACT_REVIEW_URL, validatedData.data, {
                headers: {
                    Authorization: `Bearer ${session.user.token}`,
                },
            });

            if (response.data.success) {
                toast.success('Review submitted successfully!');
                onSubmit?.({
                    rating: form.rating,
                    liked: form.liked,
                    disliked: form.disliked,
                });
                handleCancel();
            }
        } catch {
            toast.error('Error in submitting your review');
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleCancel() {
        setForm({
            rating: 0,
            liked: '',
            disliked: '',
            showLiked: false,
            showDisliked: false,
        });
        onClose();
    }

    return (
        <OpacityBackground className="bg-darkest/30">
            <Card className="bg-darkest border border-neutral-800 rounded-[8px] w-full max-w-sm overflow-hidden px-6 py-4 absolute bottom-20 right-20">
                <div className="flex flex-col gap-4">
                    <h3 className="text-center text-2xl font-medium">How was your experience?</h3>
                    <div className="flex gap-x-5 justify-center">
                        {emotions.map((emotion) => {
                            const Icon = emotion.icon;
                            const isSelected = form.rating === emotion.value;
                            return (
                                <button
                                    aria-label="smiley"
                                    type="button"
                                    key={emotion.value}
                                    onClick={() => updateForm({ rating: emotion.value })}
                                    className={cn(
                                        'transition-colors border-none',
                                        'border',
                                        isSelected
                                            ? 'text-primary-light'
                                            : 'text-light/40 hover:border-primary/40',
                                    )}
                                >
                                    <Icon size={30} />
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            <Button
                                variant={'ghost'}
                                onClick={() => updateForm({ showLiked: !form.showLiked })}
                                className="w-full px-4 py-2 bg-darkest hover:bg-darkest border border-neutral-800 rounded text-left text-sm text-light/60 hover:text-light/60 hover:border-neutral-700 transition-colors flex items-center justify-between"
                            >
                                <span>{form.liked || 'My experience was good'}</span>
                                <PiCaretDownThin
                                    className={cn(
                                        'transition-transform',
                                        form.showLiked && 'rotate-180',
                                    )}
                                />
                            </Button>
                            {form.showLiked && (
                                <Textarea
                                    value={form.liked}
                                    onChange={(e) => updateForm({ liked: e.target.value })}
                                    placeholder="What did you like?"
                                    className="w-full border border-neutral-800"
                                />
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button
                                variant={'ghost'}
                                onClick={() => updateForm({ showDisliked: !form.showDisliked })}
                                className="w-full px-4 py-2 bg-darkest hover:bg-darkest border border-neutral-800 rounded text-left text-sm text-light/60 hover:text-light/60 hover:border-neutral-700 transition-colors flex items-center justify-between"
                            >
                                <span>{form.disliked || 'What could be improved'}</span>
                                <PiCaretDownThin
                                    className={cn(
                                        'transition-transform',
                                        form.showDisliked && 'rotate-180',
                                    )}
                                />
                            </Button>
                            {form.showDisliked && (
                                <Textarea
                                    value={form.disliked}
                                    onChange={(e) => updateForm({ disliked: e.target.value })}
                                    placeholder="What could be improved?"
                                    className="w-full border border-neutral-800"
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="ghost"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="flex-1 bg-dark hover:bg-dark hover:text-light"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={form.rating === 0 || isSubmitting}
                            className="flex-1 bg-light hover:bg-light hover:text-darkest text-darkest"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </div>
                </div>
            </Card>
        </OpacityBackground>
    );
}
