/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  webpack: (config: any) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'three': require.resolve('three'),
    };
    return config;
  },
};

export default nextConfig;
