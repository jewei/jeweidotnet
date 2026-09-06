var codeCopyTimers = new WeakMap();

function setCodeCopyState(button, state, label) {
  if (!button.dataset.copyAccessibleName) {
    button.dataset.copyAccessibleName = button.getAttribute('aria-label') || 'Copy code';
  }
  button.dataset.copyState = state;
  button.setAttribute(
    'aria-label',
    state === 'idle' ? button.dataset.copyAccessibleName : `${label}. ${button.dataset.copyAccessibleName}`,
  );
  var labelElement = button.querySelector('[data-copy-label]');
  if (labelElement) labelElement.textContent = label;
}

async function copyCodeText(value) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch (_error) {
      // Continue to the selection fallback. Some browsers expose the API but
      // deny access outside a direct permission grant.
    }
  }

  var input = document.createElement('textarea');
  input.value = value;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.inset = '0 auto auto -9999px';
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.select();
  input.setSelectionRange(0, input.value.length);

  var copyCommand = Reflect.get(document, 'execCommand');
  var copied = typeof copyCommand === 'function' && copyCommand.call(document, 'copy');
  input.remove();

  if (!copied) throw new Error('Clipboard copy failed');
}

document.addEventListener('click', async function (event) {
  var target = event.target;
  if (!(target instanceof Element)) return;

  var button = target.closest('[data-code-copy]');
  if (!(button instanceof HTMLButtonElement)) return;

  var block = button.closest('[data-code-block]');
  var code = block && block.querySelector('pre code');
  if (!code) return;

  var previousTimer = codeCopyTimers.get(button);
  if (previousTimer) window.clearTimeout(previousTimer);

  try {
    await copyCodeText(code.textContent || '');
    setCodeCopyState(button, 'success', 'Copied');
  } catch (_error) {
    setCodeCopyState(button, 'error', 'Try again');
  }

  var timer = window.setTimeout(function () {
    setCodeCopyState(button, 'idle', 'Copy');
    codeCopyTimers.delete(button);
  }, 1800);
  codeCopyTimers.set(button, timer);
});
