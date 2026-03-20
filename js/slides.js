// ══════════════════════════════════════════════════════
//  SLIDE VIEWER
// ══════════════════════════════════════════════════════
(function initSlideViewer() {
  const SLIDES = Array.from({length: 27}, (_, i) => `slides/slide_${String(i+1).padStart(2,'0')}.jpg`);
  const TOTAL = SLIDES.length;
  let current = 0;

  const img = document.getElementById('slide-img');
  const counter = document.getElementById('slide-counter');
  const progressBar = document.getElementById('progress-bar');
  const thumbStrip = document.getElementById('thumb-strip');
  const btnFirst = document.getElementById('btn-first');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnLast = document.getElementById('btn-last');
  const progressWrap = document.getElementById('progress-wrap');

  // Build thumbnails
  SLIDES.forEach((src, i) => {
    const t = document.createElement('img');
    t.src = src;
    t.className = 'thumb' + (i === 0 ? ' active' : '');
    t.title = 'Slide ' + (i + 1);
    t.addEventListener('click', () => goTo(i));
    thumbStrip.appendChild(t);
  });

  function goTo(n, animate = true) {
    if (n < 0 || n >= TOTAL) return;
    if (animate) {
      img.classList.add('fading');
      setTimeout(() => {
        setSlide(n);
        img.classList.remove('fading');
      }, 200);
    } else {
      setSlide(n);
    }
  }

  function setSlide(n) {
    current = n;
    img.src = SLIDES[n];
    img.alt = 'Slide ' + (n + 1);
    counter.textContent = (n + 1) + ' / ' + TOTAL;
    progressBar.style.width = ((n + 1) / TOTAL * 100).toFixed(1) + '%';
    btnFirst.disabled = n === 0;
    btnPrev.disabled = n === 0;
    btnNext.disabled = n === TOTAL - 1;
    btnLast.disabled = n === TOTAL - 1;
    // Update thumbnails
    document.querySelectorAll('.thumb').forEach((t, i) => {
      t.classList.toggle('active', i === n);
    });
    // Scroll active thumb into view
    const activThumb = thumbStrip.children[n];
    if (activThumb) activThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  // Init
  setSlide(0);

  btnFirst.addEventListener('click', () => goTo(0));
  btnPrev.addEventListener('click', () => goTo(current - 1));
  btnNext.addEventListener('click', () => goTo(current + 1));
  btnLast.addEventListener('click', () => goTo(TOTAL - 1));

  // Progress bar click to jump
  progressWrap.addEventListener('click', e => {
    const pct = e.offsetX / progressWrap.offsetWidth;
    goTo(Math.floor(pct * TOTAL));
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); goTo(current - 1); }
    if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    if (e.key === 'End') { e.preventDefault(); goTo(TOTAL - 1); }
  });
})();