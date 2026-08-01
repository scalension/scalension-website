/* ============================================
   SCALEVE — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Navbar scroll ──────────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ─── Mobile menu ───────────────────────── */
  const menuToggle   = document.querySelector('.menu-toggle');
  const mobileNav    = document.querySelector('.mobile-nav');
  const mobileOverlay= document.querySelector('.mobile-overlay');
  const mobileClose  = document.querySelector('.mobile-nav-close');

  const openMenu  = () => { mobileNav?.classList.add('open');    mobileOverlay?.classList.add('open'); };
  const closeMenu = () => { mobileNav?.classList.remove('open'); mobileOverlay?.classList.remove('open'); };

  menuToggle?.addEventListener('click', openMenu);
  mobileClose?.addEventListener('click', closeMenu);
  mobileOverlay?.addEventListener('click', closeMenu);

  /* ─── Active nav link ────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ─── Scroll reveal ──────────────────────── */
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  // Stagger children inside .stagger-group
  document.querySelectorAll('.stagger-group').forEach(group => {
    Array.from(group.children).forEach((child, i) => {
      child.classList.add('reveal');
      child.style.transitionDelay = `${i * 0.09}s`;
    });
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* ─── Course category filter (courses.html) ─ */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const courseGroups = document.querySelectorAll('.course-group');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        courseGroups.forEach(group => {
          const show = filter === 'all' || group.dataset.category === filter;
          group.style.display = show ? 'block' : 'none';
        });
      });
    });
  }

  /* ─── Roadmap accordion ─────────────────── */
  document.querySelectorAll('.course-card').forEach(card => {
    const btn       = card.querySelector('.roadmap-toggle-btn');
    const toggleTxt = card.querySelector('.toggle-text');
    const toggleIco = card.querySelector('.toggle-icon');

    btn?.addEventListener('click', e => {
      e.stopPropagation();
      const opening = !card.classList.contains('open');

      // Close all
      document.querySelectorAll('.course-card.open').forEach(c => {
        c.classList.remove('open');
        const t = c.querySelector('.toggle-text');
        const i = c.querySelector('.toggle-icon');
        if (t) t.textContent = 'View Roadmap';
        if (i) i.textContent = '↓';
      });

      if (opening) {
        card.classList.add('open');
        if (toggleTxt) toggleTxt.textContent = 'Hide Roadmap';
        if (toggleIco) toggleIco.textContent = '↑';

        // Smooth scroll card into view
        setTimeout(() => {
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 80);
      }
    });
  });

  /* ─── Enquiry form ───────────────────────── */
  const form        = document.getElementById('enquiry-form');
  const formWrapper = document.querySelector('.form-wrapper');
  const formSuccess = document.querySelector('.form-success');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const submitBtn = form.querySelector('.form-submit');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        if (formWrapper) formWrapper.style.display = 'none';
        if (formSuccess) formSuccess.classList.add('show');
      }, 1200);
    });
  }

  /* ─── Career forms (teach + build) ──────── */
  ['teach-form', 'build-form'].forEach(formId => {
    const careerForm = document.getElementById(formId);
    if (!careerForm) return;

    careerForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = careerForm.querySelector('.form-submit');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        const wrapper = careerForm.closest('.form-wrapper');
        const success = careerForm.closest('.form-card')?.querySelector('.form-success');
        if (wrapper) wrapper.style.display = 'none';
        if (success) success.classList.add('show');
      }, 1200);
    });
  });

  /* ─── Career page: smooth scroll pills ──── */
  document.querySelectorAll('.career-pill[href^="#"]').forEach(pill => {
    pill.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(pill.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

});

