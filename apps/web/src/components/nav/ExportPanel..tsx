/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { cn } from '@/src/lib/utils';
import GitCloneCard from './GitCloneCard';
import ToolTipComponent from '../ui/TooltipComponent';
import { FiInfo } from 'react-icons/fi';
import DownloadZipFileComponent from './DownloadZipFileComponent';

export default function ExportPanel() {
    return (
        <div
            className={cn(
                'absolute top-11 right-0 bg-darkest border border-neutral-800 rounded-md shadow-lg z-20',
                'flex flex-col gap-y-1 min-w-[28rem] w-full pb-2',
            )}
        >
            <div className="text-xs tracking-wide p-4 pb-0 flex flex-col gap-y-2">
                <div className="flex justify-between items-center text-sm pb-1">
                    <span>Clone using the web URL</span>
                    <ToolTipComponent content="Which remote URL should I use?">
                        <FiInfo className="size-4 text-light/60" />
                    </ToolTipComponent>
                </div>
                <GitCloneCard />
            </div>

            <DownloadZipFileComponent />
        </div>
    );
}
