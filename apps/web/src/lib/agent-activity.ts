import { FILE_STRUCTURE_TYPES, PHASE_TYPES, STAGE } from '@/src/types/stream_event_types';

interface AgentActivityState {
    label: string;
    statusLabel: string;
    detail: string;
}

export function resolveAgentActivity(
    phase?: string | null,
    stage?: string | null,
    currentFileEditing?: string | null,
): AgentActivityState {
    if (stage === STAGE.END || phase === PHASE_TYPES.COMPLETE) {
        return {
            label: 'Finished.',
            statusLabel: 'Complete',
            detail: 'The agent wrapped up the response and workspace changes.',
        };
    }

    if (phase === PHASE_TYPES.THINKING || phase === PHASE_TYPES.STARTING || stage === STAGE.START) {
        return {
            label: 'Thinking...',
            statusLabel: 'Thinking',
            detail: 'Reviewing your request and loading the working context.',
        };
    }

    if (stage === STAGE.PLANNING || stage === STAGE.CONTEXT) {
        return {
            label: 'Understanding request...',
            statusLabel: 'Understanding',
            detail: 'Mapping the problem before changing files.',
        };
    }

    if (
        phase === PHASE_TYPES.GENERATING ||
        stage === STAGE.GENERATING_CODE ||
        phase === FILE_STRUCTURE_TYPES.EDITING_FILE
    ) {
        return {
            label: 'Processing...',
            statusLabel: 'Writing',
            detail: currentFileEditing
                ? `Writing ${currentFileEditing}`
                : 'Generating code and preparing file updates.',
        };
    }

    if (phase === PHASE_TYPES.BUILDING || stage === STAGE.BUILDING) {
        return {
            label: 'Reviewing changes...',
            statusLabel: 'Reviewing',
            detail: 'Checking the generated code before the final response.',
        };
    }

    if (phase === PHASE_TYPES.CREATING_FILES || stage === STAGE.CREATING_FILES) {
        return {
            label: 'Structuring files...',
            statusLabel: 'Structuring',
            detail: currentFileEditing
                ? `Updating ${currentFileEditing}`
                : 'Organizing the workspace and file layout.',
        };
    }

    if (stage === STAGE.FINALIZING) {
        return {
            label: 'Finalizing response...',
            statusLabel: 'Finalizing',
            detail: 'Packaging the final answer and workspace state.',
        };
    }

    return {
        label: 'Processing...',
        statusLabel: 'Processing',
        detail: currentFileEditing
            ? `Working in ${currentFileEditing}`
            : 'The agent is preparing the next step.',
    };
}

export function formatThoughtSummary(elapsedSeconds: number) {
    if (elapsedSeconds <= 1) return 'Thought for a second';
    if (elapsedSeconds < 10) return 'Thought for a couple of seconds';
    if (elapsedSeconds < 60) return `Thought for ${elapsedSeconds} seconds`;

    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    if (seconds === 0) {
        return `Thought for ${minutes} minute${minutes === 1 ? '' : 's'}`;
    }

    return `Thought for ${minutes}m ${String(seconds).padStart(2, '0')}s`;
}
