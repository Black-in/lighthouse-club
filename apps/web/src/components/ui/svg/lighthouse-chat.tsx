import LighthouseMark from './LighthouseMark';

type LighthouseChatProps = {
    size?: number;
};

export default function LighthouseChat({ size = 95 }: LighthouseChatProps) {
    const height = (size * 87) / 95;

    return (
        <div
            style={{
                width: size,
                height,
                position: 'relative',
                color: 'currentColor',
            }}
        >
            <svg
                width={size}
                height={height}
                viewBox="0 0 95 87"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M11.875 47.125V53.65C11.875 57.7104 11.875 59.7407 12.7379 61.2915C13.4968 62.6556 14.7079 63.7648 16.1976 64.4597C17.891 65.25 20.1079 65.25 24.5417 65.25H64.3015C65.4166 65.25 65.9743 65.25 66.5206 65.32C67.0055 65.3823 67.4832 65.4856 67.9472 65.6285C68.4701 65.7894 68.9688 66.0178 69.9663 66.4745L83.125 72.5V26.1C83.125 22.0396 83.125 20.0094 82.2621 18.4586C81.5033 17.0944 80.292 15.9853 78.8025 15.2902C77.1091 14.5 74.8921 14.5 70.4583 14.5H51.4583"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            <LighthouseMark
                size={size * 0.38}
                className="absolute"
                style={{
                    top: '39%',
                    left: '33%',
                    transform: 'translate(-50%, -50%)',
                }}
                aria-hidden="true"
            />
        </div>
    );
}
