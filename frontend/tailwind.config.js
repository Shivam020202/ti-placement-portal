/* eslint-disable no-undef */
import { colors } from './src/theme/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors,
      screens: {
        xs: "350px",
        sm: "500px",
        md: "770px",
        lg: "1030px",
        xl: "1400px",
        "2xl": "1700px",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      zIndex: {
        '9999': '9999',
      },
      keyframes: {
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideIn: {
          from: { transform: 'translateX(100%)', opacity: 0 },
          to: { transform: 'translateX(0)', opacity: 1 },
        },
        slideOut: {
          from: { transform: 'translateX(0)', opacity: 1 },
          to: { transform: 'translateX(100%)', opacity: 0 },
        },
        toastSlideDown: {
          '0%': { transform: 'translate(-50%, -100%)', opacity: 0 },
          '100%': { transform: 'translate(-50%, 0)', opacity: 1 }
        },
        toastSlideUp: {
          '0%': { transform: 'translate(-50%, 0)', opacity: 1 },
          '100%': { transform: 'translate(-50%, -100%)', opacity: 0 }
        }
      },
      animation: {
        slideDown: 'slideDown 0.3s ease-out',
        slideUp: 'slideUp 0.2s ease-out',
        fadeIn: 'fadeIn 0.2s ease-out',
        slideIn: 'slideIn 0.3s ease-out',
        slideOut: 'slideOut 0.3s ease-in',
        toastSlideDown: 'toastSlideDown 0.3s ease-out',
        toastSlideUp: 'toastSlideUp 0.3s ease-in'
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        tailwind: {
          ...colors,
          primary: colors.primary,
          secondary: colors.secondary,
          accent: colors.accent,
          neutral: colors.neutral,
          "base-100": colors["base-100"],
          "base-200": colors["base-200"],
          "base-300": colors["base-300"],
          info: colors.info,
          success: colors.success,
          warning: colors.warning,
          error: colors.error,
          "--rounded-box": "0.5rem",
          "--rounded-btn": "0.5rem",
          "--btn-text-case": "none",
          "--navbar-padding": "1rem",
        },
      },
    ],
    darkTheme: false,
    base: true,
    styled: true,
    utils: true,
  },
  variants: {
    extend: {
      display: ['print'],
      borderColor: ['print'],
      backgroundColor: ['print'],
      textColor: ['print'],
      opacity: ['print']
    },
  },
};