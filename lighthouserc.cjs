/** @type {import('@lhci/cli').Config} */
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: ['/', '/projects/', '/blog/', '/resume/', '/introducing-typeid-php/'],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'resource-summary:script:size': ['error', { maxNumericValue: 30000 }],
        'resource-summary:total:size': ['error', { maxNumericValue: 350000 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
