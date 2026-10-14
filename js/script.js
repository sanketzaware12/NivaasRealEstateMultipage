/* =========================================================
   Nivaas Property Advisors - shared interactions (vanilla JS)
   Every block checks that its elements exist, so this one file
   works on all five pages.
   ========================================================= */

/* ---------- CONFIG: replace with real details ---------- */
const CONFIG = {
  // Digits only, with country code. Example: "919812345678"
  whatsappNumber: '910000000000',
  placeholderNumber: '910000000000'
};

(function () {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const whatsappConfigured = CONFIG.whatsappNumber !== CONFIG.placeholderNumber;
  const params = new URLSearchParams(window.location.search);

  /* ---------- Icons + footer year ---------- */
  if (window.lucide) window.lucide.createIcons();
  $$('.js-year').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- WhatsApp links ---------- */
  function whatsappUrl(text) {
    const base = 'https://wa.me/' + CONFIG.whatsappNumber;
    return text ? base + '?text=' + encodeURIComponent(text) : base;
  }
  if (whatsappConfigured) {
    $$('[data-whatsapp]').forEach((link) => {
      link.href = whatsappUrl('Hello, I would like to talk about a property.');
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
  }

  /* ---------- Header: scrolled state, progress bar, back to top ---------- */
  const header = $('#site-header');
  const backToTop = $('#back-to-top');
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 16);
    if (backToTop) backToTop.classList.toggle('is-visible', y > 700);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.style.setProperty('--p', max > 0 ? Math.min(y / max, 1).toFixed(4) : 0);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  }

  /* ---------- Mobile menu ---------- */
  const menuToggle = $('#menu-toggle');
  const mobileMenu = $('#mobile-menu');
  if (menuToggle && mobileMenu) {
    const iconOpen = $('.icon-open', menuToggle);
    const iconClose = $('.icon-close', menuToggle);
    const setMenu = (open) => {
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      header.classList.toggle('menu-open', open);
      iconOpen.classList.toggle('hidden', open);
      iconClose.classList.toggle('hidden', !open);
      if (open) {
        mobileMenu.hidden = false;
        requestAnimationFrame(() => { mobileMenu.dataset.open = 'true'; });
      } else {
        mobileMenu.dataset.open = 'false';
        window.setTimeout(() => {
          if (menuToggle.getAttribute('aria-expanded') === 'false') mobileMenu.hidden = true;
        }, 250);
      }
    };
    menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') { setMenu(false); menuToggle.focus(); }
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  }

  /* ---------- Soft fade between pages ---------- */
  if (!reduceMotion) {
    $$('a[href$=".html"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || link.target === '_blank') return;
        const url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
        e.preventDefault();
        document.body.classList.add('is-leaving');
        window.setTimeout(() => { window.location.href = link.href; }, 200);
      });
    });
    window.addEventListener('pageshow', (e) => { if (e.persisted) document.body.classList.remove('is-leaving'); });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = $$('[data-reveal]');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('reveal-in');
        observer.unobserve(el);
        // Clean up afterwards so hover transitions on cards work normally.
        window.setTimeout(() => {
          el.classList.remove('reveal-init', 'reveal-in', 'reveal-d1', 'reveal-d2', 'reveal-d3', 'reveal-d4', 'rv-left', 'rv-right', 'rv-zoom');
        }, 1300);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el) => {
      const kind = el.dataset.reveal;
      el.classList.add('reveal-init');
      if (kind && kind !== 'up' && kind !== '') el.classList.add('rv-' + kind);
      if (el.dataset.delay) el.classList.add('reveal-d' + el.dataset.delay);
      revealObserver.observe(el);
    });
  }

  /* ---------- Process steps: draw the connector when visible ---------- */
  $$('.steps').forEach((stepsEl) => {
    if (!('IntersectionObserver' in window)) { stepsEl.classList.add('in-view'); return; }
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); o.unobserve(entry.target); } });
    }, { threshold: 0.25 });
    obs.observe(stepsEl);
  });

  /* ---------- Count-up numbers ---------- */
  const counters = $$('[data-count]');
  function runCounter(el) {
    const end = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = end + suffix; return; }
    const duration = 1600;
    const start = performance.now();
    (function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(end * eased) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      const cObs = new IntersectionObserver((entries, o) => {
        entries.forEach((entry) => { if (entry.isIntersecting) { runCounter(entry.target); o.unobserve(entry.target); } });
      }, { threshold: 0.6 });
      counters.forEach((el) => cObs.observe(el));
    } else {
      counters.forEach(runCounter);
    }
  }

  /* ---------- Tilt + spotlight on cards (mouse only) ---------- */
  if (canHover && !reduceMotion) {
    $$('[data-tilt]').forEach((card) => {
      card.classList.add('tilt');
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--rx', ((x - 0.5) * 8).toFixed(2) + 'deg');
        card.style.setProperty('--ry', ((0.5 - y) * 8).toFixed(2) + 'deg');
        card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------- Image fallback ---------- */
  $$('img').forEach((img) => {
    const onFail = () => {
      const frame = img.closest('.prop-media, .arch-frame, .about-frame');
      if (frame) frame.classList.add('img-fallback');
    };
    img.addEventListener('error', onFail);
    if (img.complete && img.naturalWidth === 0) onFail();
  });

  /* ---------- Home: search panel sends you to the Projects page ---------- */
  const searchForm = $('#search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = new URLSearchParams();
      ['purpose', 'type', 'location', 'budget'].forEach((k) => {
        const v = $('#s-' + k).value;
        if (v !== 'any') q.set(k, v);
      });
      window.location.href = 'projects.html' + (q.toString() ? '?' + q.toString() : '') + '#listings';
    });
  }

  /* ---------- Projects: filtering + favourites ---------- */
  const grid = $('#property-grid');
  if (grid) {
    const cards = $$('.prop-card', grid);
    const pills = $$('.filter-pill');
    const resultCount = $('#result-count');
    const emptyState = $('#empty-state');
    const emptyTitle = $('#empty-title');
    const emptyText = $('#empty-text');
    const filters = { purpose: 'any', type: 'any', location: 'any', budget: 'any' };

    ['purpose', 'type', 'location', 'budget'].forEach((k) => {
      const v = params.get(k);
      const sel = $('#f-' + k);
      if (!v || (k !== 'purpose' && !sel)) return;
      const ok = k === 'purpose' ? ['buy', 'rent', 'sell'].includes(v) : Array.from(sel.options).some((o) => o.value === v);
      if (ok) filters[k] = v;
    });

    const matches = (card) => {
      const d = card.dataset;
      if (filters.purpose !== 'any' && d.purpose !== filters.purpose) return false;
      if (filters.type !== 'any' && d.type !== filters.type) return false;
      if (filters.location !== 'any' && filters.location !== 'pune' && d.location !== filters.location) return false;
      // Rentals are priced monthly, so purchase budget bands do not apply to them.
      if (filters.budget !== 'any' && d.purpose !== 'rent' && d.budget !== filters.budget) return false;
      return true;
    };

    function applyFilters(animate) {
      const sellOnly = filters.purpose === 'sell';
      let visible = 0;
      cards.forEach((card) => {
        const show = !sellOnly && matches(card);
        card.classList.toggle('is-filtered-out', !show);
        card.classList.remove('pop-in');
        if (show) {
          visible += 1;
          if (animate && !reduceMotion) { void card.offsetWidth; card.style.animationDelay = (visible * 50) + 'ms'; card.classList.add('pop-in'); }
        }
      });
      pills.forEach((pill) => {
        const active = pill.dataset.filter === filters.purpose;
        pill.classList.toggle('is-active', active);
        pill.setAttribute('aria-pressed', String(active));
      });
      ['purpose', 'type', 'location', 'budget'].forEach((k) => { const s = $('#f-' + k); if (s) s.value = filters[k]; });
      resultCount.textContent = sellOnly ? '' : 'Showing ' + visible + ' of ' + cards.length + ' projects';
      emptyState.classList.toggle('hidden', visible > 0);
      emptyTitle.textContent = sellOnly ? 'Want to sell your property?' : 'No matching projects yet';
      emptyText.textContent = sellOnly
        ? 'Share the location and type of property on the contact page and I will get back to you.'
        : 'Try a different combination, or tell me what you need and I will look for it.';
    }

    pills.forEach((pill) => pill.addEventListener('click', () => { filters.purpose = pill.dataset.filter; applyFilters(true); }));
    ['purpose', 'type', 'location', 'budget'].forEach((k) => {
      const sel = $('#f-' + k);
      if (sel) sel.addEventListener('change', () => { filters[k] = sel.value; applyFilters(true); });
    });
    $('#reset-filters').addEventListener('click', () => {
      Object.keys(filters).forEach((k) => { filters[k] = 'any'; });
      applyFilters(true);
    });
    applyFilters(false);

    // Saved (heart) projects, remembered in this browser only.
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem('nivaas-saved') || '[]'); } catch (e) { saved = []; }
    const savedNote = $('#saved-count');
    const paintSaved = () => {
      $$('.fav', grid).forEach((btn) => {
        const on = saved.includes(btn.dataset.id);
        btn.classList.toggle('is-on', on);
        btn.setAttribute('aria-pressed', String(on));
      });
      if (savedNote) savedNote.textContent = saved.length ? saved.length + ' saved' : '';
    };
    $$('.fav', grid).forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        saved = saved.includes(id) ? saved.filter((x) => x !== id) : saved.concat(id);
        try { localStorage.setItem('nivaas-saved', JSON.stringify(saved)); } catch (e) { /* storage unavailable */ }
        paintSaved();
      });
    });
    paintSaved();
    if (window.location.hash === '#listings' && params.toString()) {
      window.setTimeout(() => $('#listings').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }), 150);
    }
  }

  /* ---------- Contact form ---------- */
  const form = $('#contact-form');
  if (form) {
    const status = $('#form-status');
    const fields = {
      name: { el: $('#c-name'), err: $('#c-name-err') },
      phone: { el: $('#c-phone'), err: $('#c-phone-err') },
      email: { el: $('#c-email'), err: $('#c-email-err') }
    };

    // Pre-fill from "Enquire" links on the Projects page
    const prop = params.get('property');
    if (prop) $('#c-message').value = 'I am interested in: ' + prop + '.';
    ['interest', 'location'].forEach((k) => {
      const v = params.get(k);
      const sel = $('#c-' + k);
      if (v && sel) { const opt = Array.from(sel.options).find((o) => o.value.toLowerCase() === v.toLowerCase()); if (opt) sel.value = opt.value; }
    });

    function validate() {
      const errors = {};
      const name = fields.name.el.value.trim();
      const phone = fields.phone.el.value.replace(/[\s-]/g, '');
      const email = fields.email.el.value.trim();
      if (name.length < 2) errors.name = 'Enter your name.';
      if (!/^(\+91|0)?[6-9]\d{9}$/.test(phone)) errors.phone = 'Enter a valid 10-digit mobile number.';
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address, or leave this blank.';
      Object.keys(fields).forEach((k) => {
        fields[k].err.textContent = errors[k] || '';
        fields[k].el.setAttribute('aria-invalid', errors[k] ? 'true' : 'false');
      });
      return errors;
    }
    Object.keys(fields).forEach((k) => {
      fields[k].el.addEventListener('input', () => { if (fields[k].el.getAttribute('aria-invalid') === 'true') validate(); });
    });
    const setStatus = (msg, type) => {
      status.textContent = msg;
      status.classList.remove('field-status-ok', 'field-status-error');
      if (type) status.classList.add('field-status-' + type);
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const errors = validate();
      const first = Object.keys(errors)[0];
      if (first) { fields[first].el.focus(); setStatus('Please fix the highlighted fields.', 'error'); return; }
      if (!whatsappConfigured) { setStatus('The form is valid, but no WhatsApp number is set yet. Add it in CONFIG at the top of js/script.js.', 'error'); return; }
      const d = new FormData(form);
      const lines = [
        'New property enquiry',
        'Name: ' + d.get('name'),
        'Phone: ' + d.get('phone'),
        d.get('email') ? 'Email: ' + d.get('email') : null,
        'Interested in: ' + d.get('interest'),
        'Location: ' + d.get('location'),
        'Budget: ' + d.get('budget'),
        d.get('message') ? 'Message: ' + d.get('message') : null
      ].filter(Boolean);
      window.open(whatsappUrl(lines.join('\n')), '_blank', 'noopener');
      setStatus('Opening WhatsApp with your enquiry. Press send there to deliver it.', 'ok');
      form.reset();
    });
  }
})();
