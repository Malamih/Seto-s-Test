import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          background: "#0f206c",
          accent: "#9e28b5"
        }
      }
    }
  },
  plugins: []
};

export default config;
