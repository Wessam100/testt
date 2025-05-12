import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'  // Add this import

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],  // Add nodePolyfills to the plugins array
})
