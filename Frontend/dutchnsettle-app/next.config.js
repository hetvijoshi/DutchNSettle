/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    },
    images: {
        remotePatterns: [
            { hostname: "lh3.googleusercontent.com" }
        ]
    }
}

module.exports = nextConfig
