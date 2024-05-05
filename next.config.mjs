import { default as withPWA } from "@ducanh2912/next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'appwrite.igportals.eu',
                port: '',
                pathname: '**/**/**/**',
            },
        ],
    }
};

const pwaConfig = {
    dest: 'public',
    cacheOnFrontEndNav : true,
    aggresiveFrontEndNavCaching : true,
    reloadOnOnline : true,
    swcMinify : true,
    disable : false,
    workboxOptions: {
        disableDevLogs: true,
    }
};

export default withPWA(nextConfig)(pwaConfig);
