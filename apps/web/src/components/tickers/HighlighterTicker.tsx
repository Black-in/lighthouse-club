/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { motion } from 'framer-motion';
import { Highlighter } from '@/src/components/ui/highlighter';

export default function HighlighterTicker() {
    return (
        <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-[#a7a7a7] text-xs md:text-sm mb-6 font-mono tracking-normal md:tracking-wider"
        >
            <Highlighter action="highlight" padding={5} iterations={1} color="#6741EF">
                Prompt it.
            </Highlighter>{' '}
            <Highlighter action="underline" padding={0} color="#FFC412">
                Ship it.
            </Highlighter>
        </motion.p>
    );
}
