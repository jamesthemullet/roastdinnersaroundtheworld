import { defineConfig } from "astro/config";
import partytown from "@astrojs/partytown";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  experimental: {
    assets: true
  },
  integrations: [partytown({
    config: {
      forward: ["dataLayer.push"]
    }
  }), react()]
});