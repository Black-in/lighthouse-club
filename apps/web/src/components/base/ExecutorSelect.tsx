/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { Select, SelectTrigger, SelectContent, SelectItem } from '@/src/components/ui/select';
import { EXECUTOR } from '@lighthouse/types';
import { cn } from '@/src/lib/utils';
import { GoInfinity } from 'react-icons/go';
import { FaTelegramPlane } from 'react-icons/fa';
import VersionLockTicker from '../tickers/VersionLockTicker';

interface ModelSelectProps {
    value?: EXECUTOR;
    onChange?: (value: EXECUTOR) => void;
    disabled?: boolean;
    className?: string;
    hidePlanSvg?: boolean;
}

export default function ExecutorSelect({
    value,
    onChange,
    disabled,
    hidePlanSvg = false,
    className,
}: ModelSelectProps) {
    return (
        <div className={cn(className)}>
            <Select value={value} onValueChange={(val) => onChange?.(val as EXECUTOR)}>
                <SelectTrigger
                    disabled={disabled}
                    className={cn(
                        'h-7 text-[10px] flex items-center justify-center gap-1 rounded-xl border-none outline-none focus:outline-none',
                        'px-1 py-0 min-h-0 h-7 !h-7 !px-1 !py-0',
                        hidePlanSvg ? 'w-7' : 'w-12.5',
                        hidePlanSvg && '[&>svg]:hidden',
                        value === EXECUTOR.AGENTIC
                            ? 'text-[#5483B3] hover:bg-[#5483B330] bg-[#5483B330] border [&>svg]:!size-[14px] [&>svg]:!text-[#5483B3] focus:outline-none outline-none selection:outline-none'
                            : 'bg-[#FFBF0030] hover:bg-[#FFBF0030] text-[#FFBF00] border [&>svg]:!size-[14px] [&>svg]:!text-[#FFBF00] focus:outline-none outline-none selection:outline-none',
                    )}
                >
                    <div className="flex items-center text-[12px]">
                        {value === EXECUTOR.AGENTIC ? (
                            <GoInfinity color="#5483B3" size={14} />
                        ) : (
                            <FaTelegramPlane color="#FFD93D" size={14} />
                        )}
                    </div>
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-300">
                    <SelectItem
                        value={EXECUTOR.AGENTIC}
                        className="text-xs flex items-center gap-2"
                    >
                        <GoInfinity />
                        Agentic
                    </SelectItem>
                    <SelectItem
                        value={EXECUTOR.PLAN}
                        className="text-xs flex justify-between items-center gap-2"
                    >
                        <FaTelegramPlane />
                        Plan
                        <VersionLockTicker
                            className="absolute right-1 p-1 top-0.75"
                            showText={false}
                        />
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
