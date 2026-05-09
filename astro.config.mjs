import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    react(),
  ],
});
