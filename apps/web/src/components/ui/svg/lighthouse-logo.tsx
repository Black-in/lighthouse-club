import LighthouseMark from './LighthouseMark';

type LighthouseLogoProps = {
    size?: number;
};

export default function LighthouseLogo({ size = 200 }: LighthouseLogoProps) {
    return <LighthouseMark size={size} className="text-current" aria-hidden="true" />;
}
