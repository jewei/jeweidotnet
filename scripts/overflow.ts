import type { Page } from 'playwright';

/**
 * Boxes that stick out of the viewport on the left or the right.
 *
 * `html` and `body` use `overflow-x: clip`, so `scrollWidth` never shows
 * overflow, and content to the left of x = 0 never scrolls anyway. This walks
 * the layout instead. A box that is inside a scroll or clip container (a code
 * block, a table, the header nav) is skipped: that container owns it. Only the
 * outermost offender is listed, not each of its children.
 */
export function findOverflow(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const contained = (el: Element) => {
      for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
        if (getComputedStyle(node).overflowX !== 'visible') return true;
      }
      return false;
    };
    const name = (el: Element) =>
      el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') + [...el.classList].map((c) => `.${c}`).join('');
    const offenders: Element[] = [];
    const found: string[] = [];
    for (const el of document.body.querySelectorAll('*')) {
      const box = el.getBoundingClientRect();
      if (!box.width || !box.height) continue;
      if (box.left > -1 && box.right < width + 1) continue;
      if (contained(el) || offenders.some((offender) => offender.contains(el))) continue;
      offenders.push(el);
      found.push(`${name(el)} [${Math.round(box.left)}, ${Math.round(box.right)}] of ${width}`);
    }
    return found;
  });
}
