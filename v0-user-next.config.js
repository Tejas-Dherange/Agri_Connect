/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["openweathermap.org", "res.cloudinary.com"],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig

