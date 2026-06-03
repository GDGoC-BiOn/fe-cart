import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { federation } from "@module-federation/vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// lit + the bion web components must be shared singletons across every MFE,
// otherwise a second `customElements.define('bion-…')` throws. Trailing-slash
// keys dedupe subpath imports (lit/decorators.js, @bion-mfe-ui/core/cart-drawer).
const bion = {
  lit: { singleton: true },
  "lit/": { singleton: true },
  "@bion-mfe-ui/core": { singleton: true },
  "@bion-mfe-ui/core/": { singleton: true },
  "@bion-mfe-ui/icons": { singleton: true },
  "@bion-mfe-ui/tokens": { singleton: true },
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const port = Number(env.VITE_PORT) || 3002;
  const publicUrl = env.VITE_PUBLIC_URL || `http://localhost:${port}`;

  return {
    base: publicUrl,
    server: { port, strictPort: true, origin: publicUrl, cors: true },
    preview: { port, strictPort: true, cors: true },
    plugins: [
      vue(),
      federation({
        name: "cart",
        filename: "remoteEntry.js",
        exposes: {
          "./mount": "./src/mount.ts",
        },
        shared: { vue: { singleton: true }, ...bion },
      }),
      // AFTER federation: inline tokens.css + app CSS into the JS chunks so the
      // host can load this remote's styles cross-origin.
      cssInjectedByJsPlugin(),
    ],
    optimizeDeps: {
      exclude: [
        "@bion-mfe-ui/vue",
        "@bion-mfe-ui/core",
        "@bion-mfe-ui/icons",
        "@bion-mfe-ui/tokens",
        "lit",
      ],
    },
    build: { target: "chrome89" },
  };
});
