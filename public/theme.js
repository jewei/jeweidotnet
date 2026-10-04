// Applies the stored theme before first paint. Without a stored choice,
// CSS follows prefers-color-scheme. Loaded render-blocking from <head>.
(function () {
  try {
    var theme = localStorage.getItem('theme');
    if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
  } catch (_) {}
})();
