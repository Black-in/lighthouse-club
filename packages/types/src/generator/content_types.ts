/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { FileNode } from "../file_types/file_types";

export enum STAGE {
  START = "START", // this is just to mention that the work has started
  CONTEXT = "CONTEXT", // this is just for having context, not an actual stage
  PLANNING = "PLANNING",
  GENERATING_CODE = "GENERATING_CODE",
  BUILDING = "BUILDING",
  CREATING_FILES = "CREATING_FILES",
  FINALIZING = "FINALIZING",
  END = "END", // this is just to mention that the work has beed completed
  ERROR = "ERROR",
}

export interface ContextEventData {
  content: string; // actual context text
  action: string;
}

export interface FileStructureEventData {
  root: FileNode;
  files: Record<string, string>;
}

export interface StatusEventData {
  stage: STAGE;
  message: string;
  progress?: number; // 0-100
}

export interface CompleteEventData {
  fullResponse: string;
  totalCodeBlocks: number;
}
