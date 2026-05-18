import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;
  const cols = [...row.children];
  if (cols.length < 2) return;

  const [imageCol, textCol] = cols;

  // --- Background image cell ---
  imageCol.className = 'fwb-bg';
  const pic = imageCol.querySelector('picture');
  if (!pic) {
    // Unwrap img from p if needed
    const img = imageCol.querySelector('img');
    if (img) {
      const newPic = createOptimizedPicture(img.src, img.alt, true, [{ width: '2000' }]);
      imageCol.replaceChildren(newPic);
    }
  } else {
    // Optimize the picture for full-width use
    const img = pic.querySelector('img');
    if (img) {
      img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, true, [{ width: '2000' }]));
    }
  }

  // --- Content card cell ---
  textCol.className = 'fwb-card';

  // First <p> without a link → eyebrow
  const paras = [...textCol.querySelectorAll('p')];
  const eyebrow = paras.find((p) => !p.querySelector('a') && p.textContent.trim());
  if (eyebrow) eyebrow.className = 'fwb-eyebrow';

  // Last <p> with a link → CTA
  const ctaP = [...textCol.querySelectorAll('p')].reverse().find((p) => p.querySelector('a'));
  if (ctaP) ctaP.className = 'fwb-cta';
}
