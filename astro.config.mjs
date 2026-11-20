// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://daniellepold.github.io',
  trailingSlash: 'ignore',
  // keep whitespace between text and inline tags that sit on separate lines
  compressHTML: false,
  build: { format: 'directory' },
});
