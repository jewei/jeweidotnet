document.addEventListener('click', function (e) {
  var target = e.target;
  if (!(target instanceof Element)) return;

  if (target.closest('#theme-toggle')) {
    var isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
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
