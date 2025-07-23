/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#F4F1FF',
          100: '#EBE4FF',
          200: '#DDD1FF',
          300: '#C7B2FF',
          400: '#B090FF',
          500: '#8B7FE8',
          600: '#5B47E0',
          700: '#4A38CC',
          800: '#3B2B9F',
          900: '#2F2373',
        },
        accent: {
          coral: '#FF6B6B',
          teal: '#4ECDC4',
          yellow: '#FFD93D',
          blue: '#4D96FF',
        },
        surface: {
          white: '#FFFFFF',
          gray: '#F7F9FC',
          light: '#F1F3F7',
        },
        text: {
          primary: '#1A1D29',
          secondary: '#6B7280',
          muted: '#9CA3AF',
        }
      },
      boxShadow: {
        'card': '0 4px 8px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 16px -4px rgba(0, 0, 0, 0.15), 0 4px 8px -4px rgba(0, 0, 0, 0.1)',
        'ai-glow': '0 0 20px rgba(91, 71, 224, 0.3)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #5B47E0 0%, #8B7FE8 100%)',
        'gradient-surface': 'linear-gradient(135deg, #FFFFFF 0%, #F7F9FC 100%)',
      },
    },
  },
  plugins: [],
}