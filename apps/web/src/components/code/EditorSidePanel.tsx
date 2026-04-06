import { LuFile } from 'react-icons/lu';
import { PiGithubLogoFill } from 'react-icons/pi';
import ToolTipComponent from '../ui/TooltipComponent';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { useSidePanelStore } from '@/src/store/code/useSidePanelStore';
import { cn } from '@/src/lib/utils';
import { MdHomeFilled } from 'react-icons/md';
import { ClipboardList, MessageSquareText } from 'lucide-react';

export enum SidePanelValues {
    FILE = 'FILE',
    GITHUB = 'GITHUB',
    CHAT = 'CHAT',
    PLAN = 'PLAN',
}

interface EditorSidePanelProps {
    className?: string;
    showShell?: boolean;
    onGithubClick?: () => void;
    onHomeClick?: () => void;
}

export default function EditorSidePanel({
    className,
    showShell = true,
    onGithubClick,
    onHomeClick,
}: EditorSidePanelProps) {
    const { collapseFileTree, setCollapseFileTree, setCollapsechat, collapseChat } =
        useCodeEditor();
    const { currentState, setCurrentState } = useSidePanelStore();
    const activePanelValue =
        currentState === SidePanelValues.PLAN
            ? SidePanelValues.PLAN
            : currentState === SidePanelValues.GITHUB
              ? SidePanelValues.GITHUB
              : !collapseChat
                ? SidePanelValues.CHAT
                : SidePanelValues.FILE;

    function toggleChatPanelForFileView() {
        setCurrentState(SidePanelValues.FILE);
        setCollapsechat(!collapseChat);
    }

    const sidePanelData = [
        {
            icon: <MdHomeFilled size={20} />,
            value: undefined,
            onClick: () => onHomeClick?.(),
            tooltip: 'Home',
        },
        {
            icon: <LuFile size={20} />,
            value: SidePanelValues.FILE,
            onClick: () => toggleChatPanelForFileView(),
            tooltip: 'Files',
        },
        {
            icon: <PiGithubLogoFill size={21} />,
            value: SidePanelValues.GITHUB,
            onClick: () => {
                if (onGithubClick) {
                    onGithubClick();
                    return;
                }
                handleToggleSidebar(SidePanelValues.GITHUB);
            },
            tooltip: 'GitHub Repository',
        },
        {
            icon: <MessageSquareText className="h-[18px] w-[18px]" strokeWidth={1.8} />,
            value: SidePanelValues.CHAT,
            onClick: () => setCollapsechat(!collapseChat),
            tooltip: 'Toggle Chat Panel',
        },
        {
            icon: <ClipboardList className="h-[18px] w-[18px]" strokeWidth={1.8} />,
            value: SidePanelValues.PLAN,
            onClick: () => {
                handleToggleSidebar(SidePanelValues.PLAN);
            },
            tooltip: 'Plans',
        },
    ];

    function handleConditionalToggle(settingValue: SidePanelValues) {
        if (currentState === settingValue) {
            setCollapseFileTree(!collapseFileTree);
        } else {
            if (!collapseFileTree) setCollapseFileTree(!collapseFileTree);
        }
    }

    function handleToggleSidebar(value: SidePanelValues) {
        const isSamePanel = currentState === value;

        switch (value) {
            case SidePanelValues.PLAN: {
                setCurrentState(value);
                setCollapsechat(true);
                setCollapseFileTree(false);
                break;
            }
            case SidePanelValues.FILE: {
                if (isSamePanel && collapseChat) {
                    setCollapseFileTree(false);
                    setCollapsechat(false);
                    setCurrentState(SidePanelValues.CHAT);
                    break;
                }

                setCurrentState(value);
                setCollapsechat(true);
                setCollapseFileTree(true);
                break;
            }
            case SidePanelValues.GITHUB: {
                setCurrentState(value);
                setCollapsechat(true);
                handleConditionalToggle(value);
                break;
            }
            default: {
                setCurrentState(value);
                setCollapseFileTree(true);
            }
        }
    }

    return (
        <div
            className={cn(
                'playground-editor-side-shell h-full min-w-14',
                showShell && 'bg-[#090a0b] border-neutral-800 border-r',
                className,
            )}
        >
            <div className="flex flex-col gap-y-7 items-center py-5">
                {sidePanelData.map((item, index) => {
                    const isActive = item.value !== undefined && item.value === activePanelValue;

                    return (
                        <ToolTipComponent key={index} side="right" content={item.tooltip}>
                            <div
                                onClick={item.onClick}
                                className={cn(
                                    'playground-editor-side-item cursor-pointer transition-colors hover:text-primary/70',
                                    isActive ? 'text-primary/70' : 'text-light/70',
                                )}
                            >
                                {item.icon}
                            </div>
                        </ToolTipComponent>
                    );
                })}
            </div>
        </div>
    );
}
