/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

export default function timeParser(timestamp: number | Date | string): string {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (days >= 1) {
        return `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours >= 1) {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
        return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
}
