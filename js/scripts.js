/* Shared interactive scripts: mobile menu, FAQ, reveal-on-scroll, tilt+glare, parallax background */

// Mobile menu toggle (safe if element absent)
(function(){
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
      mobileNav.classList.toggle('flex');
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
        mobileNav.classList.remove('flex');
      });
    });
  }
})();

// FAQ accordion
(function(){
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const ans = other.querySelector('.faq-answer');
          if (ans) ans.style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
})();

// Reveal tiles when scrolling (staggered)
(function(){
  document.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('main .glass'));
    tiles.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 80}ms`;
    });

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    tiles.forEach(el => io.observe(el));
  });
})();

// Apple-like interactive tilt + glare on .glass tiles
(function(){
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if ('ontouchstart' in window) return; // skip on touch devices

  const maxTilt = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tilt-max')) || 12;
  const tiles = Array.from(document.querySelectorAll('main .glass'));
  tiles.forEach(tile => {
    tile.classList.add('interactive');
    const onMove = (e) => {
      const rect = tile.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const px = (x * 100).toFixed(2) + '%';
      const py = (y * 100).toFixed(2) + '%';
      const rotY = (x - 0.5) * maxTilt; // degrees
      const rotX = (0.5 - y) * maxTilt;
      const depth = 10;
      tile.style.setProperty('--px', px);
      tile.style.setProperty('--py', py);
      tile.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${depth}px) scale(1.02)`;
    };

    const onEnter = (e) => {
      tile.style.transition = 'transform 120ms linear';
      tile.addEventListener('pointermove', onMove);
    };

    const onLeave = () => {
      tile.removeEventListener('pointermove', onMove);
      tile.style.transform = '';
      tile.style.removeProperty('--px');
      tile.style.removeProperty('--py');
      tile.style.transition = '';
    };

    tile.addEventListener('pointerenter', onEnter);
    tile.addEventListener('pointerleave', onLeave);
    tile.addEventListener('pointercancel', onLeave);
  });
})();

// Parallax background: moves bg-photo slightly slower than scroll
(function(){
  const scroller = () => {
    const els = document.querySelectorAll('.bg-photo');
    if (!els.length) return;
    const y = window.scrollY;
    els.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.35;
      el.style.backgroundPosition = `center ${-y * speed}px`;
    });
  };
  window.addEventListener('scroll', scroller, { passive: true });
  window.addEventListener('resize', scroller);
  // init
  scroller();
})();
