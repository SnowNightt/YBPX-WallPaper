import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import optimizer from 'vite-plugin-optimizer'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue(),
      optimizer({
        electron: `const { ipcRenderer } = require('electron'); export { ipcRenderer };`
      })
    ],
    build: {
      rollupOptions: {
        external: ['path', 'fs', 'electron']
      }
    }
  }
})
