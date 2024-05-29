import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
const packageJson = require('./package.json');
const { dependencies, name } = packageJson;

delete dependencies['@emotion/styled'];
delete dependencies['@mui/material'];
delete dependencies['@mui/styles'];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'npwd_app_broker',
      filename: 'remoteEntry.js',
      exposes: {
        './config': './npwd.config.ts',
      },
      shared: ['react', 'react-dom', '@emotion/react', 'react-router-dom', 'fivem-nui-react-lib'],
    }),
  ],
  base: './',
  define: {
    process: {
      env: {
        VITE_REACT_APP_IN_GAME: process.env.VITE_REACT_APP_IN_GAME,
      },
    },
  },
  server: {
    port: 3002,
    watch: {
      usePolling: true
    }
  },
  build: {
    outDir: '../web/dist',
    emptyOutDir: true,
    modulePreload: true,
    assetsDir: '',
    target: 'esnext'
  },
});
