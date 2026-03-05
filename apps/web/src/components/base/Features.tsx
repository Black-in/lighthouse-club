'use client';
import React from 'react';
import { motion, useScroll, useTransform, MotionValue, AnimatePresence } from 'framer-motion';
import LighthouseMark from '../ui/svg/LighthouseMark';
import { FaBolt, FaCode, FaShieldAlt } from 'react-icons/fa';
import { Highlighter } from '@/src/components/ui/highlighter';
import { cn } from '@/src/lib/utils';

const featureData = [
    {
        topTitle: 'AI-POWERED',
        centerTitle: 'Base Apps',
        bottomTitle: 'Single Prompt',
        description: 'Generate production-ready Base applications from natural language',
        icon: FaCode,
        color: '#106DE1',
        gradient: 'from-blue-500/20 to-cyan-500/20',
    },
    {
        topTitle: 'INSTANT',
        centerTitle: 'Deploy',
        bottomTitle: 'One-Click',
        description: 'Deploy to Base Sepolia or Base Mainnet instantly',
        icon: FaBolt,
        color: '#FFC400',
        gradient: 'from-yellow-500/20 to-amber-500/20',
    },
    {
        topTitle: 'COMPLETE',
        centerTitle: 'BlackIn',
        bottomTitle: 'Full Stack',
        description: 'From contract to client SDK to frontend boilerplate',
        icon: LighthouseMark,
        color: '#5483B3',
        gradient: 'from-[#052659]/30 to-[#5483B3]/30',
    },
    {
        topTitle: 'ONCHAINKIT',
        centerTitle: 'Frontend',
        bottomTitle: 'Base Ready',
        description: 'Generated UIs are wired for Base-native wallet and contract flows',
        icon: LighthouseMark,
        color: '#106DE1',
        gradient: 'from-blue-500/20 to-cyan-500/20',
    },
    {
        topTitle: 'SECURE',
        centerTitle: 'Security',
        bottomTitle: 'AI Audits',
        description: 'Automated vulnerability detection and fixes',
        icon: FaShieldAlt,
        color: '#00C6A7',
        gradient: 'from-teal-500/20 to-emerald-500/20',
    },
];

export default function Features() {
    const containerRef = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const subtitleOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

    return (
        <section
            id="feature"
            ref={containerRef}
            className="relative bg-transparent"
            style={{ height: '350vh' }}
        >
            <div className="sticky top-0 w-screen h-screen flex flex-col items-center justify-start pt-26 md:px-10 gap-x-16 overflow-hidden rounded-[4px]">
                {/* <svg
                    className="absolute top-0 left-0 w-full h-16 z-20 "
                    viewBox="0 0 100 20"
                    preserveAspectRatio="none"
                >
                    <path d="M0 0 L0 0 L40 0 L42 10 58 10 L60 0 L100 0 L100 0 Z" fill="#" />
                </svg> */}

                <div className="absolute top-0 left-0 w-full h-full bg-primary z-10"></div>

                <div className="w-full md:max-w-[60%] md:text-5xl text-lg sm:text-2xl font-bold tracking-wider text-[#FDF9F0] md:leading-[1.2] relative text-center z-30">
                    BECAUSE CODING SHOULDN&apos;T RUIN YOUR SLEEP SCHEDULE
                    <div className="absolute text-[10px] sm:text-[12px] md:text-[15px] -top-6 font-extralight w-full flex justify-center text-[#d6caae]">
                        fin-tastic features. zero-hassle.
                    </div>
                </div>

                <motion.div
                    className="mt-40 flex flex-col w-full space-y-3 pointer-events-none z-30"
                    style={{ opacity: subtitleOpacity }}
                >
                    <div className="mt-4 w-full flex justify-center text-[7px] sm:text-sm md:text-2xl tracking-widest text-darkest font-semibold text-center px-4">
                        Transform your blockchain ideas into&nbsp;
                        <Highlighter action="underline" color="#5483B3">
                            production-ready
                        </Highlighter>
                        &nbsp;Base-native apps seamlessly.
                    </div>
                </motion.div>

                <div className="absolute w-full flex md:flex-row flex-col justify-center items-center top-65 md:mt-20 gap-2 sm:gap-4 md:space-x-2 z-30">
                    <div className="flex gap-2 sm:gap-4 md:hidden">
                        {featureData.slice(0, 3).map((feature, index) => (
                            <AnimatedFeatureCard
                                key={index}
                                index={index}
                                scrollProgress={scrollYProgress}
                                {...feature}
                            />
                        ))}
                    </div>
                    <div className="flex gap-2 sm:gap-4 md:hidden">
                        {featureData.slice(3, 5).map((feature, index) => (
                            <AnimatedFeatureCard
                                key={index}
                                index={index + 3}
                                scrollProgress={scrollYProgress}
                                {...feature}
                            />
                        ))}
                    </div>
                    <div className="hidden md:flex md:flex-row gap-2 sm:gap-4 md:space-x-2">
                        {featureData.map((feature, index) => (
                            <AnimatedFeatureCard
                                key={index}
                                index={index}
                                scrollProgress={scrollYProgress}
                                {...feature}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

interface FeatureCardProps {
    topTitle: string;
    centerTitle: string;
    bottomTitle: string;
    description: string;
    icon: React.ElementType;
    color: string;
    gradient: string;
    index: number;
    scrollProgress: MotionValue<number>;
}

export const AnimatedFeatureCard = React.memo(
    function AnimatedFeatureCard({
        topTitle,
        centerTitle,
        bottomTitle,
        description,
        icon: Icon,
        color,
        index,
        scrollProgress,
    }: FeatureCardProps) {
        const totalCards = 5;
        const delayFactor = index / totalCards;

        const startAnimation = 0.2 + delayFactor * 0.15;
        const holdStart = 0.4 + delayFactor * 0.15;
        const holdEnd = 0.65 + delayFactor * 0.15;
        const vanishStart = 0.75 + delayFactor * 0.15;
        const vanishEnd = 0.95 + delayFactor * 0.1;

        const timeline = [startAnimation, holdStart, holdEnd, vanishStart, Math.min(vanishEnd, 1)];

        const randomRotate = React.useMemo(() => Math.random() * 15 - 7.5, []);
        const randomX = React.useMemo(() => Math.random() * 40 - 20, []);

        const y = useTransform(scrollProgress, timeline, [250, 0, 0, -20, -200]);
        const opacity = useTransform(scrollProgress, timeline, [0, 1, 1, 0.95, 0]);
        const rotate = useTransform(
            scrollProgress,
            [timeline[0], timeline[1]],
            [randomRotate * 2, randomRotate],
        );
        const x = useTransform(
            scrollProgress,
            [timeline[0], timeline[1]],
            [randomX * 1.5, randomX],
        );
        const scale = useTransform(
            scrollProgress,
            [timeline[0], timeline[1], timeline[3], timeline[4]],
            [0.85, 1, 1, 0.92],
        );

        return (
            <AnimatePresence>
                <motion.div
                    style={{
                        y,
                        opacity,
                        rotate,
                        x,
                        scale,
                    }}
                    className={cn(
                        'h-[8rem] w-[6rem] sm:h-[12rem] sm:w-[9rem]',
                        'md:h-[22rem] md:w-[16rem]',
                        'rounded-[8px] flex flex-col justify-between',
                        'bg-gradient-to-br from-light to-neutral-50',
                        'border border-neutral-200/50',
                        'shadow-2xl shadow-black/30',
                        'relative sm:p-4 md:p-6',
                        'will-change-transform',
                        'overflow-hidden',
                    )}
                >
                    <div className="absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 bg-white/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 md:w-24 md:h-24 bg-white/15 rounded-full blur-2xl -ml-8 -mb-8 pointer-events-none" />

                    <div className="relative z-10 flex justify-center md:justify-between items-start">
                        <div className="text-[6px] sm:text-[9px] md:text-xs font-bold text-neutral-600 tracking-[0.15em] bg-white/70 backdrop-blur-sm px-2 py-1 rounded-[4px] shadow-sm">
                            {topTitle}
                        </div>
                        <div
                            className="hidden md:block w-2 h-2 md:w-3 md:h-3 rounded-full"
                            style={{
                                backgroundColor: color,
                                boxShadow: `0 0 8px ${color}80`,
                            }}
                        />
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-center flex-1 gap-y-2 md:gap-y-3">
                        <div
                            className="p-1 md:p-5 rounded-[8px] bg-white/90 backdrop-blur-sm shadow-xl"
                            style={{ boxShadow: `0 8px 24px ${color}25` }}
                        >
                            <Icon className="text-xl sm:text-3xl md:text-5xl" style={{ color }} />
                        </div>
                        <div className="text-center space-y-0.5 md:space-y-1">
                            <h3 className="text-[8px] sm:text-sm md:text-xl font-bold text-darkest tracking-wide">
                                {centerTitle}
                            </h3>
                            <p className="hidden md:block text-[8px] sm:text-[10px] md:text-xs tracking-wide text-neutral-600 font-medium hidden md:block px-2 leading-tight">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-center">
                        <div className="text-[7px] sm:text-[9px] md:text-xs font-semibold text-darkest bg-white/70 backdrop-blur-sm px-1.5 py-px md:px-3 md:py-1.5 rounded-full border border-neutral-200/70 shadow-sm">
                            {bottomTitle}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.index === nextProps.index &&
            prevProps.scrollProgress === nextProps.scrollProgress
        );
    },
);
