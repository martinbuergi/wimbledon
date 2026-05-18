/**
 * Hero block decoration — Wimbledon branded
 * Transforms a two-cell row (image | text) into a 60/40 side-by-side layout.
 * @param {Element} block
 */
export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const cols = [...row.children];
  if (cols.length < 2) {
    // Single column — full-bleed image hero (Museum/Foundation overlay variant)
    const [col] = cols;
    col.className = 'hero-image';
    return;
  }

  const [imageCol, textCol] = cols;

  // --- Image column ---
  imageCol.className = 'hero-image';

  // --- Text/content column ---
  textCol.className = 'hero-content';

  // Find the first <p> that contains only plain text (the eyebrow/category label)
  const allParas = [...textCol.querySelectorAll('p')];
  const firstPara = allParas[0];
  if (firstPara && !firstPara.querySelector('a') && firstPara.textContent.trim()) {
    firstPara.classList.add('hero-eyebrow');
  }

  // The h1 "The Championships, Wimbledon" is the site title — hide it; the h2 is the real headline
  const h1 = textCol.querySelector('h1');
  if (h1) {
    h1.classList.add('site-title');
  }

  // Find meta/timestamp paragraph (e.g. "6h ago • 1 min read")
  allParas.forEach((p) => {
    const text = p.textContent.trim();
    // Looks like a timestamp/meta if it contains "ago", "min read", or a date pattern
    if (!p.querySelector('a') && (text.includes('ago') || text.includes('min read') || /\d+(st|nd|rd|th)/.test(text))) {
      p.classList.add('hero-meta');
    }
  });
}
