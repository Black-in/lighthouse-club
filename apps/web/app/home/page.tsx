/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import ContractTemplates from '@/src/components/home/ContractTemplates';
import MostRecentBuilds from '@/src/components/home/MostRecentBuilds';
import UserContracts from '@/src/components/home/UserContracts';
import HomeNavbar from '@/src/components/nav/HomeNavbar';
import Marketplace from '@/src/lib/server/marketplace-server';
import { useAllContractStore } from '@/src/store/user/useAllContractStore';
import { useTemplateStore } from '@/src/store/user/useTemplateStore';
import { useContractStore } from '@/src/store/user/useUserContractStore';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useEffect } from 'react';

export default function Home() {
    const { session } = useUserSessionStore();
    const { setUserContracts } = useContractStore();
    const { setAllContracts } = useAllContractStore();
    const { setTemplates } = useTemplateStore();

    useEffect(() => {
        async function fetchData() {
            if (!session?.user?.token) return;
            const user_contracts = await Marketplace.getUserContracts(session.user.token);
            setUserContracts(user_contracts);

            const all_contracts = await Marketplace.getAllContracts(session.user.token);
            setAllContracts(all_contracts);

            const all_templates = await Marketplace.getTemplates();
            setTemplates(all_templates);
        }

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, setUserContracts, setAllContracts]);

    return (
        <div className="bg-neutral-950 w-screen h-screen flex flex-col items-center relative">
            <HomeNavbar />

            <div className="flex-1 grid grid-rows-[26%_35%_1%_35%] w-full max-w-[70%] mt-10 gap-y-2 z-10 overflow-hidden">
                <UserContracts />
                <ContractTemplates />
                <div className="border-t-[1px] border-neutral-700/60" />
                <MostRecentBuilds />
            </div>
        </div>
    );
}
