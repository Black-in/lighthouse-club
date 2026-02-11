/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import Image from 'next/image';
import { HiPlus } from 'react-icons/hi';
import { cn } from '@/src/lib/utils';
import { useTemplateStore } from '@/src/store/user/useTemplateStore';
import { Dispatch, SetStateAction } from 'react';
import { Template } from '@lighthouse/types';

interface BaseContractTemplatePanelProps {
    closePanel: () => void;
    setActiveTemplate: Dispatch<SetStateAction<Template | null>>;
    className?: string;
}

export default function BaseContractTemplatesPanel({
    closePanel,
    setActiveTemplate,
    className,
}: BaseContractTemplatePanelProps) {
    const { templates } = useTemplateStore();

    return (
        <div
            data-lenis-prevent
            className={cn(
                'w-full max-w-md max-h-54 flex flex-col',
                'absolute left-23 z-50 bottom-12',
                'bg-darkest border border-neutral-800 shadow-md',
                'rounded-[4px] rounded-bl-none overflow-visible overflow-y-auto',
                className,
            )}
        >
            {templates.map((template) => (
                <TemplateListItem
                    key={template.id}
                    title={template.title}
                    description={template.description!}
                    image={template.imageUrl}
                    onClick={() => {
                        setActiveTemplate(template);
                        closePanel();
                    }}
                />
            ))}
        </div>
    );
}

interface TemplateListItemProps {
    title: string;
    description: string;
    image: string;
    onClick?: () => void;
}

function TemplateListItem({ title, description, image, onClick }: TemplateListItemProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                'w-full flex items-center justify-between',
                'mb-1 p-2 px-3 last:mb-0',
                'rounded-[4px]',
                'hover:bg-dark',
                'border border-darkest/40',
                'cursor-pointer transition-all z-40',
                'group/item',
            )}
        >
            <div className="flex items-center gap-3">
                <div className="relative h-8 min-w-8 bg-neutral-800 overflow-hidden ">
                    <Image
                        src={image}
                        alt={''}
                        fill
                        className="object-cover rounded-[4px]"
                        unoptimized
                        priority
                    />
                </div>

                <div className="flex flex-col items-start text-left">
                    <div className="text-[12px] font-semibold text-light/80 leading-snug">
                        {title}
                    </div>
                    <div className="text-[11px] text-light/60 leading-snug">{description}</div>
                </div>
            </div>

            <div
                className={cn(
                    'opacity-0 group-hover/item:opacity-100',
                    'transition-opacity ease-in-out',
                    'text-neutral-500 group-hover/item:text-primary',
                    'border border-neutral-700 rounded-[4px]',
                    'min-h-6 min-w-6 flex justify-center items-center bg-dark',
                    'mx-3 pr-px',
                )}
            >
                <HiPlus size={14} />
            </div>
        </div>
    );
}
