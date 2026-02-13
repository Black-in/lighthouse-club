/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { JSX, useState } from 'react';
import PlanExecutorPanel from './PlanExecutorPanel';
import { useExecutorStore } from '@/src/store/model/useExecutorStore';
import { useSidePanelStore } from '@/src/store/code/useSidePanelStore';
import { SidePanelValues } from './EditorSidePanel';
import { useEditPlanStore } from '@/src/store/code/useEditPlanStore';
import AppLogo from '../tickers/AppLogo';

export default function PlanPanel(): JSX.Element {
    const [collapsePanel, setCollapsePanel] = useState<boolean>(false);
    const { editExeutorPlanPanel, setEditExeutorPlanPanel } = useExecutorStore();
    const { setCurrentState } = useSidePanelStore();
    const { message } = useEditPlanStore();
    // if (!message)
    //     return (
    //         <div className="w-full h-full flex items-center justify-center text-light/50 bg-[#151617]">
    //             No Plan Selected
    //         </div>
    //     );
    return (
        <div className="w-full flex justify-center bg-[#16171a]">
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
                className="w-full px-4 py-2"
            />
        </div>
    );
}

const DUMMY_PLAN = {
    contract_name: 'solana_token_launch',
    contract_title: 'Solana Token Launch Plan',
    short_description:
        'Step-by-step execution plan to deploy, verify, and launch a Solana SPL token.',
    long_description:
        'This plan walks through the complete lifecycle of launching a Solana SPL token, from mint creation to locking supply and preparing for public distribution.',
    contract_instructions: [
        {
            title: 'Create SPL Token',
            short_description: 'Initialize a new SPL token on Solana.',
            long_description:
                'Use the Solana CLI and SPL Token program to create a new token mint. Configure decimals, authorities, and verify successful creation on-chain.',
        },
        {
            title: 'Create Associated Token Account',
            short_description: 'Create ATA for the wallet.',
            long_description:
                'Generate an associated token account (ATA) for the deployer wallet so tokens can be minted and transferred securely.',
        },
        {
            title: 'Mint Initial Supply',
            short_description: 'Mint initial token supply.',
            long_description:
                'Mint the desired initial supply of tokens into the associated token account. Ensure mint authority is correctly configured.',
        },
        {
            title: 'Revoke Mint Authority',
            short_description: 'Lock the token supply.',
            long_description:
                'Revoke the mint authority to prevent further minting and ensure fixed supply for trust and transparency.',
        },
    ],
};
