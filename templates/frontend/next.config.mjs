/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    resolveAlias: {
      // MetaMask SDK tries to import a React Native module that doesn't exist in web builds
      "@react-native-async-storage/async-storage": { browser: "" },
      // Tezos libraries reference fs
      fs: { browser: "" },
    },
  },
};

export default nextConfig;
