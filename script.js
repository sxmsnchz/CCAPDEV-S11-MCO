/* for lightbox*/
const lightbox = document.getElementById('js-lightbox');
const lightboxImg = lightbox.querySelector('img');
const closeLightbox = lightbox.querySelector('.js-lightbox-close');

document.querySelectorAll('.lightbox-trigger').forEach(img => {
    img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.classList.remove('hidden');
    });
});

closeLightbox.addEventListener('click', () => {
    lightbox.classList.add('hidden');
    lightboxImg.src = '';
});

lightbox.addEventListener('click', e => {
    if (e.target === lightbox) {
        lightbox.classList.add('hidden');
        lightboxImg.src = '';
    }
});

/* for comments toggle*/

document.querySelectorAll('.comment-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const comments = btn.nextElementSibling;
        comments.classList.toggle('hidden');

        btn.textContent = comments.classList.contains('hidden')
            ? 'View comments'
            : 'Hide comments';
    });
});
