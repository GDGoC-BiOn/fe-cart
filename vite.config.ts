import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { federation } from "@module-federation/vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

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
      // DEMO Act 3 — uncomment to expose the cart as a remote (./mount).
      // Until then cart runs solo at :3002 via src/standalone.ts (no remoteEntry.js).
      // federation({
      //   name: "cart",
      //   filename: "remoteEntry.js",
      //   exposes: {
      //     "./mount": "./src/mount.ts",
      //   },
      //   // Only vue is shared. lit + @bion-mfe-ui are bundled here, not shared —
      //   // see the shell config for why (collapses the MF request waterfall;
      //   // double-define is guarded by @bion-mfe-ui/core@^0.1.2).
      //   shared: { vue: { singleton: true } },
      // }),
      // AFTER federation: inline tokens.css + app CSS into the JS chunks so the
      // host can load this remote's styles cross-origin.
      cssInjectedByJsPlugin(),
    ],
    build: { target: "chrome89" },
  };
});
