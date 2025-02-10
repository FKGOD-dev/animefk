/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.myanimelist.net'], // ✅ Agrega este dominio
  },
};

module.exports = nextConfig;
