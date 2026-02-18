/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import axios from 'axios';
import { CHECK_REPO_NAME, DOWNLOAD_ZIP_FILE, EXPORT_CONTRACT_URL } from '@/routes/api_routes';

export default class GithubServer {
    public static validateRepoNameFormat(name: string): boolean {
        return /^[a-zA-Z0-9_.-]+$/.test(name);
    }

    public static async checkRepoName(
        repoName: string,
        contractId: string,
        token: string,
    ): Promise<{ success: boolean; message?: string }> {
        const response = await axios.post(
            CHECK_REPO_NAME,
            {
                repo_name: repoName,
                contract_id: contractId,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return response.data;
    }

    public static async pushCodeToGithub(
        repoName: string,
        contractId: string,
        token: string,
    ): Promise<{ success: boolean; message?: string }> {
        const response = await axios.post(
            EXPORT_CONTRACT_URL,
            {
                repo_name: repoName,
                contract_id: contractId,
                hasGithub: token,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        return response.data;
    }

    public static async downloadZipFile(
        contractId: string,
        token: string,
    ): Promise<{ arrayBuffer: ArrayBuffer; contract_name: string }> {
        const response = await axios.post(
            DOWNLOAD_ZIP_FILE,
            {
                contractId,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'arraybuffer',
            },
        );

        const contract_name = response.headers['contract-name'];

        return { arrayBuffer: response.data, contract_name };
    }
}
