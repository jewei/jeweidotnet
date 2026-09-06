// The wordmark is an invitation: `jewei.toString()` also works in the console.
window.jewei = {
  toString: function () {
    return 'Senior software engineer. Backend systems, useful tools, and notes from the work. → https://github.com/jewei';
  },
};
console.log('%cjewei.toString()%c — try it.', 'font-weight:700', '');

var themeToggle = document.getElementById('theme-toggle');
var menuToggle = document.getElementById('menu-toggle');
var mobileMenu = document.getElementById('mobile-menu');

function setThemeControl(isDark) {
  var themeColor = document.getElementById('theme-color');
  if (themeColor) themeColor.content = themeColor.dataset[isDark ? 'dark' : 'light'];
  if (!themeToggle) return;
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.setAttribute('aria-label', 'Dark mode');
}

function setMenuControl(isOpen) {
  if (!menuToggle || !mobileMenu) return;
  mobileMenu.classList.toggle('hidden', !isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  menuToggle.querySelector('.icon-menu-open')?.classList.toggle('hidden', isOpen);
  menuToggle.querySelector('.icon-menu-close')?.classList.toggle('hidden', !isOpen);
}

setThemeControl(document.documentElement.classList.contains('dark'));
setMenuControl(false);

document.addEventListener('click', function (event) {
  var target = event.target;
  if (!(target instanceof Element)) return;

  if (target.closest('#theme-toggle')) {
    var isDark = document.documentElement.classList.toggle('dark');
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (_error) {
      // The control still works when storage is unavailable.
    }
    setThemeControl(isDark);
    return;
  }

  if (target.closest('#menu-toggle')) {
    var isOpen = menuToggle?.getAttribute('aria-expanded') !== 'true';
    setMenuControl(isOpen);
    if (isOpen) mobileMenu?.querySelector('a')?.focus();
    return;
  }

  if (target.closest('#mobile-menu a')) setMenuControl(false);
});

document.addEventListener('keydown', function (event) {
  if (event.key !== 'Escape' || mobileMenu?.classList.contains('hidden')) return;
  setMenuControl(false);
  menuToggle?.focus();
});

window.matchMedia('(min-width: 48rem)').addEventListener('change', function (event) {
  if (event.matches) setMenuControl(false);
});
