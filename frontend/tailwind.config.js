/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern SaaS learning theme
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          750: '#2a3547',
          800: '#1c2433',
          850: '#162030',
          900: '#0f172a',
          950: '#0b1120',
        },
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        accent: {
          purple: '#7c3aed',
          pink: '#ec4899',
          orange: '#f97316',
          gold: '#fbbf24',
          green: '#10b981',
          cyan: '#06b6d4',
        },
        xp: {
          bronze: '#cd7f32',
          silver: '#c0c0c0',
          gold: '#ffd700',
          platinum: '#e5e4e2',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-gaming': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'gradient-success': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-danger': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        'gradient-xp': 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #c084fc 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1c2433 0%, #0f172a 100%)',
      },
      boxShadow: {
        'glow': '0 0 18px rgba(99, 102, 241, 0.35)',
        'glow-lg': '0 0 28px rgba(99, 102, 241, 0.45)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.4)',
        'glow-gold': '0 0 20px rgba(251, 191, 36, 0.4)',
        'card': '0 8px 20px rgba(15, 23, 42, 0.25)',
        'card-hover': '0 14px 32px rgba(15, 23, 42, 0.35)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
