// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */
//   reactCompiler: true,
// };
//
// export default nextConfig;

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                path: false,
            };
        }
        return config;
    },

    transpilePackages: [
        "@cornerstonejs/core",
        "@cornerstonejs/tools",
        "@cornerstonejs/dicom-image-loader",
        "@cornerstonejs/codec-openjph",
    ],
};

// module.exports = nextConfig;

export default nextConfig;