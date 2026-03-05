import { motion } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { doto } from './FeatureOne';
import PublicReviewCard from './PublicReviewCard';
import VersionLockTicker from '../tickers/VersionLockTicker';
import LighthouseMark from '../ui/svg/LighthouseMark';

const footerLinks = [
    {
        title: 'Product',
        links: [
            'AI App Generator',
            'Code Workspace',
            'Deploy & Monitor',
            'Base SDK Generator',
            'Template Marketplace',
        ],
    },
    {
        title: 'Resources',
        links: [
            'Documentation',
            'Base Guide',
            'API Reference',
            'Security Best Practices',
            'Community Forum',
        ],
    },
    {
        title: 'Connect',
        links: ['Social links coming soon'],
    },
];

export default function Footer() {
    return (
        <motion.div className="min-w-screen min-h-screen md:h-screen bg-[#0a0b0d] relative">
            <div className="md:h-[65%] w-full border-b border-neutral-700 md:pt-20 pt-12 px-4 flex flex-col md:flex-row">
                <div className="md:w-[50%] w-full h-full md:border-r border-neutral-700 text-neutral-100 px-4 text-left mb-8 md:mb-0">
                    <div className="max-w-lg md:text-5xl text-3xl font-semibold tracking-wide leading-tight">
                        Build Base-Native Apps in Minutes, Not Days.
                    </div>
                    <PublicReviewCard />
                </div>
                <div className="md:w-[50%] w-full h-full flex flex-col md:flex-row">
                    {footerLinks.map((section, index) => (
                        <div
                            key={section.title}
                            className={`w-full h-full px-4 flex flex-col items-start text-neutral-200 gap-y-3 mb-8 md:mb-0 pb-6 md:pb-0 ${
                                index < footerLinks.length - 1
                                    ? 'md:border-r border-b md:border-b-0 border-neutral-700'
                                    : ''
                            }`}
                        >
                            <div className="md:text-3xl text-2xl font-semibold">
                                {section.title}
                            </div>
                            <div className="flex flex-col items-start gap-y-2 text-neutral-400">
                                {section.links.map((link) => (
                                    <span
                                        key={link}
                                        className="cursor-pointer hover:text-primary transition-colors flex gap-x-1.5"
                                    >
                                        {link}
                                        {(link === 'Code Workspace' ||
                                            link === 'Deploy & Monitor') && (
                                            <div>
                                                <VersionLockTicker
                                                    showText={false}
                                                    className={cn(
                                                        'border border-white/10',
                                                        'p-1 rounded-[5px] cursor-auto',
                                                    )}
                                                    iconClassName="size-3"
                                                />
                                            </div>
                                        )}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div
                className={`md:h-[35%] py-12 md:py-0 text-neutral-200 w-full flex flex-col justify-center items-center`}
            >
                <div className="md:text-[10rem] text-4xl font-black tracking-wider flex items-center md:flex-row">
                    <span className={cn(doto.className)}>BlackIn</span>
                    <LighthouseMark className="text-primary md:h-52 md:w-52 h-12 w-12 transition-all duration-500" />
                </div>
                <p className="text-neutral-500 md:text-sm text-xs tracking-wider mt-4 text-center px-4">
                    © 2025 BlackIn. Powered by AI + Base.
                </p>
            </div>
        </motion.div>
    );
}
