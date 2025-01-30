import { defineConfig } from 'tsup'

export default defineConfig({
    entry: [
      'src',
    ],
    splitting: false,
    sourcemap: false,
    clean: true,
    minify: true,
    format: 'cjs',
    outDir: 'build'
})
