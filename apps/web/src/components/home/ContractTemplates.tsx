/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import useGenerate from '@/src/hooks/useGenerate';
import { useTemplateStore } from '@/src/store/user/useTemplateStore';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { Template } from '@lighthouse/types';
import Image from 'next/image';
import { useState } from 'react';
import { FaChevronRight, FaHeart } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa6';
import { v4 as uuid } from 'uuid';

export default function ContractTemplates() {
    const { templates } = useTemplateStore();
    const { session } = useUserSessionStore();
    const { set_states } = useGenerate();
    const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);

    function handleStartBuilding() {
        if (!session?.user.id) {
            return;
        }

        const contractId = uuid();
        set_states(contractId, null, activeTemplate?.id, activeTemplate ?? undefined, {
            markLoading: true,
        });
    }

    return (
        <div className="w-full h-full flex flex-col px-2 tracking-wider">
            <div className="w-full flex justify-between py-1 text-sm px-1">
                <span className="text-light">Featured Templates</span>
            </div>

            <div className="h-full flex gap-x-5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-2">
                {templates.map((template) => (
                    <div
                        key={template.id}
                        className="h-full min-w-[calc(27%-12px)] grid grid-rows-[85%_15%] overflow-hidden group relative"
                    >
                        <div className="bg-[#0A0C0D70] overflow-hidden shadow-sm border border-neutral-800 rounded-[8px] relative">
                            <Image
                                src={'/icons/blackin-mark-dark.svg'}
                                alt="BlackIn template"
                                fill
                                className="object-cover opacity-90"
                            />
                        </div>

                        <div className="text-light/40 h-full w-full flex items-center justify-between px-1">
                            <div className="text-sm">{template.title}</div>

                            <div className="flex gap-x-2.5 justify-center items-center h-full">
                                <div className="flex space-x-1">
                                    <FaUser className="size-3" />
                                    <span className="text-xs">1.4k</span>
                                </div>

                                <div className="flex space-x-1">
                                    <FaHeart className="size-3 hover:text-red-500 " />
                                    <span className="text-xs">32</span>
                                </div>
                            </div>
                        </div>
                        <div
                            onClick={() => {
                                setActiveTemplate(template);
                                handleStartBuilding();
                            }}
                            className="absolute flex items-center justify-center gap-x-1 px-5 py-1 bg-primary text-light font-bold opacity-0 group-hover:opacity-100 transition-all ease-in-out rounded-[2px] bottom-12 right-3 translate-x-2 group-hover:translate-x-0 cursor-pointer"
                        >
                            <span className="text-sm">start building </span>
                            <FaChevronRight size={12} strokeWidth={0.2} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
