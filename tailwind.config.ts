import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        /* ---------- Soléi Brand System ---------- */
        navy: {
          DEFAULT: "#0F2436",
          deep: "#091820",
          mid: "#1a3a52",
        },
        cream: {
          DEFAULT: "#F6F1E6",
          deep: "#EDE5D4",
        },
        sand: {
          DEFAULT: "#D9CBB4",
          light: "#EDE5D8",
        },
        white: {
          DEFAULT: "#FDFAF5",
        },
        coastal: {
          DEFAULT: "#2F6F8F",
        },
        gold: {
          DEFAULT: "#B89A5B",
          light: "#d4b87a",
        },
        ink: {
          DEFAULT: "#3a4f5f",
          soft: "#4a6070",
        },

        /* ---------- Legacy Soléi Tokens (kept for backward compatibility) ---------- */
        'solei-teal': '#14B8A6',
        'solei-coral': '#FF6B6B',
        'solei-gold': '#F59E0B',
        'solei-navy': '#1E3A8A',
        'datesand': '#F3E9D4',
        'palmgreen': '#3E533F',
        'saltlake': '#7FB5B9',
        'travel-teal': '#007E8F',
        'travel-sand': '#F5F0E8',
        'travel-navy': '#002E47',

        /* ---------- shadcn / theme tokens ---------- */
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      fontFamily: {
        /* Soléi brand families */
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Raleway', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        /* Legacy */
        heading: ['"Cormorant Garamond"', 'serif'],
        sans: ['Raleway', 'Poppins', 'sans-serif'],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
