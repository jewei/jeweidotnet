import type { Page } from 'playwright';

/**
 * Boxes and text that stick out of the viewport on the left or the right.
 *
 * `html` and `body` use `overflow-x: clip`, so `scrollWidth` never shows
 * overflow, and content to the left of x = 0 never scrolls anyway. This walks
 * the layout instead. A box that is inside a scroll or clip container (a code
 * block, a table, the header nav) is skipped: that container owns it. Only the
 * outermost offender is listed, not each of its children.
 *
 * Text is checked too: a word that cannot break (a long ID or URL) can run
 * past the edge of a box that itself fits. Each text run's line boxes are
 * measured, and its element is listed when they leave the viewport.
 */
export function findOverflow(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const clips = (el: Element) => getComputedStyle(el).overflowX !== 'visible';
    const contained = (el: Element) => {
      for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
        if (clips(node)) return true;
      }
      return false;
    };
    const outside = (box: DOMRect) => box.width > 0 && (box.left < -1 || box.right > width + 1);
    const name = (el: Element) =>
      el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') + [...el.classList].map((c) => `.${c}`).join('');
    const offenders: Element[] = [];
    const found: string[] = [];
    const report = (el: Element, left: number, right: number, what: string) => {
      if (offenders.some((offender) => offender.contains(el))) return;
      offenders.push(el);
      found.push(`${name(el)}${what} [${Math.round(left)}, ${Math.round(right)}] of ${width}`);
    };
    for (const el of document.body.querySelectorAll('*')) {
      const box = el.getBoundingClientRect();
      if (!box.width || !box.height || !outside(box) || contained(el)) continue;
      report(el, box.left, box.right, '');
    }
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const parent = node.parentElement;
      if (!parent || !node.textContent?.trim() || clips(parent) || contained(parent)) continue;
      range.selectNodeContents(node);
      const lines = Array.from(range.getClientRects()).filter(outside);
      if (!lines.length) continue;
      report(
        parent,
        Math.min(...lines.map((r) => r.left)),
        Math.max(...lines.map((r) => r.right)),
        ' (text)',
      );
    }
    return found;
  });
}
