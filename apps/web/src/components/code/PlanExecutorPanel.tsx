/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';

import { JSX, useState, useEffect } from 'react';
import { RiListCheck2 } from 'react-icons/ri';
import { GiBookmarklet } from 'react-icons/gi';
import { FaCheckDouble } from 'react-icons/fa6';
import { cn } from '@/src/lib/utils';
import { Button } from '../ui/button';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { IoMdExpand } from 'react-icons/io';
import { AiFillEdit } from 'react-icons/ai';
import ToolTipComponent from '../ui/TooltipComponent';
import { FaPlus } from 'react-icons/fa';
import { PlanMessage } from '@lighthouse/types';
import { usePlaygroundThemeStore } from '@/src/store/code/usePlaygroundThemeStore';

export interface PlanExecutorPanelProps {
    className?: string;
    hidePlanSvg?: boolean;
    collapse: boolean;
    expanded: boolean;
    editExeutorPlanPanel: boolean;

    plan: PlanMessage;

    onEdit?: () => void;
    onExpand?: () => void;
    onCollapse?: () => void;
    onDone?: () => void;
}

export interface ExecutorInstruction {
    selected: boolean;
    title: string;
    description: string; // using plan.short_description
}

export default function PlanExecutorPanel({
    className,
    expanded,
    collapse,
    onEdit,
    onExpand,
    onCollapse,
    onDone,
    editExeutorPlanPanel = false,
    plan,
}: PlanExecutorPanelProps): JSX.Element {
    const [_, setShowDetailedPlan] = useState<boolean>(expanded);
    const [instructions, setInstructions] = useState<ExecutorInstruction[]>(
        plan.contract_instructions.map((ins) => ({
            selected: false,
            title: ins.title,
            description: ins.short_description,
        })),
    );
    const { theme } = usePlaygroundThemeStore();

    // Refresh when new plan arrives
    useEffect(() => {
        setInstructions(
            plan.contract_instructions.map((ins) => ({
                selected: false,
                title: ins.title,
                description: ins.short_description,
            })),
        );
    }, [plan]);

    function toggleSelected(index: number): void {
        setInstructions((prev) =>
            prev.map((item, i) => (i === index ? { ...item, selected: !item.selected } : item)),
        );
    }

    const hasAnySelected = instructions.some((item) => item.selected);

    function toggleSelectAll(): void {
        const allSelected = instructions.every((item) => item.selected);
        setInstructions((prev) => prev.map((item) => ({ ...item, selected: !allSelected })));
    }

    function addInstruction(): void {
        const newInstruction: ExecutorInstruction = {
            selected: false,
            title: '',
            description: '',
        };

        setInstructions((prev) => [...prev, newInstruction]);

        setTimeout(() => {
            const inputs = document.querySelectorAll('input[aria-label="title"]');
            const lastInput = inputs[inputs.length - 1] as HTMLInputElement;
            if (lastInput) lastInput.focus();
        }, 0);
    }

    const allSelected = instructions.every((item) => item.selected);

    return (
        <div
            data-lenis-prevent
            className={cn(
                'playground-plan-executor max-w-170 px-4 py-5 pb-28 text-left relative transition-all duration-300 overflow-x-hidden overflow-y-auto mt-1 custom-scrollbar soft-scroll scroll-pb-16',
                collapse ? 'max-h-48 min-h-48' : expanded ? 'h-full min-h-0' : 'min-h-fit',
                className,
            )}
        >
            {collapse && (
                <div
                    className="absolute bottom-0 left-0 right-0 h-20 z-10 pointer-events-none"
                    style={{
                        background:
                            theme === 'light'
                                ? 'linear-gradient(to top, rgb(239, 244, 251), rgb(244, 247, 252), rgba(248, 250, 254, 0.52), transparent)'
                                : 'linear-gradient(to top, rgb(17, 17, 17), rgb(18, 18, 18), rgba(14, 14, 14, 0.389), transparent)',
                    }}
                />
            )}

            <div className="absolute top-2 right-2 flex items-center justify-end gap-x-2">
                <ToolTipComponent content="edit your planning context">
                    <div
                        onClick={onEdit}
                        className="playground-plan-executor-action size-4.5 text-light cursor-pointer transition-transform duration-300 bg-darkest/70 p-0.5 rounded-[4px] border border-light/10  hover:bg-neutral-600/10 flex items-center justify-start gap-x-1 w-fit px-2 py-2.5 select-none"
                    >
                        <span className="text-[12px] tex-light/90">edit</span>
                        <AiFillEdit />
                    </div>
                </ToolTipComponent>

                {!expanded && (
                    <ToolTipComponent content="expand">
                        <IoMdExpand
                            onClick={onExpand}
                            className="playground-plan-executor-action size-4.5 text-light cursor-pointer transition-transform duration-300 bg-darkest/70 rounded-[4px] border border-light/10 hover:bg-neutral-600/10 w-fit h-5.5 p-1"
                        />
                    </ToolTipComponent>
                )}

                {!expanded && (
                    <ToolTipComponent content="collapse">
                        <MdKeyboardArrowDown
                            onClick={onCollapse}
                            className={cn(
                                'playground-plan-executor-action size-4.5 text-light cursor-pointer transition-transform duration-300 bg-darkest/70 rounded-[4px] border border-light/10 hover:bg-neutral-600/10 w-fit h-5.5 p-1',
                                collapse && 'rotate-180',
                            )}
                        />
                    </ToolTipComponent>
                )}
            </div>

            {/* FILE NAME */}
            <div className="flex items-center justify-start gap-x-2 text-light/70">
                <RiListCheck2 className="size-3" />
                <span className="text-[11px] font-semibold select-none">
                    auto-generated.plan.md
                </span>
            </div>

            <h1 className="playground-plan-executor-title text-2xl font-bold text-left mt-3 text-light/90 select-none">
                {plan.contract_title}
            </h1>

            <p className="playground-plan-executor-desc text-left text-[13px] text-light/70 mt-1">{plan.short_description}</p>

            <div
                onClick={() => setShowDetailedPlan(true)}
                className="text-[#80a1c2] text-left text-[11px] mt-2 pl-1 hover:underline cursor-pointer"
            >
                read detailed plan
            </div>
            <div>
                {/* add detailed plan , show instructions here too, with the longer description, not the shorter description , take colors intutions from the below styling, do not change any other styling just add the deatilsed instructions the way it would look is , a instructions title in bulletins and then the longer descriptions */}
                {expanded && (
                    <div className="mt-4 pt-4 border-t border-light/10 space-y-3">
                        <div className="text-[13px] font-medium text-light/90">
                            Detailed Instructions
                        </div>
                        {plan.contract_instructions.map((instruction, index) => (
                            <div key={index} className="space-y-1.5">
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400/70 mt-1.5 flex-shrink-0" />
                                    <div className="text-[13px] font-medium text-light/90">
                                        {instruction.title}
                                    </div>
                                </div>
                                <div className="pl-3.5 text-[12px] text-light/60 leading-relaxed">
                                    {instruction.long_description}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div
                className={cn(
                    'playground-plan-executor-card',
                    'w-full border rounded-[6px] px-3 pb-3 pt-2 mt-1 relative',
                    editExeutorPlanPanel
                        ? 'border-[#80a1c260] bg-[#80a1c210]'
                        : 'border-neutral-800 bg-darkest',
                )}
            >
                <div className="text-xs text-light/70 flex items-center justify-start gap-x-2">
                    <GiBookmarklet className="text-light/70 size-3 mt-0.5" />
                    <span>instructions</span>
                </div>

                {/* BUTTONS RIGHT */}
                <div className="flex items-center justify-end gap-x-2 w-fit absolute top-2 right-2 ">
                    {editExeutorPlanPanel && (
                        <Button
                            size={'mini'}
                            variant={'ghost'}
                            className="text-light hover:text-light gap-x-2 hover:bg-dark/80 bg-dark border border-neutral-700 rounded-[8px]"
                            onClick={addInstruction}
                        >
                            <FaPlus className="size-2" />
                            <span className="text-xs">Add instruction</span>
                        </Button>
                    )}

                    {editExeutorPlanPanel && (
                        <Button
                            size={'mini'}
                            variant={'ghost'}
                            className="text-light hover:text-light gap-x-2 hover:bg-dark/80 bg-dark border border-neutral-700 rounded-[8px]"
                            onClick={onDone}
                        >
                            <span className="text-xs">Done</span>
                        </Button>
                    )}

                    <Button
                        size={'mini'}
                        variant={'ghost'}
                        onClick={toggleSelectAll}
                        className={cn(
                            'text-light gap-x-2 hover:bg-dark/80 bg-dark border border-neutral-700 rounded-[8px]',
                            !allSelected ? 'text-light/40 hover:text-light/40' : 'text-light',
                        )}
                    >
                        <FaCheckDouble className="size-2" />
                        <span className="text-xs">
                            {allSelected ? 'selected all' : 'select all'}
                        </span>
                    </Button>
                </div>

                {/* INSTRUCTION LIST */}
                <div className="flex flex-col gap-y-5 mt-5">
                    {instructions.map((ins, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-x-2.5 cursor-pointer"
                            onClick={() => !editExeutorPlanPanel && toggleSelected(index)}
                        >
                            <span
                            className={cn(
                                'playground-plan-executor-dot h-3 w-3 aspect-square border border-neutral-800 rounded-full bg-dark',
                                ins.selected && 'bg-light',
                            )}
                            />

                            <div className="flex flex-col -mt-1 flex-1">
                                {editExeutorPlanPanel ? (
                                    <input
                                        aria-label="title"
                                        type="text"
                                        value={ins.title}
                                        placeholder="instruction title"
                                        onChange={(e) => {
                                            const updated = [...instructions];
                                            updated[index].title = e.target.value;
                                            setInstructions(updated);
                                        }}
                                        className={cn(
                                            'text-[13px] bg-transparent border-none outline-none p-0 m-0 w-full',
                                            ins.selected && 'line-through text-light/40',
                                        )}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : (
                                    <span
                                        className={cn(
                                            'text-[13px]',
                                            ins.selected && 'line-through text-light/40',
                                        )}
                                    >
                                        {ins.title}
                                    </span>
                                )}

                                {editExeutorPlanPanel ? (
                                    <input
                                        aria-label="description"
                                        type="text"
                                        value={ins.description}
                                        placeholder="describe your instruction"
                                        onChange={(e) => {
                                            const updated = [...instructions];
                                            updated[index].description = e.target.value;
                                            setInstructions(updated);
                                        }}
                                        className="text-[12px] text-light/70 bg-transparent border-none outline-none p-0 m-0 w-full"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : (
                                    <span className="text-[12px] text-light/70">
                                        {ins.description}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* EXECUTE BUTTON */}
                <div className="flex items-start justify-end gap-x-3 mt-4">
                    {!editExeutorPlanPanel && (
                        <Button
                            disabled={!hasAnySelected}
                            className="bg-[#80a1c2] hover:bg-[#80a1c290] !text-light/70 text-[12px] h-auto font-semibold !py-0.5 exec-button-dark disabled:opacity-40 disabled:cursor-not-allowed"
                            variant={'ghost'}
                            size={'xs'}
                        >
                            Execute
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
