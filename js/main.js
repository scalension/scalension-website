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
  const filterSelect   = document.getElementById('course-filter-select');
  const clearFilterBtn = document.getElementById('clear-filter-btn');
  const resultsCount   = document.getElementById('filter-results-count');
  const courseGroups   = document.querySelectorAll('.course-group');

  if (filterSelect && courseGroups.length) {
    const updateFilter = (filterVal) => {
      filterSelect.value = filterVal;

      let visibleCount = 0;
      courseGroups.forEach(group => {
        const matches = filterVal === 'all' || group.dataset.category === filterVal;
        group.style.display = matches ? 'block' : 'none';
        if (matches) visibleCount++;
      });

      if (filterVal !== 'all') {
        const selectedOption = filterSelect.options[filterSelect.selectedIndex];
        const labelText = selectedOption ? selectedOption.textContent.replace(/^[^\w]+/, '').trim() : filterVal;
        if (clearFilterBtn) clearFilterBtn.style.display = 'inline-flex';
        if (resultsCount) resultsCount.textContent = `Showing: ${labelText}`;
      } else {
        if (clearFilterBtn) clearFilterBtn.style.display = 'none';
        if (resultsCount) resultsCount.textContent = 'Showing all categories';
      }
    };

    filterSelect.addEventListener('change', e => {
      updateFilter(e.target.value);
    });

    clearFilterBtn?.addEventListener('click', () => {
      updateFilter('all');
    });

    // Support data-filter buttons if clicked from external links/cards
    document.querySelectorAll('[data-filter]').forEach(btn => {
      if (btn.id !== 'course-filter-select') {
        btn.addEventListener('click', () => {
          const filter = btn.dataset.filter;
          if (filter) updateFilter(filter);
        });
      }
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
      const actionUrl = form.action;

      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      const showSuccess = () => {
        if (formWrapper) formWrapper.style.display = 'none';
        if (formSuccess) formSuccess.classList.add('show');
      };

      if (!actionUrl || actionUrl === window.location.href) {
        setTimeout(showSuccess, 1000);
        return;
      }

      const formData = new FormData(form);

      fetch(actionUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      })
      .then(() => {
        showSuccess();
      })
      .catch(err => {
        console.error('Submission error:', err);
        showSuccess();
      });
    });
  }

  /* ─── Career page: Copy email button ──────── */
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'contact@scalension.com';
      navigator.clipboard.writeText(email).then(() => {
        const originalHTML = copyEmailBtn.innerHTML;
        copyEmailBtn.innerHTML = '<i class="fa-solid fa-check" style="color:var(--clr-green);"></i> Copied!';
        setTimeout(() => {
          copyEmailBtn.innerHTML = originalHTML;
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy:', err);
      });
    });
  }

});



