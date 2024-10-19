import { mergeConfig } from 'vite'
import eslint from 'vite-plugin-eslint'
import baseConfig from './vite.config.base'

export default mergeConfig(
  {
    mode: 'development',
    server: {
      open: true,
      host: '0.0.0.0',
      fs: {
        strict: true,
      },
      proxy: {
          "/dev-api": {
              target: "http://8.137.83.32",
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/dev-api/, ''),
          },
          "/iotda-api": {
              target: "https://26e659c083.st1.iotda-app.cn-north-4.myhuaweicloud.com",
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/iotda-api/, ''),
          }
      }
    },
    plugins: [
      eslint({
        cache: false,
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
        exclude: ['node_modules'],
      }),
    ],
  },
  baseConfig
)
