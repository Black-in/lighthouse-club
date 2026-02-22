/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

'use client';
import GithubServer from '@/src/lib/server/github-server';
import { useChatStore } from '@/src/store/user/useChatStore';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useState } from 'react';
import { AiFillFileZip } from 'react-icons/ai';
import { toast } from 'sonner';

export default function DownloadZipFileComponent() {
    const { contractId } = useChatStore();
    const { session } = useUserSessionStore();
    const [downloading, setDownloading] = useState<boolean>(false);

    async function downloadZipFile() {
        if (downloading) return;
        const toastId = toast.loading('Preparing download...');
        try {
            if (!session || !session.user.token) {
                toast.error('Not authenticated', { id: toastId });
                return;
            }
            setDownloading(true);

            const current_cid = contractId ?? window.location.pathname.split('/playground/')[1];
            if (!current_cid) {
                toast.error('No contract ID found', { id: toastId });
                return;
            }

            const response = await GithubServer.downloadZipFile(current_cid, session.user.token);
            const { arrayBuffer, contract_name } = response;

            if (!arrayBuffer || arrayBuffer.byteLength === 0) {
                throw new Error('Empty zip file received');
            }

            const blob = new Blob([arrayBuffer], { type: 'application/zip' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `blackin-${contract_name}.zip`;
            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);
            toast.dismiss(toastId);
            toast.success('Download complete');
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download zip file');
        } finally {
            setDownloading(false);
        }
    }

    return (
        <div className="px-4 py-2 text-[12.5px] text-light/70">
            <div
                onClick={downloadZipFile}
                className={`flex justify-between items-center w-full bg-dark/50 hover:bg-dark border border-neutral-800 p-1.5 px-2 rounded-[4px] tracking-wide ${
                    downloading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
            >
                {downloading ? 'Downloading...' : 'Download ZIP'}
                <AiFillFileZip className="size-4" />
            </div>
        </div>
    );
}
