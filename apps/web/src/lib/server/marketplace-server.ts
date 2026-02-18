/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import {
    DELETE_CONTRACT,
    GET_ALL_CONTRACTS,
    GET_ALL_TEMPLATES,
    GET_USER_CONTRACTS,
} from '@/routes/api_routes';
import { Contract, Template } from '@lighthouse/types';
import axios from 'axios';

export default class Marketplace {
    public static async getUserContracts(token: string): Promise<Contract[]> {
        try {
            const { data } = await axios.get(GET_USER_CONTRACTS, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return data.data;
        } catch (error) {
            console.error('Failed to fetch user contracts', error);
            return [];
        }
    }

    public static async getAllContracts(token: string): Promise<Contract[]> {
        try {
            const { data } = await axios.get(GET_ALL_CONTRACTS, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return data.data;
        } catch (error) {
            console.error('Failed to fetch all contracts', error);
            return [];
        }
    }

    public static async getTemplates(): Promise<Template[]> {
        try {
            const { data } = await axios.get(GET_ALL_TEMPLATES);

            return data.data;
        } catch (error) {
            console.error('Failed to fetch templates', error);
            return [];
        }
    }

    public static async deleteContract(
        token: string,
        contractId: string,
    ): Promise<{
        success: boolean;
        contractId: string;
    }> {
        try {
            const { data } = await axios.delete(`${DELETE_CONTRACT}/${contractId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return {
                success: data.success,
                contractId: data.contractId,
            };
        } catch (error) {
            console.error('Failed to delete contract', error);
            return {
                success: false,
                contractId,
            };
        }
    }
}
