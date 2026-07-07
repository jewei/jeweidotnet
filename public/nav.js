// The wordmark is an invitation: `jewei.toString()` actually works in here.
window.jewei = {
  toString: function () {
    return 'Software engineer. Minimal systems, deliberate details, code shaped like art. → https://github.com/jewei';
  },
};
console.log('%cjewei.toString()%c — go on, try it.', 'font-weight:600;color:#7c3aed', '');

// Expose the current theme state to assistive tech (theme.js sets the class
// before this script runs).
document
  .getElementById('theme-toggle')
  ?.setAttribute('aria-pressed', String(document.documentElement.classList.contains('dark')));

document.addEventListener('click', function (e) {
  var target = e.target;
  if (!(target instanceof Element)) return;

  var themeToggle = target.closest('#theme-toggle');
  if (themeToggle) {
    var isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.setAttribute('aria-pressed', String(isDark));
    return;
  }

  var menuToggle = target.closest('#menu-toggle');
  if (menuToggle) {
    var menu = document.getElementById('mobile-menu');
    if (!menu) return;
    var isHidden = menu.classList.toggle('hidden');
    menuToggle.setAttribute('aria-expanded', String(!isHidden));
    menuToggle.querySelector('.icon-menu-open')?.classList.toggle('hidden', !isHidden);
    menuToggle.querySelector('.icon-menu-close')?.classList.toggle('hidden', isHidden);
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  var menu = document.getElementById('mobile-menu');
  var toggle = document.getElementById('menu-toggle');
  if (!menu || menu.classList.contains('hidden')) return;
  menu.classList.add('hidden');
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.querySelector('.icon-menu-open')?.classList.remove('hidden');
  toggle?.querySelector('.icon-menu-close')?.classList.add('hidden');
});
