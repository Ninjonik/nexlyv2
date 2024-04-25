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

export default nextConfig;
