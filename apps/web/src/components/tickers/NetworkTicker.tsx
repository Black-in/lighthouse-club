/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

enum Network {
    BASE_SEPOLIA = 'BASE_SEPOLIA',
    BASE_MAINNET = 'BASE_MAINNET',
}

interface NetworkTickerProps {
    network?: Network;
}

export default function NetworkTicker({ network = Network.BASE_SEPOLIA }: NetworkTickerProps) {
    const getTicker = () => {
        switch (network) {
            case Network.BASE_SEPOLIA:
                return {
                    label: 'Base Sepolia',
                    className: 'bg-[#052659]/60 border border-[#5483B3]',
                };
            case Network.BASE_MAINNET:
                return {
                    label: 'Base Mainnet',
                    className: 'bg-green-500/40 border border-green-500',
                };
            default:
                return { label: 'Unknown', className: 'bg-gray-500' };
        }
    };

    const { label, className } = getTicker();

    return (
        <div className="overflow-hidden w-fit relative">
            <div
                className={`whitespace-nowrap px-3 py-1 rounded-[4px] text-sm font-medium text-white ${className} animate-ticker tracking-wider`}
            >
                {label}
            </div>
        </div>
    );
}
