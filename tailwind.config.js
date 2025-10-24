module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            fontFamily: {
                'game': ['"Press Start 2P"', 'cursive'], 
                'mono': ['"Kode Mono"', 'monospace'],
            }
        },
    },
    plugins: [require('@tailwindcss/forms'),],
}
