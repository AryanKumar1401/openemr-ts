/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/openemr/:path*',
                destination: 'http://localhost:8300/apis/:path*',
            },
        ];
    },
};

module.exports = nextConfig; 