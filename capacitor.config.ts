import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.ecommerce.app",
  appName: "e-commerce",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
