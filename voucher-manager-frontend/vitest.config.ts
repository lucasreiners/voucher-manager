import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import { fileURLToPath } from "node:url";

export default defineConfig({
	plugins: [vue(), vuetify()],
	test: {
		globals: true,
		environment: "happy-dom",
		setupFiles: ["./src/test/setup.ts"],
		deps: {
			// Handle CSS imports by transforming them to empty objects
			inline: [/\.css$/, /vuetify/],
		},
		css: {
			// Disable CSS processing altogether
			modules: {
				classNameStrategy: "stable",
			},
		},
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
		},
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
		include: ["**/*.{test,spec}.{js,ts,jsx,tsx}"],
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
});
