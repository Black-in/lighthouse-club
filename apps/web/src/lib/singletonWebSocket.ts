/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import WebSocketClient from '../class/socket.client';
let client: WebSocketClient | null = null;
let currentSocketKey: string | null = null;

function trimTrailingSlash(value: string) {
    return value.replace(/\/+$/, '');
}

function resolveSocketBaseUrl() {
    const explicitSocketUrl = process.env.NEXT_PUBLIC_SOCKET_URL?.trim();
    if (explicitSocketUrl) return trimTrailingSlash(explicitSocketUrl);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
    if (backendUrl) {
        try {
            const parsed = new URL(backendUrl);
            const protocol = parsed.protocol === 'https:' ? 'wss:' : 'ws:';
            return trimTrailingSlash(`${protocol}//${parsed.host}`);
        } catch {
            // ignore and fallback to runtime host detection
        }
    }

    if (typeof window !== 'undefined') {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname;
        const isLocalHost = host === 'localhost' || host === '127.0.0.1';
        if (isLocalHost) {
            return `${protocol}//${host}:8282`;
        }
        return `${protocol}//${window.location.host}`;
    }

    return 'ws://localhost:8282';
}

export function getWebSocketClient(token: string, contractId: string) {
    if (!token || !contractId) {
        return null;
    }

    const base = resolveSocketBaseUrl();
    const url = `${base}?contractId=${encodeURIComponent(contractId)}&token=${encodeURIComponent(token)}`;
    const socketKey = `${token}:${contractId}:${base}`;

    if (client && currentSocketKey === socketKey) {
        return client;
    }

    if (client) {
        client.close();
        client = null;
    }

    client = new WebSocketClient(url, token);
    currentSocketKey = socketKey;
    return client;
}

export function cleanWebSocketClient() {
    if (client) {
        client.close();
        client = null;
    }
    currentSocketKey = null;
}
