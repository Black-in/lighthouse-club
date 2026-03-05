/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

const helpResponse = `
WINTER COMMANDS:
clear              Clear the terminal
--help             Show available commands
--commands         Show BlackIn commands
--platform         Show platform details
--hotkeys          Show hot keys/ shortcuts
`;

const hotKeysResponse = `
HOT KEYS:
Ctrl + Shift + ~           Switch Terminal Tabs
Ctrl + Shift + d           Toggle shell
`;

const platformResponse = `
PLATFORM DETAILS:
portal              BlackIn
version             1.0.0
shell               winter
`;

const commandsResponse = `
SHELL COMMANDS:
winter build                         build the workspace
winter test                          run tests


PREMIUM(+) SHELL COMMANDS:
winter deploy --base-sepolia         deploy contracts to Base Sepolia
winter deploy --base-mainnet         deploy contracts to Base Mainnet
`;

// instead of using winter deploy cmds like this use them like this
// winter deploy --network base-sepolia
// winter deploy --network base-mainnet
// winter deploy --network <custom-network>

// const lighthouseBuildResponse = ``;

export enum COMMAND_WRITER {
    CLEAR = 'clear',
    HELP = '--help',
    HOT_KEYS = '--hotkeys',
    PLATFORM = '--platform',
    COMMANDS = '--commands',
    lighthouse_BUILD = 'winter build',
    lighthouse_TEST = 'winter test',
    // DISABLED - Solana chain (see /chains/solana).
    lighthouse_DEPLOY_DEVNET = 'winter deploy --devnet',
    // DISABLED - Solana chain (see /chains/solana).
    lighthouse_DEPLOY_MAINNET = 'winter deploy --mainnet',
    lighthouse_DEPLOY_BASE_SEPOLIA = 'winter deploy --base-sepolia',
    lighthouse_DEPLOY_BASE_MAINNET = 'winter deploy --base-mainnet',
}

export const CommandResponse: Record<COMMAND_WRITER, string> = {
    [COMMAND_WRITER.CLEAR]: '',
    [COMMAND_WRITER.HELP]: helpResponse,
    [COMMAND_WRITER.HOT_KEYS]: hotKeysResponse,
    [COMMAND_WRITER.PLATFORM]: platformResponse,
    [COMMAND_WRITER.COMMANDS]: commandsResponse,
    [COMMAND_WRITER.lighthouse_BUILD]: `queued: running build in your workspace...`,
    [COMMAND_WRITER.lighthouse_TEST]: `queued: running tests in your workspace...`,
    [COMMAND_WRITER.lighthouse_DEPLOY_DEVNET]:
        `solana deploy commands are disabled for this release.`,
    [COMMAND_WRITER.lighthouse_DEPLOY_MAINNET]:
        `solana deploy commands are disabled for this release.`,
    [COMMAND_WRITER.lighthouse_DEPLOY_BASE_SEPOLIA]:
        `queued: deploying to Base Sepolia...`,
    [COMMAND_WRITER.lighthouse_DEPLOY_BASE_MAINNET]:
        `queued: deploying to Base Mainnet...`,
};
