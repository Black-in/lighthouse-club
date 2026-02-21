/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { NODE } from "../file_types/file_types";
import { STAGE } from "../generator/content_types";
import {
  BuildStatus,
  ChatRole,
  Command,
  ContractType,
  PlanType,
  SubscriptionStatus,
} from "./prisma.enums";

export interface FlatFile {
  id: string;
  name: string;
  path: string;
  type: NODE;
}
export interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  password?: string | null;
  provider?: string | null;
  githubAccessToken?: string | null;
  createdAt: string;
  updatedAt: string;

  subscription?: Subscription | null;
  contracts?: Contract[];
  messages?: Message[];
}

export interface Contract {
  id: string;
  title: string;
  description?: string | null;
  contractType: ContractType;
  idl?: JSON;
  clientSdk?: JSON;
  summarisedObject?: string | null;
  deployed: boolean;
  programId?: string | null;
  version: number;
  userId: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
  deployments?: Deployment[];
  messages: Message[];
}

export interface Deployment {
  id: string;
  contractId: string;
  contract?: Contract;
  network: string;
  deployedAt: string;
  txSignature?: string | null;
  status: string;
}

export interface Message {
  id: string;
  contractId: string;
  contract?: Contract;
  role: ChatRole;
  content: string;
  stage: STAGE;
  plannerContext?: PlanMessage;
  isPlanExecuted: boolean;
  createdAt: Date;
  templateId?: string;
  template?: Template;
}

export interface PlanMessage {
  contract_name: string;
  contract_title: string;
  short_description: string;
  long_description: string;
  contract_instructions: {
    title: string;
    short_description: string;
    long_description: string;
  }[];
}

export interface Subscription {
  id: string;
  userId: string;
  user?: User;
  plan: PlanType;
  status: SubscriptionStatus;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  razorpaySignature?: string | null;
  start: string;
  end?: string | null;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  s3_prefix?: string;
  solanaVersion: string;
  anchorVersion: string;
  summarisedObject: string;
  imageUrl: string;

  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
export interface BuildJob {
  id: string;
  contractId: string;
  contract?: Contract;

  jobId: string;
  status: BuildStatus;
  podName?: string | null;
  command: Command;

  startedAt?: Date | null;
  completedAt?: Date | null;
  duration?: number | null;
  output?: JSON | null;
  error?: string | null;

  retryCount: number;
  maxRetry: number;

  createdAt: Date;
  updatedAt: Date;
}
export interface FileUpload {
  id: string;
  filename: string;
  size: number;
  s3Url: string;

  userId: string;
  user?: User;

  createdAt: Date;
}
export interface ContractGenerationReviews {
  id: string;

  contractId: string;
  contract?: Contract;

  userId: string;
  user?: User;

  rating: number;
  liked?: string | null;
  disliked?: string | null;

  createdAt: Date;
}
export interface PublicReview {
  id: string;

  userId: string;
  user?: User;

  rating: number;
  title?: string | null;
  content?: string | null;

  visible: boolean;
  createdAt: Date;
}
