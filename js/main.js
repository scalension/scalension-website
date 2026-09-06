/* ==========================================================================
   SCALENSION — Main JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Theme Toggle Logic ───────────────────── */
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const target = current === 'dark' ? 'light' : 'dark';
      setTheme(target);
    });
  });

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

  /* ─── Unified Career Form Logic ────────────── */
  const unifiedForm   = document.getElementById('unified-application-form');
  const roleSelect    = document.getElementById('app-role');
  const skillsLabel   = document.getElementById('skills-label-text');
  const skillsInput   = document.getElementById('app-skills');
  const cvFileInput   = document.getElementById('app-cv-file');
  const cvUploadBox   = document.getElementById('file-upload-box');
  const cvUploadText  = document.getElementById('file-upload-text');
  const cvRemoveBtn   = document.getElementById('file-remove-btn');

  // Dynamic Role Selection adjustments
  if (roleSelect) {
    roleSelect.addEventListener('change', () => {
      const roleVal = roleSelect.value;
      if (roleVal.includes('Educator') || roleVal.includes('Mentor')) {
        if (skillsLabel) skillsLabel.textContent = 'Teaching Subject / Areas of Expertise';
        if (skillsInput) skillsInput.placeholder = 'e.g. Python, Machine Learning, AWS, System Design';
      } else if (roleVal.includes('Designer')) {
        if (skillsLabel) skillsLabel.textContent = 'Design Tools & Specialty';
        if (skillsInput) skillsInput.placeholder = 'e.g. Figma, UI/UX, Motion Design, Design Systems';
      } else {
        if (skillsLabel) skillsLabel.textContent = 'Key Tech Stack / Expertise';
        if (skillsInput) skillsInput.placeholder = 'e.g. React, Node.js, Python, AWS, Docker';
      }
    });
  }

  // File Upload Preview & Reset
  if (cvFileInput && cvUploadBox && cvUploadText) {
    cvFileInput.addEventListener('change', () => {
      const file = cvFileInput.files[0];
      if (file) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        cvUploadText.textContent = `📄 ${file.name} (${sizeMB} MB)`;
        cvUploadBox.classList.add('has-file');
        if (cvRemoveBtn) cvRemoveBtn.style.display = 'inline-block';
      }
    });

    if (cvRemoveBtn) {
      cvRemoveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cvFileInput.value = '';
        cvUploadText.textContent = 'Upload Resume (PDF, DOC, DOCX - max 10MB)';
        cvUploadBox.classList.remove('has-file');
        cvRemoveBtn.style.display = 'none';
      });
    }
  }

  // Unified Form Submission
  if (unifiedForm) {
    unifiedForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = unifiedForm.querySelector('.form-submit');

      const hasFile = cvFileInput && cvFileInput.files.length > 0;
      if (!hasFile) {
        alert('Please upload your CV / Resume file (PDF, DOC, or DOCX).');
        return;
      }

      btn.textContent = 'Submitting Application…';
      btn.disabled = true;

      setTimeout(() => {
        const wrapper = unifiedForm.closest('.form-wrapper');
        const success = unifiedForm.closest('.form-card')?.querySelector('.form-success');
        if (wrapper) wrapper.style.display = 'none';
        if (success) success.classList.add('show');
      }, 1200);
    });
  }

  /* ─── Career page: role pre-select pills ──── */
  document.querySelectorAll('[data-role]').forEach(pill => {
    pill.addEventListener('click', e => {
      const role = pill.getAttribute('data-role');
      if (roleSelect && role) {
        roleSelect.value = role;
        roleSelect.dispatchEvent(new Event('change'));
      }
      const formCard = document.getElementById('apply-card');
      if (formCard) {
        formCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

});



