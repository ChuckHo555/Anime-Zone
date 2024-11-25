import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes:{
        slideRight:{
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(10px)" },
        },
      },
      animation: {
        "slide-right": "slideRight 5s linear infinite",
        "slide-right-image": "slideRight 5s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
