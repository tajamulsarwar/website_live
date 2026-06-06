/* ============================================
   WESTERN GB TRAVEL & TOURS - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Preloader ----------
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
      }, 800);
    });
    // Fallback: hide after 3s anyway
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 3000);
  }

  // ---------- Navbar Scroll Effect ----------
  const navbar = document.querySelector('.navbar');
  const scrollTop = document.querySelector('.scroll-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar background
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Scroll to top button
    if (scrollTop) {
      if (scrollY > 400) {
        scrollTop.classList.add('visible');
      } else {
        scrollTop.classList.remove('visible');
      }
    }
  });

  // Scroll to top click
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Mobile Menu ----------
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navLinksAll = document.querySelectorAll('.nav-links a');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinksAll.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !hamburger.contains(e.target) && navLinks.classList.contains('active')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ---------- Active Nav Link ----------
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinksAll.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---------- Scroll Reveal Animation ----------
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-3d, .reveal-flip, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---------- Counter Animation ----------
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const countTo = parseInt(target.getAttribute('data-count'));
        const suffix = target.getAttribute('data-suffix') || '';
        const duration = 2000;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(easeOut * countTo);
          target.textContent = current.toLocaleString() + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            target.textContent = countTo.toLocaleString() + suffix;
          }
        };

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // ---------- 3D Tilt Effect on Cards ----------
  const tiltCards = document.querySelectorAll('.hover-3d');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -8;
      const rotateY = (x - centerX) / centerX * 8;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });

  // ---------- Smooth Scroll for Anchor Links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- Image Lazy Loading Fallback ----------
  if ('loading' in HTMLImageElement.prototype) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  }

  // ---------- Testimonial Auto Scroll ----------
  const slider = document.querySelector('.testimonials-slider');
  if (slider) {
    let scrollAmount = 0;
    const scrollStep = 410;
    let autoScroll;

    const startAutoScroll = () => {
      autoScroll = setInterval(() => {
        scrollAmount += scrollStep;
        if (scrollAmount >= slider.scrollWidth - slider.clientWidth) {
          scrollAmount = 0;
        }
        slider.scrollTo({ left: scrollAmount, behavior: 'smooth' });
      }, 4000);
    };

    startAutoScroll();

    slider.addEventListener('mouseenter', () => clearInterval(autoScroll));
    slider.addEventListener('mouseleave', startAutoScroll);
  }

});
