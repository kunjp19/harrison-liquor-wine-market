import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  trailingSlash: "never",
  build: {
    format: "file"
  },
  site: "https://harrison-liquor-wine-market.vercel.app"
});
