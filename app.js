/**
 * KAUSHAL TANNA — PORTFOLIO JAVASCRIPT
 * Features:
 * - Fluid Custom Cursor with LERP interpolation
 * - Dynamic data-target Counter Animations
 * - Terminal Typing Effect for Hero
 * - Section Scroll Reveal (IntersectionObserver)
 * - Active Navigation Link Tracking
 * - Mobile Navigation Drawer Controller
 * - Mouse-following Ambient Spotlight
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. CUSTOM CURSOR (Desktop only)
  // ==========================================
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (cursor && cursorRing && isFinePointer) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isMoving = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      if (!isMoving) {
        isMoving = true;
        cursor.style.opacity = '1';
        cursorRing.style.opacity = '1';
      }
    });

    // Smooth trailing ring using linear interpolation (LERP)
    function animateRing() {
      ringX += (mouseX - ringX - 17) * 0.15;
      ringY += (mouseY - ringY - 17) * 0.15;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(animateRing);
    }
    requestAnimationFrame(animateRing);

    // Expand cursor ring on interactive elements
    const interactiveSelectors = 'a, button, .btn, .stat-chip, .skill-tag, .project-card, .cert-card, .contact-link';
    document.querySelectorAll(interactiveSelectors).forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorRing.style.opacity = '0';
      isMoving = false;
    });
  }

  // ==========================================
  // 2. HERO TERMINAL TYPING EFFECT
  // ==========================================
  const roleEl = document.getElementById('heroRole');
  if (roleEl) {
    const fullText = roleEl.textContent.trim();
    roleEl.textContent = '$ ';
    let charIndex = 2; // Keep the '$ ' prefix

    function typeCharacter() {
      if (charIndex < fullText.length) {
        roleEl.textContent += fullText.charAt(charIndex);
        charIndex++;
        setTimeout(typeCharacter, 38);
      }
    }
    setTimeout(typeCharacter, 600);
  }

  // ==========================================
  // 3. MOUSE-TRACKING HERO GLOW
  // ==========================================
  const heroSection = document.querySelector('.hero');
  const heroGlow = document.querySelector('.hero-glow');

  if (heroSection && heroGlow && isFinePointer) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      heroGlow.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
    });
  }

  // ==========================================
  // 4. SCROLL REVEAL (IntersectionObserver)
  // ==========================================
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.section').forEach((section) => {
    sectionObserver.observe(section);
  });

  // ==========================================
  // 5. DECOUPLED STAT COUNTERS
  // ==========================================
  function animateCounter(el, target, decimals = 0, suffix = '') {
    let current = 0;
    const duration = 1200; // ms
    const startTime = performance.now();

    function updateCounter(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quartic
      const easeProgress = 1 - Math.pow(1 - progress, 4);

      current = target * easeProgress;
      el.textContent = current.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
      }
    }
    requestAnimationFrame(updateCounter);
  }

  const statsContainer = document.getElementById('statsContainer');
  if (statsContainer) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stat-num').forEach((numEl) => {
            const target = parseFloat(numEl.dataset.target) || 0;
            const decimals = parseInt(numEl.dataset.decimals, 10) || 0;
            const suffix = numEl.dataset.suffix || '';
            animateCounter(numEl, target, decimals, suffix);
          });
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    statObserver.observe(statsContainer);
  }

  // ==========================================
  // 6. ACTIVE NAVIGATION LINK ON SCROLL
  // ==========================================
  const navSections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 140;

    navSections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        desktopNavLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ==========================================
  // 7. MOBILE MENU TOGGLE
  // ==========================================
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (menuToggle && mobileDrawer) {
    const toggleMenu = () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen.toString());
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Close when clicking mobile link
    document.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close drawer when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !mobileDrawer.contains(e.target) && mobileDrawer.classList.contains('open')) {
        mobileDrawer.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ==========================================
  // 8. INTERACTIVE SKILL TAG RIPPLE EFFECT
  // ==========================================
  document.querySelectorAll('.skill-tag').forEach((tag) => {
    tag.addEventListener('click', () => {
      tag.style.transform = 'scale(0.92)';
      tag.style.background = 'rgba(79, 142, 247, 0.4)';
      setTimeout(() => {
        tag.style.transform = '';
        tag.style.background = '';
      }, 250);
    });
  });

});
