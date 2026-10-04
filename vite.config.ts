import { defineConfig } from 'vite-plus';

/**
 * Vite+ is the toolchain for this repo. Astro owns the app's dev server and
 * build; Vite+ runs everything around it:
 *
 *   vp install          install dependencies (delegates to Bun)
 *   vp run <task>       run a task below, with caching and ordering
 *   vp check [--fix]    format (Oxfmt), lint (Oxlint), type-aware checks
 *   vp test             unit and content tests (Vitest)
 *   vp staged           pre-commit checks on staged files (via vp hooks)
 *
 * See docs/WORKFLOW.md for when to run what.
 */
export default defineConfig({
  run: {
    tasks: {
      dev: { command: 'astro dev', cache: false },
      preview: { command: 'astro preview', cache: false },
      // Static build, then Markdown copies of every page for agents.
      build: {
        command: 'astro build && bun scripts/build-markdown.ts',
        cache: {
          input: [{ auto: true }, '!dist/**', '!.astro/**', '!node_modules/.astro/**', '!node_modules/.vite/**'],
          output: ['dist/**'],
        },
      },
      // Type-check .astro files (tsgolint in `vp check` covers .ts only).
      typecheck: {
        command: 'astro check',
        // astro check regenerates .astro/types.d.ts; do not treat it as input.
        cache: { input: [{ auto: true }, '!.astro/**'] },
      },
      // Tests that read built HTML in dist/.
      'test:build': {
        command: 'vp test tests/build',
        dependsOn: ['build'],
        cache: false,
      },
      // The full gate. CI and agents run this before a PR.
      verify: {
        command: ['vp check', 'vp run typecheck', 'vp test tests/unit', 'vp run test:build'],
        cache: false,
      },
      // Screenshots of key pages at key widths into .shots/ (needs a build).
      shots: { command: 'bun scripts/screenshots.ts', cache: false },
      'og:optimize': { command: 'bun scripts/optimize-og-image.ts', cache: false },
    },
  },
  fmt: {
    singleQuote: true,
    semi: true,
    printWidth: 110,
    sortPackageJson: true,
    // Posts and project files are authored content. Never reformat them.
    ignorePatterns: [
      'dist/**',
      '.astro/**',
      'src/content/**',
      'public/**',
      '.claude/**',
      'bun.lock',
      '*.astro',
    ],
  },
  lint: {
    ignorePatterns: ['dist/**', '.astro/**', 'public/**', '.claude/**'],
    options: { typeAware: true, typeCheck: true },
    rules: {
      'no-console': ['error', { allow: ['error', 'warn', 'log'] }],
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    testTimeout: 30_000,
  },
  staged: {
    '*.{ts,mjs,js,json,css,md}': 'vp check --fix',
  },
});
