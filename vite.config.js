import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

//https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  assetsDir: "src/static",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src", import.meta.url)),
    },
  },
  server: {
    host: "localhost",
    port: 5174,
    proxy: {
      '/parse-author-org': {
        target: 'http://10.109.246.132:5078',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/parse-author-org/, '/api/v1/parse/'),
      },
      "/api": {
        target: "http://10.109.246.222:3333",
        // secure: false, //如果是https接口，如要配置此参数
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/navy': { // 设置第二个代理
        target: "http://10.109.246.188:48811",
        // target: "http://10.109.246.222:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/navy/, ''),
      },
      '/ner': {
        target: 'http://10.109.246.132:8001', // 或者换成你服务真实地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ner/, '/api/v1/ner'), // 👈 将前缀重写成真实路径
      },
    },
  },
});
