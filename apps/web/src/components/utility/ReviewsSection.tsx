/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Quote } from 'lucide-react';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import ArchitectureTitleComponent from '../base/ArchitectureTitleComponent';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { GET_REVIEWS } from '@/routes/api_routes';
import timeParser from '@/src/hooks/useTimeParser';
import { PiStarFill } from 'react-icons/pi';
import UnclickableTicker from '../tickers/UnclickableTicker';

interface User {
    name: string;
    image: string;
}

interface Review {
    id: string | null;
    rating: number;
    title?: string | null;
    content: string | null;
    visible: boolean;
    createdAt: string;
    user: User;
}

export default function ReviewsSection() {
    const { session } = useUserSessionStore();
    const [reviews, setReviews] = useState<Review[]>([]);
    useEffect(() => {
        const getReviews = async () => {
            try {
                const { data } = await axios.get(GET_REVIEWS);
                const sorted = data.data.filter((review: Review) => review.visible);
                setReviews(sorted);
            } catch (error) {
                console.error('Failed to fetch reviews: ', error);
            }
        };
        getReviews();
    }, []);
    const column1 = reviews.slice(0, 3);
    const column2 = reviews.slice(3, 6);
    const column3 = reviews.slice(6, 10);
    return (
        <section className="relative min-h-screen max-h-screen max-w-screen flex flex-col items-center bg-gradient-to-b from-black via-zinc-950 to-black pb-20 border-t border-light/30">
            <UnclickableTicker className="py-0.5 -top-2.5 right-1/3 z-50 absolute">
                reviews
            </UnclickableTicker>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
            <div className="relative z-10 w-full">
                <ArchitectureTitleComponent
                    firstText="Winter tales"
                    secondText="from the Wall"
                    bgcolor="bg-none"
                />
                <div className="relative max-w-7xl mx-auto h-[600px] px-4 md:px-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full relative text-left">
                        <ReviewColumn reviews={column1} duration={30} />
                        <ReviewColumn reviews={column2} duration={35} />
                        <ReviewColumn reviews={column3} duration={32} />
                    </div>
                    <div className="absolute top-0 left-0 right-0 h-30 bg-gradient-to-b from-black via-black/60 to-transparent z-30 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-black via-black/60 to-transparent z-30 pointer-events-none" />
                </div>
                {session && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-16 text-center"
                    >
                        <button className="px-8 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-full text-primary font-semibold transition-all duration-300 hover:scale-105">
                            Share Your Story
                        </button>
                    </motion.div>
                )}
            </div>
        </section>
    );
}

function ReviewCard({ review }: { review: Review }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-linear-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-sm rounded-2xl p-6 mb-4 border border-zinc-800/50 hover:border-primary/30 transition-all duration-300 shadow-lg hover:shadow-primary/10 gap-y-2 flex flex-col"
        >
            <Quote className="w-8 h-8 fill-primary text-primary mb-2" />
            <div className="flex gap-x-1 text-light/80 mb-2">
                {Array.from({ length: review.rating }).map((_, i) => (
                    <PiStarFill className="text-primary" key={i} />
                ))}
            </div>
            <div className="mb-6">{review.content}</div>
            <div className="flex items-end justify-between gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20">
                    <Image
                        src={review.user.image}
                        alt={review.user.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                    />
                </div>
                <div className="">
                    <p className="text-light font-semibold">{review.user.name}</p>
                    <p className="text-light/60 text-sm">{timeParser(review.createdAt)} ago</p>
                </div>
            </div>
        </motion.div>
    );
}

function ReviewColumn({ reviews, duration }: { reviews: Review[]; duration: number }) {
    return (
        <div className="relative h-full overflow-hidden">
            <motion.div
                animate={{
                    y: [0, '-50%'],
                }}
                transition={{
                    duration: duration,
                    repeat: Infinity,
                    ease: 'linear',
                }}
                className="flex flex-col"
            >
                {[...reviews, ...reviews].map((review, index) => (
                    <ReviewCard key={`${review.id}-${index}`} review={review} />
                ))}
            </motion.div>
        </div>
    );
}
