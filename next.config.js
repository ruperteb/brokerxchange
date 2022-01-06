/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'api.mapbox.com'],
  },
  externals: [ 'aws-sdk', 'commonjs2 firebase-admin', "fast-crc32c", "retry-request" ],
  webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback.fs = false;
			config.resolve.fallback.child_process = false;
			config.resolve.fallback.request = false;
			config.resolve.fallback.net = false;
			config.resolve.fallback.worker_threads = false;
			config.resolve.fallback.tls = false;
		}
		return config;
	}
}
