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
winter build                to build the contract
winter test                 to run the test file


PREMIUM(+) SHELL COMMANDS:
winter deploy --devnet      to deploy the contract on devnet
winter deploy --mainnet     to deploy the contract on mainnet
`;

// instead of using winter deploy cmds like this use them like this
// winter deploy --network devnet
// winter deploy --network mainnet
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
    lighthouse_DEPLOY_DEVNET = 'winter deploy --devnet',
    lighthouse_DEPLOY_MAINNET = 'winter deploy --mainnet',
}

export const CommandResponse: Record<COMMAND_WRITER, string> = {
    [COMMAND_WRITER.CLEAR]: '',
    [COMMAND_WRITER.HELP]: helpResponse,
    [COMMAND_WRITER.HOT_KEYS]: hotKeysResponse,
    [COMMAND_WRITER.PLATFORM]: platformResponse,
    [COMMAND_WRITER.COMMANDS]: commandsResponse,
    [COMMAND_WRITER.lighthouse_BUILD]: `queued: running build in your workspace...`,
    [COMMAND_WRITER.lighthouse_TEST]: `queued: running tests in your workspace...`,
    [COMMAND_WRITER.lighthouse_DEPLOY_DEVNET]: `queued: deploying to devnet...`,
    [COMMAND_WRITER.lighthouse_DEPLOY_MAINNET]: `queued: deploying to mainnet...`,
};
