import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const DEFAULT_PRODUCTION_BASE = '/portfolio/'

export default defineConfig(({ command }) => ({
  base:
    process.env.VITE_PUBLIC_BASE_PATH ||
    (command === 'build' ? DEFAULT_PRODUCTION_BASE : '/'),
  plugins: [react(), tailwindcss()],
}))
