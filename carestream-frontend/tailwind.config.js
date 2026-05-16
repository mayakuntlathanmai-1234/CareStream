/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        clinical: {
          light: '#F0F4FF',
          dark: '#0F172A',
          primary: '#00e5ff',
          secondary: '#0a84ff',
          accent: '#30d158',
        },
        cs: {
          cyan: '#00e5ff',
          violet: '#bf5af2',
          rose: '#ff375f',
          mint: '#30d158',
          amber: '#ffd60a',
          blue: '#0a84ff',
        },
        neon: {
          teal: '#00e5ff',
          blue: '#0a84ff',
          purple: '#bf5af2',
          pink: '#ff375f',
        },
        theme: {
          main: 'var(--text-main)',
          muted: 'var(--text-muted)',
        }
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
        'glow-teal': 'radial-gradient(ellipse at center, rgba(0,229,255,0.3) 0%, transparent 70%)',
        'glow-blue': 'radial-gradient(ellipse at center, rgba(10,132,255,0.3) 0%, transparent 70%)',
        'hero-gradient': 'linear-gradient(135deg, #080c14 0%, #0e1220 50%, #080c14 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'teal-gradient': 'linear-gradient(135deg, #00e5ff 0%, #0a84ff 100%)',
        'purple-gradient': 'linear-gradient(135deg, #bf5af2 0%, #ff375f 100%)',
        'cyan-gradient': 'linear-gradient(135deg, #00e5ff 0%, #0a84ff 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
        'spin-slow': 'spin 20s linear infinite',
        'blob': 'blob 7s infinite',
        'orb': 'floatOrb 18s ease-in-out infinite',
        'orb-reverse': 'floatOrb 22s ease-in-out infinite reverse',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        floatOrb: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '33%': { transform: 'translate(30px, -20px)' },
          '66%': { transform: 'translate(-20px, 30px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 229, 255, 0.6), 0 0 60px rgba(0, 229, 255, 0.2)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
        '4xl': '72px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
        'glass-lg': '0 25px 50px 0 rgba(0, 0, 0, 0.35)',
        'neon-cyan': '0 0 20px rgba(0, 229, 255, 0.5), 0 0 40px rgba(0, 229, 255, 0.2)',
        'neon-teal': '0 0 20px rgba(0, 229, 255, 0.5), 0 0 40px rgba(0, 229, 255, 0.2)',
        'neon-blue': '0 0 20px rgba(10, 132, 255, 0.5), 0 0 40px rgba(10, 132, 255, 0.2)',
        'neon-purple': '0 0 20px rgba(191, 90, 242, 0.5), 0 0 40px rgba(191, 90, 242, 0.2)',
        'card-hover': '0 20px 60px rgba(0, 229, 255, 0.15)',
      },
    },
  },
  plugins: [],
}
