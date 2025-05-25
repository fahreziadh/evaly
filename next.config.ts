import type { NextConfig } from 'next'

import withBundleAnalyzer from '@next/bundle-analyzer'
import createNextIntlPlugin from 'next-intl/plugin'

const baseConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    reactCompiler: true,
    optimizeCss: false,
    optimisticClientCache: false,
    optimizeServerReact: false,
    optimizePackageImports: [],
    serverMinification: false
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'd3hopitjstq08.cloudfront.net'
      },
      {
        protocol: 'https',
        hostname: 'assets.evaly.io'
      }
    ]
  }
}

const intlConfig = createNextIntlPlugin()(baseConfig)

const withAnalyzers = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

const nextConfig = withAnalyzers(intlConfig)

export default nextConfig
