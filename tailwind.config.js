/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 深色基底
        base: {
          950: '#05080F',
          900: '#080D18',
          850: '#0B1220',
          800: '#0F1828',
          700: '#16223A',
        },
        // 科技蓝（信息）
        tech: {
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
        },
        // 消防橙（警示）
        fire: {
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
        },
        // 危险红
        danger: {
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
        },
        safe: {
          400: '#34D399',
          500: '#10B981',
        },
      },
      fontFamily: {
        sans: [
          '"PingFang SC"',
          '"Microsoft YaHei"',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        mono: ['"JetBrains Mono"', 'Consolas', '"Courier New"', 'monospace'],
      },
      boxShadow: {
        panel: '0 8px 32px rgba(0, 0, 0, 0.35)',
        'glow-tech': '0 0 24px rgba(56, 189, 248, 0.18)',
        'glow-fire': '0 0 24px rgba(249, 115, 22, 0.22)',
        'glow-danger': '0 0 28px rgba(239, 68, 68, 0.28)',
      },
      backgroundImage: {
        'grid-tech':
          'linear-gradient(rgba(56,189,248,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.05) 1px, transparent 1px)',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        'float-y': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'smoke-rise': {
          '0%': { transform: 'translateY(0) scale(0.6)', opacity: '0' },
          '25%': { opacity: '0.55' },
          '100%': { transform: 'translateY(-70px) scale(1.6)', opacity: '0' },
        },
        'flicker': {
          '0%, 100%': { transform: 'scaleY(1) scaleX(1)', opacity: '0.95' },
          '25%': { transform: 'scaleY(1.15) scaleX(0.92)', opacity: '1' },
          '50%': { transform: 'scaleY(0.92) scaleX(1.05)', opacity: '0.85' },
          '75%': { transform: 'scaleY(1.08) scaleX(0.96)', opacity: '1' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(2000%)' },
        },
        'blink-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.25' },
        },
        'alert-flash': {
          '0%, 100%': { boxShadow: '0 0 0 rgba(239,68,68,0)' },
          '50%': { boxShadow: '0 0 32px rgba(239,68,68,0.35)' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.2, 0.6, 0.4, 1) infinite',
        'float-y': 'float-y 5s ease-in-out infinite',
        'smoke-rise': 'smoke-rise 2.6s ease-in infinite',
        'flicker': 'flicker 0.9s ease-in-out infinite',
        'scan-line': 'scan-line 6s linear infinite',
        'blink-dot': 'blink-dot 1.4s ease-in-out infinite',
        'alert-flash': 'alert-flash 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
