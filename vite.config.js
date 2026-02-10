import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { compression } from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    // Analisar bundle size
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    }),
    // Comprimir assets
    compression({
      algorithm: 'gzip',
      ext: '.gz'
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br'
    })
  ],
  
  // Path aliases para imports mais limpos
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@data': path.resolve(__dirname, './src/data'),
      '@services': path.resolve(__dirname, './src/services'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@context': path.resolve(__dirname, './src/context'),
    }
  },

  // Otimizações de build
  build: {
    sourcemap: false, // Desabilitar em produção
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remover console.logs
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase': ['@supabase/supabase-js'],
          'openai': ['openai'],
          'ui': ['lucide-react'],
          'charts': ['recharts']
        }
      }
    },
    // Target ES2020 para melhor compatibilidade
    target: 'es2020',
    // Chunk size warnings
    chunkSizeWarningLimit: 500
  },

  // Configuração de servidor de desenvolvimento
  server: {
    port: 5173,
    host: true
  },

  // Variáveis de ambiente
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version)
  }
})
