import "@ams/env/web";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	transpilePackages: [
		"@ams/ams",
		"@ams/api",
		"@ams/auth",
		"@ams/db",
		"@ams/env",
		"@ams/ui",
	],
};

export default nextConfig;
