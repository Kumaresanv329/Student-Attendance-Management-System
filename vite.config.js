import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
	plugins: [react()],
	root: path.resolve(__dirname, 'frontend'),
	server: {
		port: 5173,
		proxy: {
			'/api': {
				target: 'http://localhost:5000',
				changeOrigin: true,
			},
		},
	},
	build: {
		outDir: path.resolve(__dirname, 'frontend/dist'),
		emptyOutDir: true,
	},
})









