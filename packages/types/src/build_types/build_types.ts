/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { BuildStatus } from "../prisma/prisma.enums";
import { TerminalSocketData } from "../socket/const";

export interface BuildCacheCheck {
  isCached: boolean;
  codeHash: string | null;
  lastBuildStatus?: BuildStatus;
  lastBuildAt?: Date;
  buildJobId?: string;
  canReuseBuild: boolean;
}

export enum COMMAND {
  lighthouse_BUILD = "lighthouse_BUILD",
  lighthouse_TEST = "lighthouse_TEST",
  // DISABLED - Solana chain (see /chains/solana).
  lighthouse_DEPLOY_DEVNET = "lighthouse_DEPLOY_DEVNET",
  // DISABLED - Solana chain (see /chains/solana).
  lighthouse_DEPLOY_MAINNET = "lighthouse_DEPLOY_MAINNET",
  lighthouse_DEPLOY_BASE_SEPOLIA = "lighthouse_DEPLOY_BASE_SEPOLIA",
  lighthouse_DEPLOY_BASE_MAINNET = "lighthouse_DEPLOY_BASE_MAINNET",
  lighthouse_VERIFY = "lighthouse_VERIFY",
}

export interface BaseJobPayload {
  userId: string;
  contractId: string;
  contractName: string;
  timestamp: number;
  jobId: string;
  retryCount?: number;
}

export interface BuildJobPayload extends BaseJobPayload {
  command: COMMAND;
}

export interface BuildJobCompletionPayload extends BaseJobPayload {
  lines: string;
  type: TerminalSocketData;
}

export interface IncomingPayload {
  userId: string;
  contractId: string;
  line: string;
  timestamp: number;
}
