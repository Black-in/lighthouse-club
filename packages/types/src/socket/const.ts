/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

export type WebSocketPayloadType = "RUN_COMMAND";

export enum TerminalSocketData {
  CONNECTED = "CONNECTED",
  INFO = "INFO",
  LOGS = "LOGS",
  EXECUTING_COMMAND = "EXECUTING_COMMAND",
  BUILD_ERROR = "BUILD_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  SERVER_MESSAGE = "SERVER_MESSAGE",
  ERROR_MESSAGE = "ERROR_MESSAGE",
  COMPLETED = "COMPLETED",
}

export interface WSServerIncomingPayload<T> {
  type: TerminalSocketData;
  payload: T;
}
