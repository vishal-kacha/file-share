/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  experimental : {
    webpackBuildWorker: true
  }
}

module.exports = withPWA(nextConfig)
