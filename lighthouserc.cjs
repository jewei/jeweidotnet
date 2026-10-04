/** Lighthouse CI budget. Mobile, throttled. See docs/SEO.md. */
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: [
        '/',
        '/blog/',
        '/projects/',
        '/about/',
        '/resume/',
        '/database-primary-key/',
        '/claude-code-tips/',
      ],
      // Median of 3 runs: a single run on shared CI runners varies by ±0.05.
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
        'resource-summary:script:size': ['error', { maxNumericValue: 30000 }],
        'resource-summary:total:size': ['error', { maxNumericValue: 400000 }],
      },
    },
    upload: { target: 'temporary-public-storage' },
  },
};
