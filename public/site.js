// Site behaviour: theme toggle and code copy. No dependencies.
// Loaded with `defer` on every page. Keep this file small.
(function () {
  var root = document.documentElement;
  var media = window.matchMedia('(prefers-color-scheme: dark)');

  function currentTheme() {
    return root.dataset.theme || (media.matches ? 'dark' : 'light');
  }

  function syncThemeUi() {
    var dark = currentTheme() === 'dark';
    var button = document.querySelector('[data-theme-toggle]');
    if (button) {
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    }
    var color = getComputedStyle(root).getPropertyValue('--bg').trim();
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
      meta.setAttribute('content', color);
    });
  }

  // The site is HTTPS only, so the Clipboard API is available. Where it is
  // not (an http preview), the button asks for a manual copy.
  function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(value);
    return Promise.reject(new Error('Clipboard API unavailable'));
  }

  document.addEventListener('click', function (event) {
    var target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    if (target.closest('[data-theme-toggle]')) {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch (_) {}
      syncThemeUi();
      return;
    }

    var copy = target.closest('[data-copy]');
    if (copy) {
      var code = copy.closest('[data-code]');
      var source = code && code.querySelector('pre code');
      var label = copy.querySelector('[data-copy-label]');
      if (!source || !label) return;
      copyText(source.textContent || '').then(
        function () {
          copy.dataset.state = 'done';
          label.textContent = 'Copied';
        },
        function () {
          copy.dataset.state = 'error';
          label.textContent = 'Press ⌘C';
        },
      );
      clearTimeout(copy._reset);
      copy._reset = setTimeout(function () {
        delete copy.dataset.state;
        label.textContent = 'Copy';
      }, 2000);
    }
  });

  media.addEventListener('change', syncThemeUi);
  syncThemeUi();

  // The wordmark is also an API: try jewei.toString() in the console.
  window.jewei = {
    toString: function () {
      return 'Senior software engineer. Backend systems, useful tools, and notes from the work. → https://jewei.net/about/';
    },
  };
})();
