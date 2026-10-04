/**
 * HTML to Markdown for the Markdown copy of each page. Runs without a build.
 */
import { describe, expect, test } from 'vite-plus/test';
import { htmlToMarkdown } from '../../scripts/markdown';

describe('Markdown copies', () => {
  test('a caption with Markdown characters appears once, after the media', () => {
    const markdown = htmlToMarkdown(
      '<h1>Post</h1><figure><img src="/a.webp" alt="Settings screen">' +
        '<figcaption>The settings_local file and <code>[x]</code></figcaption></figure>',
    );
    expect(markdown).toBe('# Post\n\n![Settings screen](/a.webp)\n\n_The settings\\_local file and `[x]`_');
  });

  test('fenced code keeps its blank lines', () => {
    const markdown = htmlToMarkdown(
      '<h1>Post</h1><div data-code data-language="php"><pre><code>a();\n\n\n\nb();</code></pre></div>' +
        '<pre><code>c\n\n\nd</code></pre>',
    );
    expect(markdown).toContain('```php\na();\n\n\n\nb();\n```');
    expect(markdown).toContain('```\nc\n\n\nd\n```');
  });

  test('the H1 moves first, with one blank line between blocks', () => {
    expect(htmlToMarkdown('<p>Eyebrow</p><h1>Post</h1><p>One</p>')).toBe('# Post\n\nEyebrow\n\nOne');
  });
});
