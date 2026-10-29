// Site behaviour: theme toggle, code copy, home page motion. No dependencies.
// Loaded with `defer` on every page. With theme.js it must stay under 8 KB.
(function () {
  var root = document.documentElement;
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var clamp = function (value, limit) {
    return Math.max(-limit, Math.min(limit, value));
  };

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

  function setTheme(next) {
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch (_) {}
    syncThemeUi();
  }

  // The new theme grows in a circle from the toggle.
  function switchTheme(button) {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    if (still || !document.startViewTransition) return setTheme(next);
    var box = button.getBoundingClientRect();
    var x = box.left + box.width / 2;
    var y = box.top + box.height / 2;
    var at = ' at ' + x + 'px ' + y + 'px)';
    var radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    var done = function () {
      root.classList.remove('theme-change');
    };
    root.classList.add('theme-change');
    var change = document.startViewTransition(function () {
      setTheme(next);
    });
    change.ready.then(function () {
      root.animate(
        { clipPath: ['circle(0px' + at, 'circle(' + radius + 'px' + at] },
        {
          duration: 640,
          easing: getComputedStyle(root).getPropertyValue('--ease').trim(),
          pseudoElement: '::view-transition-new(root)',
        },
      );
    }, done);
    change.finished.then(done, done);
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

    var toggle = target.closest('[data-theme-toggle]');
    if (toggle) {
      switchTheme(toggle);
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

  // Scroll reveals (base.css). Elements that enter together stagger by 70ms.
  var observer = new IntersectionObserver(
    function (entries) {
      var index = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        entry.target.style.setProperty('--delay', index++ * 70 + 'ms');
        entry.target.dataset.shown = '';
      });
    },
    { threshold: 0.06 },
  );
  document.querySelectorAll('[data-reveal]').forEach(function (element) {
    observer.observe(element);
  });

  // Home intro: the local time, HH:MM.
  var clock = document.querySelector('[data-clock]');
  if (clock) {
    var tick = function () {
      var time = new Date()
        .toLocaleTimeString('en-GB', { timeZone: clock.dataset.clock, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
        .split(':');
      clock.firstElementChild.textContent = time[0];
      clock.lastElementChild.textContent = time[1];
      clock.hidden = false;
    };
    tick();
    setInterval(tick, 15000);
  }

  // Home portrait: a sticker that you can drag. It tilts as it moves.
  var sticker = document.querySelector('[data-sticker]');
  if (sticker && mouse && !still) {
    var print = sticker.firstElementChild;
    var place = { x: 0, y: 0 };
    var drag = null;
    var drop = function () {
      drag = null;
      delete sticker.dataset.dragging;
      print.style.setProperty('--tilt', '0deg');
    };
    sticker.addEventListener('pointerdown', function (event) {
      sticker.setPointerCapture(event.pointerId);
      drag = { x: event.clientX - place.x, y: event.clientY - place.y, last: event.clientX };
      sticker.dataset.dragging = '';
    });
    sticker.addEventListener('pointermove', function (event) {
      if (!drag) return;
      place = { x: event.clientX - drag.x, y: event.clientY - drag.y };
      print.style.translate = place.x + 'px ' + place.y + 'px';
      print.style.setProperty('--tilt', clamp((event.clientX - drag.last) * 0.8, 12) + 'deg');
      drag.last = event.clientX;
    });
    sticker.addEventListener('pointerup', drop);
    sticker.addEventListener('pointercancel', drop);
  }

  // Home projects: the hovered project's preview follows the pointer.
  var zone = document.querySelector('[data-previews]');
  var preview = zone && zone.querySelector('[data-preview]');
  if (preview && mouse && !still) {
    var key = '';
    var rest = 0;
    var show = function (next) {
      if (next === key) return;
      key = next;
      preview.toggleAttribute('data-on', key !== '');
      preview.querySelectorAll('[data-key]').forEach(function (image) {
        image.toggleAttribute('data-on', image.dataset.key === key);
      });
    };
    zone.addEventListener('pointermove', function (event) {
      var box = zone.getBoundingClientRect();
      var x = event.clientX - box.left;
      var width = preview.offsetWidth;
      var height = preview.offsetHeight;
      var y = Math.max(-16, Math.min(box.height - height + 16, event.clientY - box.top - height * 0.55));
      var row = event.target instanceof Element && event.target.closest('li[data-key]');
      preview.style.translate = (x + 32 + width > box.width ? x - 32 - width : x + 32) + 'px ' + y + 'px';
      preview.style.rotate = clamp(event.movementX * 0.5, 6) + 'deg';
      clearTimeout(rest);
      rest = setTimeout(function () {
        preview.style.rotate = '0deg';
      }, 120);
      show(row ? row.dataset.key : '');
    });
    zone.addEventListener('pointerleave', function () {
      show('');
    });
  }

  // The wordmark is also an API: try jewei.toString() in the console.
  window.jewei = {
    toString: function () {
      return 'Senior software engineer. Backend systems, useful tools, and notes from the work. → https://jewei.net/about/';
    },
  };
})();
