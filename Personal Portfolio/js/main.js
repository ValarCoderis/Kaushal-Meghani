/**
 * Main Application Logic
 * Kaushal Meghani — Personal Portfolio
 * Engineering Notebook × Modern Lab × Personal Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -----------------------------------------------------------------
  // 1. Navigation — ScrollSpy & Scroll Styling
  // -----------------------------------------------------------------
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const navbarWrapper = document.getElementById('navbar-wrapper');
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileMenu = document.querySelector('.mobile-menu');

  // Navbar background on scroll
  function updateNavbar() {
    if (!navbarWrapper) return;
    if (window.scrollY > 40) {
      navbarWrapper.classList.add('scrolled');
    } else {
      navbarWrapper.classList.remove('scrolled');
    }
  }

  // Mobile menu toggle
  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const isExpanded = mobileMenu.classList.contains('open');
      hamburgerBtn.setAttribute('aria-expanded', isExpanded);
    });

    document.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ScrollSpy — highlight active nav link
  function updateScrollSpy() {
    const scrollPos = window.scrollY + 200;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', () => {
    updateNavbar();
    updateScrollSpy();
  }, { passive: true });

  updateNavbar();
  updateScrollSpy();

  // -----------------------------------------------------------------
  // 2. Scroll Reveal — IntersectionObserver
  // -----------------------------------------------------------------
  if (!prefersReducedMotion) {
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // If reduced motion, make everything visible immediately
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('visible');
    });
  }

  // -----------------------------------------------------------------
  // 3. Project Screenshot & Media Switchers
  // -----------------------------------------------------------------
  const screenshotFrames = document.querySelectorAll('.project-visual');

  screenshotFrames.forEach((frame) => {
    const mainImg = frame.querySelector('.screenshot-img');
    const tabs = frame.querySelectorAll('.screenshot-tab-btn');
    const photoView = frame.querySelector('#st-photo-view');
    const videoView = frame.querySelector('#st-video-view');
    const videoPlayer = frame.querySelector('#st-video-player');
    const urlLabel = frame.querySelector('#st-media-url');

    if (!tabs.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const viewType = tab.getAttribute('data-view');

        if (viewType === 'video' && videoView && photoView) {
          photoView.style.display = 'none';
          videoView.style.display = 'block';
          if (urlLabel) urlLabel.textContent = 'solartrack / mechanism-demonstration.mp4';
        } else if (viewType === 'photo' && videoView && photoView) {
          videoView.style.display = 'none';
          if (videoPlayer) videoPlayer.pause();
          photoView.style.display = 'block';
          if (urlLabel) urlLabel.textContent = 'solartrack / hardware-prototype.png';
        } else if (mainImg) {
          const newSrc = tab.getAttribute('data-src');
          const altText = tab.getAttribute('data-alt');

          if (newSrc) {
            mainImg.style.opacity = '0.4';
            setTimeout(() => {
              mainImg.src = newSrc;
              if (altText) mainImg.alt = altText;
              mainImg.style.opacity = '1';
            }, 150);
          }
        }
      });
    });
  });

  // -----------------------------------------------------------------
  // 4. Lightbox Modal
  // -----------------------------------------------------------------
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close-btn');

  function openLightbox(src, caption) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = caption || '';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  document.querySelectorAll('[data-zoomable]').forEach((el) => {
    el.style.cursor = 'zoom-in';
    el.addEventListener('click', () => {
      const src = el.getAttribute('src') || el.querySelector('img')?.getAttribute('src');
      const caption = el.getAttribute('data-caption') || el.getAttribute('alt') || '';
      if (src) openLightbox(src, caption);
    });
  });

  // -----------------------------------------------------------------
  // 5. Copy Email
  // -----------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyToast = document.getElementById('copy-toast');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'kaushalmeghani60@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        if (copyToast) {
          copyToast.classList.add('show');
          setTimeout(() => {
            copyToast.classList.remove('show');
          }, 2400);
        }
      }).catch(() => {
        prompt('Copy email:', email);
      });
    });
  }

  // -----------------------------------------------------------------
  // 6. Smooth scroll for anchor links
  // -----------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbarWrapper ? navbarWrapper.offsetHeight : 72;
        const targetPosition = targetEl.offsetTop - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  });
});
