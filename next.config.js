/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  externals: [ 'aws-sdk', 'commonjs2 firebase-admin' ],
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
