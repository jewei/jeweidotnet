(function () {
  let stored = null;
  try {
    stored = localStorage.getItem('theme');
  } catch (_error) {
    stored = null;
  }
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const isDark = (stored ?? preferred) === 'dark';
  document.documentElement.classList.toggle('dark', isDark);

  const themeColor = document.getElementById('theme-color');
  if (themeColor) themeColor.content = themeColor.dataset[isDark ? 'dark' : 'light'];
})();
