import { mergeConfig } from 'vite'
import configArcoResolverPlugin from './plugin/arcoResolver'
import configCompressPlugin from './plugin/compress'
import configVisualizerPlugin from './plugin/visualizer'
import baseConfig from './vite.config.base'

export default mergeConfig(
  {
    mode: 'production',
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
    plugins: [configCompressPlugin('gzip'), configVisualizerPlugin(), configArcoResolverPlugin()],
    build: {
      chunkSizeWarningLimit: 20480,
      reportCompressedSize: false,
      rollupOptions: {
        onwarn: () => {},
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
      minify: 'esbuild',
      target: 'es2015',
      sourcemap: false,
    },
  },
  baseConfig
)
