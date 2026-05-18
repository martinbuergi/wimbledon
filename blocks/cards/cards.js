import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div) => {
      // Case 1: div is only a picture — already an image column
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
        return;
      }

      // Case 2: DA output — picture wrapped in a <p> inside the content div
      const picP = div.querySelector('p:has(picture)') || div.querySelector('p > picture')?.closest('p');
      if (picP) {
        // Extract picture into its own sibling div before the text div
        const pic = picP.querySelector('picture');
        const imgDiv = document.createElement('div');
        imgDiv.className = 'cards-card-image';
        imgDiv.append(pic);
        // Insert image div before this text div in the li
        li.insertBefore(imgDiv, div);
        picP.remove();
      }

      div.className = 'cards-card-body';
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
