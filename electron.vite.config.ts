import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, splitVendorChunkPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), splitVendorChunkPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin(), splitVendorChunkPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react(), splitVendorChunkPlugin()]
  }
})
