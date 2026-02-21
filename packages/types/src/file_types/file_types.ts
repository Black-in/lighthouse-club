/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

export enum NODE {
  FILE = "FILE",
  FOLDER = "FOLDER",
}

export interface FileNode {
  id: string;
  name: string;
  type: NODE;
  content?: string;
  language?: string;
  children?: FileNode[];
}

export interface FileContent {
  path: string;
  content: string;
}
