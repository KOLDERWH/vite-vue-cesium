import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import cesium from 'vite-plugin-cesium'; // 引入插件

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), cesium()],
})


