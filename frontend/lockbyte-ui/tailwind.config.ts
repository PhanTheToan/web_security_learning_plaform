/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            keyframes: {
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
                'float-and-rotate': 'float-and-rotate 8s ease-in-out infinite', // Thời gian animation dài hơn
                'pulse-light': 'pulse-light 4s ease-in-out infinite', // Thời gian animation dài hơn
                sparkle: 'sparkle 5s ease-out infinite', // Animation cho hạt sáng
            },
        },
    },
    plugins: [],
}