/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import type { NextConfig } from 'next';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envLocalPath = path.resolve(__dirname, '../../.env.local');
const envPath = fs.existsSync(envLocalPath)
    ? envLocalPath
    : path.resolve(__dirname, '../../.env');

dotenv.config({ path: envPath });

const nextConfig: NextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'd3k5vke5jsl4rb.cloudfront.net',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
