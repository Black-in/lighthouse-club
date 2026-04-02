/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

const githubProfileUrl = 'https://github.com/ayushshrivastv';

export const metadata: Metadata = {
    title: 'BlackIn OpenAPI',
    description: 'Redirecting to the BlackIn GitHub profile.',
};

export default function OpenApiPage() {
    redirect(githubProfileUrl);
}
