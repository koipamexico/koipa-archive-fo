import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/koipa-archive-fo/',
  plugins: [react()],
})
