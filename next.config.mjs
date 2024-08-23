/** @type {import('next').NextConfig} */
const config = {
    basePath: "/dashboard",
    output: "export",
    productionBrowserSourceMaps: true,
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    
};

export default config;
