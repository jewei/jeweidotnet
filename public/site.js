// Site behaviour: theme toggle, code copy, home page motion. No dependencies.
// Loaded with `defer` on every page. With theme.js it must stay under 8 KB.
(function () {
  var root = document.documentElement;
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  // Read live: a visitor can turn on reduced motion while the page is open.
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');

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
    if (motion.matches || !document.startViewTransition) return setTheme(next);
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

  // Home portrait: the eyes follow the pointer and look where you tap. This
  // paints the portrait into each iris (the <img>'s own file, so it comes from
  // the cache; again when srcset swaps it), then sets --x and --y from -1 to 1
  // toward the last pointer position. CSS moves the irises, and hides them
  // with reduced motion. Off screen, nothing runs.
  var eyes = document.querySelector('[data-eyes]');
  var face = eyes && eyes.previousElementSibling;
  if (face) {
    var irises = eyes.querySelectorAll('image');
    var frame = 0;
    var seen = true;
    var at = null;
    var look = function () {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(function () {
        var x = 0;
        var y = 0;
        if (at && !motion.matches) {
          var box = eyes.getBoundingClientRect();
          x = at[0] - box.left - box.width * 0.51;
          y = at[1] - box.top - box.height * 0.43;
          var f = 1 / (Math.hypot(x, y) + box.width * 0.5);
          x *= f;
          y *= f;
        }
        eyes.style.setProperty('--x', x.toFixed(3));
        eyes.style.setProperty('--y', y.toFixed(3));
      });
    };
    var paint = function () {
      irises.forEach(function (iris) {
        iris.setAttribute('href', face.currentSrc || face.src);
      });
    };
    irises[0].addEventListener('load', function () {
      eyes.dataset.on = '';
    });
    face.addEventListener('load', paint);
    if (face.complete) paint();
    new IntersectionObserver(function (entries) {
      // A late callback can batch out-then-in: the last entry is the state now.
      seen = entries[entries.length - 1].isIntersecting;
      if (seen) look();
    }).observe(eyes);
    var aim = function (event) {
      at = [event.clientX, event.clientY];
      if (seen) look();
    };
    addEventListener('pointermove', aim);
    addEventListener('pointerdown', aim);
    addEventListener(
      'scroll',
      function () {
        if (seen && at) look();
      },
      { passive: true },
    );
    // Only a mouse leaving the page resets the gaze. A finger or a pen
    // "leaves" after every tap, so the eyes keep looking at the tap.
    root.addEventListener('pointerleave', function (event) {
      if (event.pointerType !== 'mouse') return;
      at = null;
      look();
    });
    motion.addEventListener('change', look);
  }

  // The wordmark is also an API: try jewei.toString() in the console.
  window.jewei = {
    toString: function () {
      return 'Senior software engineer. Backend systems, useful tools, and notes from the work. → https://jewei.net/about/';
    },
  };
})();
