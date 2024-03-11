/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
  plugins: [daisyui],
    theme: {
    extend: {},
  },
  content: ['./src/**/*.{svelte,js,ts}'],
  variants: {
    extend: {},
  }
}

