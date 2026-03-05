/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { JSX, useState } from 'react';
import PlanExecutorPanel from './PlanExecutorPanel';
import { useExecutorStore } from '@/src/store/model/useExecutorStore';
import { useSidePanelStore } from '@/src/store/code/useSidePanelStore';
import { SidePanelValues } from './EditorSidePanel';

export default function PlanPanel(): JSX.Element {
    const [collapsePanel, setCollapsePanel] = useState<boolean>(false);
    const { editExeutorPlanPanel, setEditExeutorPlanPanel } = useExecutorStore();
    const { setCurrentState } = useSidePanelStore();
    // if (!message)
    //     return (
    //         <div className="w-full h-full flex items-center justify-center text-light/50 bg-[#151617]">
    //             No Plan Selected
    //         </div>
    //     );
    return (
        <div className="playground-plan-panel w-full h-full min-h-0 flex justify-center bg-[#070708] overflow-hidden">
            <PlanExecutorPanel
                plan={DUMMY_PLAN}
                onCollapse={() => {
                    setCollapsePanel((prev) => !prev);
                }}
                onEdit={() => {
                    setEditExeutorPlanPanel(!editExeutorPlanPanel);
                }}
                onExpand={() => {
                    setCurrentState(SidePanelValues.PLAN);
                }}
                onDone={() => {
                    setEditExeutorPlanPanel(false);
                }}
                collapse={collapsePanel}
                expanded
                editExeutorPlanPanel={editExeutorPlanPanel}
                className="w-full h-full min-h-0 px-4 py-2"
            />
        </div>
    );
}

const DUMMY_PLAN = {
    contract_name: 'base_app_launch',
    contract_title: 'Base App Launch Plan',
    short_description:
        'Step-by-step execution plan to generate, deploy, and launch a Base-native application.',
    long_description:
        'This plan covers creating the frontend, authoring Solidity contracts, deploying on Base Sepolia, and preparing production rollout on Base Mainnet.',
    contract_instructions: [
        {
            title: 'Scaffold App',
            short_description: 'Generate Base-ready monorepo scaffold.',
            long_description:
                'Create apps/web and contracts workspace structure with OnchainKit-ready frontend and Foundry-based Solidity contract project.',
        },
        {
            title: 'Build Contract',
            short_description: 'Implement Solidity contract logic.',
            long_description:
                'Define state, access control, and callable functions in Solidity, then validate behavior with generated Foundry tests.',
        },
        {
            title: 'Deploy Sepolia',
            short_description: 'Deploy to Base Sepolia.',
            long_description:
                'Run deployment scripts through queue-backed workflows and capture contract address, tx hash, and explorer links.',
        },
        {
            title: 'Ship Frontend',
            short_description: 'Wire UI with deployed contracts.',
            long_description:
                'Connect generated frontend components to deployed contract methods and finalize production configuration.',
        },
    ],
};
