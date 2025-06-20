/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Palette - Culinary Warmth
        primary: {
          50: '#FFF8F0',   // Cream base
          100: '#FFEDD5',  // Light cream
          200: '#FED7AA',  // Soft peach
          300: '#FDBA74',  // Warm peach
          400: '#FB923C',  // Orange accent
          500: '#F97316',  // Primary orange
          600: '#EA580C',  // Deep orange
          700: '#C2410C',  // Burnt orange
          800: '#9A3412',  // Dark orange
          900: '#7C2D12',  // Deepest orange
        },
        // Secondary Palette - Fresh Herbs
        secondary: {
          50: '#F0FDF4',   // Mint white
          100: '#DCFCE7',  // Light mint
          200: '#BBF7D0',  // Soft mint
          300: '#86EFAC',  // Fresh mint
          400: '#4ADE80',  // Bright green
          500: '#22C55E',  // Primary green
          600: '#16A34A',  // Deep green
          700: '#15803D',  // Forest green
          800: '#166534',  // Dark green
          900: '#14532D',  // Deepest green
        },
        // Accent Palette - Spice Gold
        accent: {
          50: '#FFFBEB',   // Golden cream
          100: '#FEF3C7',  // Light gold
          200: '#FDE68A',  // Soft gold
          300: '#FCD34D',  // Warm gold
          400: '#FBBF24',  // Bright gold
          500: '#F59E0B',  // Primary gold
          600: '#D97706',  // Deep gold
          700: '#B45309',  // Burnt gold
          800: '#92400E',  // Dark gold
          900: '#78350F',  // Deepest gold
        },
        // Neutral Palette - Kitchen Stone
        neutral: {
          50: '#FAFAF9',   // Pure white
          100: '#F5F5F4',  // Off white
          200: '#E7E5E4',  // Light stone
          300: '#D6D3D1',  // Soft stone
          400: '#A8A29E',  // Medium stone
          500: '#78716C',  // Stone
          600: '#57534E',  // Dark stone
          700: '#44403C',  // Charcoal
          800: '#292524',  // Dark charcoal
          900: '#1C1917',  // Black stone
        },
        // Status Colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.5' }],
        'lg': ['1.125rem', { lineHeight: '1.4' }],
        'xl': ['1.25rem', { lineHeight: '1.4' }],
        '2xl': ['1.5rem', { lineHeight: '1.3' }],
        '3xl': ['1.875rem', { lineHeight: '1.2' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(249, 115, 22, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-soft': 'pulseSoft 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}