// Custom cursor
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
  });

  function animateRing() {
    rx += (mx - rx - 18) * 0.12;
    ry += (my - ry - 18) * 0.12;
    cursorRing.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .card, .skill-tag, .btn, .stat-chip').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });

  // Scroll reveal
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section').forEach(s => observer.observe(s));

  // Hero glow follows mouse
  const glow = document.querySelector('.hero-glow');
  document.querySelector('.hero').addEventListener('mousemove', e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glow.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
  });

  // Skill tag hover ripple
  document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      tag.style.background = 'rgba(79,142,247,0.35)';
      setTimeout(() => tag.style.background = '', 400);
    });
  });

  // Typing animation for hero role
  const roleEl = document.querySelector('.hero-role');
  const roleText = roleEl.textContent;
  roleEl.textContent = '$ ';
  let i = 2;
  function typeRole() {
    if (i < roleText.length) {
      roleEl.textContent += roleText[i];
      i++;
      setTimeout(typeRole, 40);
    }
  }
  setTimeout(typeRole, 1200);

  // Staggered card animations
  document.querySelectorAll('.project-card, .edu-card, .contact-link, .skill-category').forEach((el, i) => {
    el.style.animationDelay = `${i * 0.08}s`;
  });

  // Counter animation for stats
  function animateCounter(el, target, suffix = '') {
    let current = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = (Number.isInteger(target) ? Math.round(current) : current.toFixed(1)) + suffix;
      if (current >= target) clearInterval(timer);
    }, 30);
  }

  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('.stat-num');
        nums[0] && animateCounter(nums[0], 8.7);
        nums[1] && animateCounter(nums[1], 2, '+');
        nums[2] && animateCounter(nums[2], 500, '+');
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const avatarCard = document.querySelector('.avatar-card');
  if (avatarCard) statObserver.observe(avatarCard);