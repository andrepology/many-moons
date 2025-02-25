import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Skip type checking during build
    typescript: {
      noEmit: true,
      skipLibCheck: true,
      skipTypeCheck: true,
    }
  }
})
