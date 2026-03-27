/* ═══════════════════════════════════════════════════ */
/*  THERAPY IS BROWN — Interactions & Animations        */
/* ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initNavigation();
  initCarousel();
  initTreeAnimation();
  initSmoothScroll();
});


/* ─────────────────────────────────────────────── */
/*  SCROLL REVEAL                                   */
/* ─────────────────────────────────────────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
}


/* ─────────────────────────────────────────────── */
/*  NAVIGATION                                      */
/* ─────────────────────────────────────────────── */
function initNavigation() {
  const nav = document.getElementById('nav');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  let lastScroll = 0;

  // Scroll behavior — frosted glass effect
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });

  // Mobile menu toggle
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('is-open');
      
      // Animate hamburger to X
      const spans = mobileToggle.querySelectorAll('span');
      if (mobileMenu.classList.contains('is-open')) {
        spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close mobile menu when link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }
}


/* ─────────────────────────────────────────────── */
/*  CAROUSEL                                        */
/* ─────────────────────────────────────────────── */
function initCarousel() {
  const track = document.querySelector('.carousel__track');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');
  
  if (!track) return;

  const slides = track.querySelectorAll('.carousel__slide');
  const slideCount = slides.length;
  let currentIndex = 0;
  let autoPlayInterval;

  // Calculate visible slides
  function getVisibleSlides() {
    const trackWidth = track.offsetWidth;
    const slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(track).gap);
    return Math.floor(trackWidth / slideWidth) || 1;
  }

  // Create dots
  function createDots() {
    dotsContainer.innerHTML = '';
    const dotCount = slideCount;
    for (let i = 0; i < dotCount; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => scrollToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  // Update active dot
  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.carousel__dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentIndex);
    });
  }

  // Scroll to specific slide
  function scrollToSlide(index) {
    if (index < 0) index = 0;
    if (index >= slideCount) index = slideCount - 1;
    currentIndex = index;

    const slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(track).gap);
    track.scrollTo({
      left: slideWidth * index,
      behavior: 'smooth'
    });

    updateDots();
  }

  // Track scroll position to update dots
  track.addEventListener('scroll', () => {
    const slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(track).gap);
    const scrollPos = track.scrollLeft;
    const newIndex = Math.round(scrollPos / slideWidth);
    if (newIndex !== currentIndex) {
      currentIndex = newIndex;
      updateDots();
    }
  }, { passive: true });

  // Button controls
  prevBtn?.addEventListener('click', () => {
    scrollToSlide(currentIndex - 1);
    resetAutoPlay();
  });

  nextBtn?.addEventListener('click', () => {
    scrollToSlide(currentIndex + 1);
    resetAutoPlay();
  });

  // Auto-play (slow, ambient)
  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      if (currentIndex >= slideCount - getVisibleSlides()) {
        scrollToSlide(0);
      } else {
        scrollToSlide(currentIndex + 1);
      }
    }, 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  // Pause on hover/focus
  track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
  track.addEventListener('mouseleave', startAutoPlay);
  track.addEventListener('focusin', () => clearInterval(autoPlayInterval));
  track.addEventListener('focusout', startAutoPlay);

  // Initialize
  createDots();
  startAutoPlay();

  // Keyboard navigation
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      scrollToSlide(currentIndex - 1);
      resetAutoPlay();
    } else if (e.key === 'ArrowRight') {
      scrollToSlide(currentIndex + 1);
      resetAutoPlay();
    }
  });
}


/* ─────────────────────────────────────────────── */
/*  TREE ANIMATION                                  */
/* ─────────────────────────────────────────────── */
function initTreeAnimation() {
  const treeIllustration = document.querySelector('.tree-illustration');
  if (!treeIllustration) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        treeIllustration.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });

  observer.observe(treeIllustration);
}


/* ─────────────────────────────────────────────── */
/*  SMOOTH SCROLL                                   */
/* ─────────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = document.getElementById('nav').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}


/* ─────────────────────────────────────────────── */
/*  PARALLAX HERO (subtle, performance-safe)        */
/* ─────────────────────────────────────────────── */
(function initHeroParallax() {
  const hero = document.querySelector('.hero');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const roots = hero.querySelector('.hero__roots');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    const heroHeight = hero.offsetHeight;

    if (scrollY < heroHeight) {
      const progress = scrollY / heroHeight;
      if (roots) {
        roots.style.transform = `translateY(${progress * -30}px)`;
      }
    }
  }, { passive: true });
})();
