import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { buildBlogIndex } from './scripts/blog-index.mjs';

const BLOG_DIR = path.resolve('public/blog-content');
const BLOG_INDEX = 'profile/blog.json';

// Serves (dev) or emits (build) /profile/blog.json, generated from the front
// matter of the posts in public/blog-content/ — see scripts/blog-index.mjs.
function blogIndex() {
  return {
    name: 'blog-index',
    configureServer(server) {
      server.middlewares.use(`/${BLOG_INDEX}`, (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(buildBlogIndex(BLOG_DIR)));
      });
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: BLOG_INDEX,
        source: `${JSON.stringify(buildBlogIndex(BLOG_DIR), null, 2)}\n`,
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), blogIndex()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
  },
});
