import type { Config } from "tailwindcss";

function withOpacity(variableName: string) {
  return ({ opacityValue }: { opacityValue?: string }) => {
    if (opacityValue !== undefined) {
      return `color-mix(in oklch, var(${variableName}) calc(${opacityValue} * 100%), transparent)`;
    }
    return `var(${variableName})`;
  };
}

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        headline: ['Playfair Display', 'Playfair-Fallback', 'Georgia', 'serif'],
        body: ['Inter', 'Inter-Fallback', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'JetBrains-Fallback', 'Courier New', 'monospace'],
      },
      fontSize: {
        display: [
          'clamp(2.9625rem, 2.55rem + 2.0625vw, 4.2rem)',
          { lineHeight: '1.05', letterSpacing: '-0.03em' },
        ],
        h1: [
          'clamp(2.219rem, 1.908rem + 1.552vw, 3.15rem)',
          { lineHeight: '1.1', letterSpacing: '-0.02em' },
        ],
        h2: [
          'clamp(1.663rem, 1.429rem + 1.167vw, 2.363rem)',
          { lineHeight: '1.2', letterSpacing: '-0.015em' },
        ],
        h3: [
          'clamp(1.25rem, 1.075rem + 0.875vw, 1.775rem)',
          { lineHeight: '1.25', letterSpacing: '-0.01em' },
        ],
        'body-lg': [
          'clamp(1rem, 0.917rem + 0.417vw, 1.25rem)',
          { lineHeight: '1.5', letterSpacing: '-0.005em' },
        ],
        body: [
          'clamp(0.9375rem, 0.917rem + 0.104vw, 1rem)',
          { lineHeight: '1.6', letterSpacing: '0em' },
        ],
        caption: [
          'clamp(0.8125rem, 0.8rem + 0.052vw, 0.84375rem)',
          { lineHeight: '1.4', letterSpacing: '0.01em' },
        ],
        'mono-sm': [
          'clamp(0.78125rem, 0.77rem + 0.052vw, 0.8125rem)',
          { lineHeight: '1.45', letterSpacing: '-0.01em' },
        ],
      },
      colors: {
        paper: {
          base: withOpacity("--paper-base"),
          elevated: withOpacity("--paper-elevated"),
          card: withOpacity("--paper-elevated"),
          muted: withOpacity("--paper-muted"),
          DEFAULT: withOpacity("--paper-base"),
        },
        ink: {
          headline: withOpacity("--ink-headline"),
          body: withOpacity("--ink-body"),
          muted: withOpacity("--ink-muted"),
          subtle: withOpacity("--ink-subtle"),
          DEFAULT: withOpacity("--ink-body"),
        },
        mint: {
          base: withOpacity("--mint-base"),
          hover: withOpacity("--mint-hover"),
          contrast: withOpacity("--mint-contrast"),
          DEFAULT: withOpacity("--mint-base"),
        },
        rule: {
          bold: withOpacity("--rule-bold"),
          light: withOpacity("--rule-light"),
          dashed: withOpacity("--rule-dashed"),
          DEFAULT: withOpacity("--rule-light"),
        },
        /* Semantic compatibility bridge */
        border: withOpacity("--rule-light"),
        input: withOpacity("--rule-light"),
        ring: withOpacity("--mint-base"),
        background: withOpacity("--paper-base"),
        foreground: withOpacity("--ink-body"),
        primary: {
          DEFAULT: withOpacity("--mint-base"),
          foreground: withOpacity("--mint-contrast"),
        },
        secondary: {
          DEFAULT: withOpacity("--paper-muted"),
          foreground: withOpacity("--ink-body"),
        },
        muted: {
          DEFAULT: withOpacity("--paper-muted"),
          foreground: withOpacity("--ink-muted"),
        },
        accent: {
          DEFAULT: withOpacity("--mint-base"),
          foreground: withOpacity("--mint-contrast"),
        },
        card: {
          DEFAULT: withOpacity("--paper-elevated"),
          foreground: withOpacity("--ink-body"),
        },
        destructive: {
          DEFAULT: "oklch(0.60 0.20 25)",
          foreground: "oklch(0.98 0 0)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
