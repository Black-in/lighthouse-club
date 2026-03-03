/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

export interface AppUserType {
    id?: string | null;
    privyId?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    provider?: string | null;
    token?: string | null;
    hasGithub?: boolean;
    githubUsername?: string | null;
}

export interface AppSession {
    user: AppUserType;
    expires: string;
}
