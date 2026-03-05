/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';

import React from 'react';
import ArchitectureTitleComponent from './ArchitectureTitleComponent';
import FeatureOne from './FeatureOne';
import DonutComponent from '../ui/DonutComponent';

const productMetaOptions = [
    {
        title: 'CodeGenie',
        subtitle: 'Magic contract creation',
        description:
            'CodeGenie lets you generate full Base-native applications from plain English. It creates frontend scaffolds, Solidity contracts, and deployment workflows with production-oriented defaults.',
    },
    {
        title: 'EditWizard',
        subtitle: 'Instant tweaks',
        description:
            'EditWizard helps you modify existing code through chat or direct edits while preserving architecture consistency, typing discipline, and security checks across app and contract layers.',
    },
    {
        title: 'DeployBot',
        subtitle: 'One-click launch',
        description:
            'DeployBot streamlines Base deployment. It compiles, deploys to Base Sepolia by default, and returns deployment metadata for immediate frontend integration.',
    },
];

export default function WhoWeAre() {
    const containerRef = React.useRef<HTMLDivElement>(null);

    return (
        <>
            <ArchitectureTitleComponent firstText="BlackIn's" secondText="ARCHITECTURE" />
            <section ref={containerRef} className="bg-[#0a0c0d] w-screen">
                <div className="grid md:grid-cols-2 gap-0">
                    <div className="h-screen hidden md:sticky top-0 md:flex items-center justify-center bg-[#0a0c0d]">
                        <DonutComponent />
                    </div>

                    <div className="min-h-[300vh] flex flex-col justify-between z-10 bg-[#0a0c0d]">
                        {productMetaOptions.map((option, index) => (
                            <FeatureOne
                                key={index}
                                title={option.title}
                                subTitle={option.subtitle}
                                description={option.description}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
