/* ========================================
   Freelance Video Game QA Tester
   Main JavaScript
   ======================================== */

$(function () {
  // --- Theme Toggle ---
  const $html = $('html');
  const savedTheme = localStorage.getItem('qa-theme') || 'dark';
  $html.attr('data-theme', savedTheme);

  function toggleTheme() {
    const current = $html.attr('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    $html.attr('data-theme', next);
    localStorage.setItem('qa-theme', next);
  }
  $(document).on('click', '#theme-toggle, #theme-toggle-m, #theme-toggle-sidebar', toggleTheme);

  // --- RTL Toggle ---
  const savedDir = localStorage.getItem('qa-dir') || 'ltr';
  $html.attr('dir', savedDir);

  function toggleRTL() {
    const current = $html.attr('dir');
    const next = current === 'ltr' ? 'rtl' : 'ltr';
    $html.attr('dir', next);
    localStorage.setItem('qa-dir', next);
  }
  $(document).on('click', '#rtl-toggle, #rtl-toggle-m, #rtl-toggle-sidebar', toggleRTL);

  // --- Mobile Drawer ---
  const $drawer = $('#mobile-drawer');
  const $overlay = $('#mobile-overlay');
  const $hamburger = $('#hamburger');

  function openDrawer() {
    $drawer.addClass('open');
    $overlay.addClass('open');
    $hamburger.addClass('active');
    $('body').css('overflow', 'hidden');
  }
  function closeDrawer() {
    $drawer.removeClass('open');
    $overlay.removeClass('open');
    $hamburger.removeClass('active');
    $('body').css('overflow', '');
  }

  $hamburger.on('click', function () {
    if ($drawer.hasClass('open')) closeDrawer(); else openDrawer();
  });
  $overlay.on('click', closeDrawer);
  $(document).on('click', '.mobile-nav a', closeDrawer);

  // --- Scroll Reveal ---
  function revealOnScroll() {
    const $reveals = $('.reveal');
    const wh = $(window).height();
    const scrollTop = $(window).scrollTop();
    $reveals.each(function () {
      const $el = $(this);
      if (scrollTop + wh * 0.88 > $el.offset().top) {
        $el.addClass('visible');
      }
    });
  }
  $(window).on('scroll resize', revealOnScroll);
  revealOnScroll();

  // --- Header Scroll Effect ---
  $(window).on('scroll', function () {
    if ($(window).scrollTop() > 60) {
      $('.site-header').addClass('scrolled');
    } else {
      $('.site-header').removeClass('scrolled');
    }
  });

  // --- FAQ Accordion ---
  $(document).on('click', '.faq-question', function () {
    const $item = $(this).closest('.faq-item');
    const isActive = $item.hasClass('active');
    $('.faq-item').removeClass('active');
    if (!isActive) $item.addClass('active');
  });

  // --- Password Toggle ---
  $(document).on('click', '.password-toggle', function () {
    const $input = $(this).siblings('input');
    const type = $input.attr('type') === 'password' ? 'text' : 'password';
    $input.attr('type', type);
    $(this).find('i, svg').toggleClass('icon-eye icon-eye-off');
  });

  // --- Smooth Scroll for Anchors ---
  $(document).on('click', 'a[href^="#"]', function (e) {
    const target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      $('html,body').animate({ scrollTop: target.offset().top - 80 }, 600);
    }
  });

  // --- Parallax Backgrounds ---
  $(window).on('scroll', function () {
    $('.parallax-bg').each(function () {
      const speed = $(this).data('speed') || 0.3;
      const yPos = -(($(window).scrollTop() - $(this).offset().top) * speed);
      $(this).css('transform', 'translateY(' + yPos + 'px)');
    });
  });

  // --- Counter Animation ---
  function animateCounter($el) {
    const target = parseInt($el.data('target'), 10);
    const duration = 2000;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const suffix = $el.data('suffix') || '';
      $el.text(Math.floor(ease * target).toLocaleString() + suffix);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter($(entry.target));
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  $('.counter').each(function () {
    counterObserver.observe(this);
  });

  // --- Particles Canvas (Home 2) ---
  function initParticles(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
    }
    resize();
    window.addEventListener('resize', resize);

    const count = Math.min(Math.floor(w * 0.08), 120);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.6,
        dy: (Math.random() - 0.5) * 0.6,
        color: Math.random() > 0.5 ? '#00f0ff' : '#8b5cf6'
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;
      });
      // Connect nearby
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = '#00f0ff';
            ctx.globalAlpha = 0.08 * (1 - dist / 100);
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }
  initParticles('particles-canvas');

  // --- Back to Top Button ---
  const $backToTop = $('<button class="back-to-top" aria-label="Back to Top"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg></button>');
  $('body').append($backToTop);

  $(window).on('scroll', function () {
    if ($(window).scrollTop() > 400) {
      $backToTop.addClass('show');
    } else {
      $backToTop.removeClass('show');
    }
  });

  $backToTop.on('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Current Nav Active State ---
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  $('.desktop-nav a, .mobile-nav a').each(function () {
    const href = $(this).attr('href');
    if (href && href.split('/').pop() === currentPage) {
      $(this).addClass('active');
    }
  });
});
