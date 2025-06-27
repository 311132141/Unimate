import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design system colors using your Figma tokens
        'primary': '#3769ae',
        'primary-50': '#f0f2fa',
        'primary-100': '#dde2f3',
        'primary-200': '#bbc5e8',
        'primary-300': '#9cabdd',
        'primary-400': '#7a8ed1',
        'primary-500': '#5872c6',
        'primary-600': '#3e5ab6',
        'primary-700': '#344b98',
        'primary-800': '#283a76',
        'primary-900': '#1e2b57',
        'primary-950': '#192448',

        'secondary': '#dce2e9',
        'secondary-50': '#e6e6e6',
        'secondary-100': '#d6d6d6',
        'secondary-200': '#bababa',
        'secondary-300': '#9e9e9e',
        'secondary-400': '#828282',
        'secondary-500': '#666666',
        'secondary-600': '#545454',
        'secondary-700': '#424242',
        'secondary-800': '#303030',
        'secondary-900': '#1f1f1f',
        'secondary-950': '#141414',

        'tertiary': '#556377',
        'tertiary-light': 'rgba(85, 99, 119, 0.70)',

        'background-dark': '#000000',
        'surface-dark': '#282828',
        'destructive': '#af3737',
        'neutral': '#d1d1d1',
      },
      borderRadius: {
        'xs': '6px',
        's': '10px',
        'm': '12px',
        'l': '14px',
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '1.2' }],
        'md': ['16px', { lineHeight: '1.4' }],
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};

export default config; 