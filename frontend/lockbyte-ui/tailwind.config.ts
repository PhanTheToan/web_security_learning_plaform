import type { Config } from 'tailwindcss'
import type { PluginUtils } from 'tailwindcss/plugin'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
              sans: ["var(--font-inter)", "system-ui", "sans-serif"],
              mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
            },
            colors: {
                'status-success-fg': 'hsl(var(--status-success-fg))',
                'status-success-bg': 'hsl(var(--status-success-bg))',
                'status-warning-fg': 'hsl(var(--status-warning-fg))',
                'status-warning-bg': 'hsl(var(--status-warning-bg))',
                'status-danger-fg': 'hsl(var(--status-danger-fg))',
                'status-danger-bg': 'hsl(var(--status-danger-bg))',
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                'float-and-rotate': {
                    '0%, 100%': {
                        transform: 'translateY(0px) rotateY(0deg) scale(1)',
                        filter: 'brightness(1)'
                    },
                    '25%': {
                        transform: 'translateY(-10px) rotateY(5deg) scale(1.01)',
                        filter: 'brightness(1.1)'
                    },
                    '50%': {
                        transform: 'translateY(-20px) rotateY(0deg) scale(1.02)', // Bay cao hơn một chút, về vị trí xoay ban đầu
                        filter: 'brightness(1.2)'
                    },
                    '75%': {
                        transform: 'translateY(-10px) rotateY(-5deg) scale(1.01)',
                        filter: 'brightness(1.1)'
                    },
                },
                'pulse-light': {
                    '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
                    '50%': { opacity: '0.9', transform: 'scale(1.05)' },
                },
                sparkle: {
                    '0%, 100%': { opacity: '0', transform: 'scale(0)' },
                    '20%': { opacity: '1', transform: 'scale(1)' },
                    '40%': { opacity: '0', transform: 'scale(0)' },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                'float-and-rotate': 'float-and-rotate 8s ease-in-out infinite', // Thời gian animation dài hơn
                'pulse-light': 'pulse-light 4s ease-in-out infinite', // Thời gian animation dài hơn
                sparkle: 'sparkle 5s ease-out infinite', // Animation cho hạt sáng
            },
            boxShadow: {
                'neon-purple': '0 0 15px rgba(168, 85, 247, 0.5)',
            },
            typography: ({ theme }: PluginUtils) => ({
                DEFAULT: {
                    css: {
                        'code, pre, kbd, samp': {
                            fontFamily: theme('fontFamily.mono').join(', '),
                        },
                        'ul > li::marker': {
                            color: theme('colors.purple.400'),
                        },
                        'ol > li::marker': {
                            color: theme('colors.purple.400'),
                        },
                    },
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}

export default config