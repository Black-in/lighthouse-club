/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

export const anchorContractTemplates = [
    {
        id: 'ckv9q1g0x0001ab12cdef3456',
        title: 'Todo Contract',
        image: '/icons/blackin-mark-dark.svg',
        description: 'Create, update, and delete todo items.',
        contractType: 'PROGRAM',
        tags: ['utility', 'example', 'todo'],
        clientSdk: {
            functions: ['addTodo', 'updateTodo', 'deleteTodo', 'getTodos'],
        },
    },
    {
        id: 'ckv9q1g0x0002ab12cdef3456',
        title: 'Counter Contract',
        image: '/icons/blackin-mark-dark.svg',
        description: 'Increment, decrement, and read counter functionalities.',
        contractType: 'PROGRAM',
        tags: ['example', 'counter', 'basic'],
        clientSdk: {
            functions: ['increment', 'decrement', 'getCount'],
        },
    },
    {
        id: 'ckv9q1g0x0004ab12cdef3456',
        title: 'Staking Rewards Contract',
        image: '/icons/blackin-mark-dark.svg',
        description: 'Stake tokens and earn periodic rewards based on APY.',
        contractType: 'PROGRAM',
        tags: ['staking', 'rewards', 'defi'],
        clientSdk: { functions: ['stake', 'unstake', 'claimRewards', 'getUserInfo'] },
    },
    {
        id: 'ckv9q1g0x0005ab12cdef3456',
        title: 'Liquidity Pool',
        image: '/icons/blackin-mark-dark.svg',
        description: 'Provides token swaps and liquidity incentives for users.',
        contractType: 'PROGRAM',
        tags: ['amm', 'liquidity', 'defi'],
        clientSdk: { functions: ['addLiquidity', 'removeLiquidity', 'swapTokens', 'getPoolInfo'] },
    },
    {
        id: 'ckv9q1g0x0006ab12cdef3456',
        title: 'Token Airdrop Distributor',
        image: '/icons/blackin-mark-dark.svg',
        description: 'Contract for distributing tokens to multiple users securely.',
        contractType: 'PROGRAM',
        tags: ['airdrop', 'distribution', 'utility'],
        clientSdk: { functions: ['createAirdrop', 'claimTokens', 'checkEligibility'] },
    },
    {
        id: 'ckv9q1g0x0007ab12cdef3456',
        title: 'Escrow Payment Contract',
        image: '/icons/blackin-mark-dark.svg',
        description: 'Holds funds until conditions are met between buyer and seller.',
        contractType: 'PROGRAM',
        tags: ['escrow', 'payments', 'security'],
        clientSdk: {
            functions: ['createEscrow', 'releasePayment', 'cancelEscrow', 'getEscrowStatus'],
        },
    },
    {
        id: 'ckv9q1g0x0008ab12cdef3456',
        title: 'Oracle Price Feed',
        image: '/icons/blackin-mark-dark.svg',
        description: 'Fetches and stores off-chain price data from trusted oracle networks.',
        contractType: 'PROGRAM',
        tags: ['oracle', 'price-feed', 'data'],
        clientSdk: { functions: ['updatePrice', 'getLatestPrice', 'setOracleAuthority'] },
    },
    {
        id: 'ckv9q1g0x0009ab12cdef3456',
        title: 'Crowdfunding Contract',
        image: '/icons/blackin-mark-dark.svg',
        description: 'Users can create campaigns and receive contributions.',
        contractType: 'PROGRAM',
        tags: ['crowdfunding', 'fundraising', 'community'],
        clientSdk: {
            functions: ['createCampaign', 'contribute', 'withdrawFunds', 'getCampaignInfo'],
        },
    },
];
