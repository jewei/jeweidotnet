// Before first paint: apply the stored theme (else CSS follows the system),
// and mark the page .js so scroll reveals can hide their content.
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  try {
    var theme = localStorage.getItem('theme');
    if (theme === 'light' || theme === 'dark') root.dataset.theme = theme;
  } catch (_) {}
})();
