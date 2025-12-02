/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./frontend/index.html',
		'./frontend/src/**/*.{js,jsx,ts,tsx}',
	],
	theme: {
		extend: {
			colors: {
				// Bharathiar University Colors
				'bu-orange': {
					50: '#fff5f0',
					100: '#ffe8e0',
					200: '#ffd1c0',
					300: '#ffb099',
					400: '#ff8a66',
					500: '#ff6b35', // Primary Orange/Saffron
					600: '#ff4d1a',
					700: '#e63c0a',
					800: '#cc2e00',
					900: '#b32600',
				},
				'bu-blue': {
					50: '#e6f0f5',
					100: '#cce0eb',
					200: '#99c1d7',
					300: '#66a2c3',
					400: '#3383af',
					500: '#00649b', // Primary Dark Blue
					600: '#005080',
					700: '#003c65',
					800: '#00284a',
					900: '#00142f',
				},
			},
		},
	},
	plugins: [],
}




