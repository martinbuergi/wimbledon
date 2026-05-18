import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      // detect when picture is inside a <p> wrapper (DA output style)
      else if (div.querySelector('p > picture, p:has(picture)')) {
        // unwrap picture from <p>
        const picP = div.querySelector('p:has(picture)');
        if (picP) {
          const pic = picP.querySelector('picture');
          const imgDiv = document.createElement('div');
          imgDiv.className = 'cards-card-image';
          imgDiv.append(pic);
          div.insertBefore(imgDiv, picP);
          picP.remove();
        }
        div.className = 'cards-card-body';
      } else div.className = 'cards-card-body';
    });
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

  block.replaceChildren(ul);

  // Classify variant based on content
  const hasImages = block.querySelector('.cards-card-image');
  const isInTicketSection = block.closest('.section')?.querySelector('h2')?.textContent?.toLowerCase().includes('ticket');

  if (isInTicketSection) {
    block.classList.add('ticket-cards');
  } else if (!hasImages) {
    block.classList.add('text-cards');
  }
}
