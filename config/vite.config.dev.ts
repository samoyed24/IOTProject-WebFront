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
