// packages/button/vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // 增加插件的使用
  plugins: [vue()],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'YbpxwallpaperPagination',
      fileName: 'ybpxwallpaper-pagination'
    },
    minify: false,
    rollupOptions: {
      external: [
        /@ybpxwallpaper.*/,
        'vue'
      ]
    }
  }
})
