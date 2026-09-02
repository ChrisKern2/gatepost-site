/* ===========================================================================
   SITE BEHAVIOUR
   ---------------------------------------------------------------------------
   Everything the page *does*: the sticky nav, the mobile menu, scroll
   animations, the photo carousel, and the contact form.

   You can safely ignore this file while editing words and colours. The one
   part worth knowing about is the form setup, immediately below.
   =========================================================================== */

(function () {
  'use strict';

  /* =========================================================================
     WHERE FORM SUBMISSIONS GO

     The contact form posts to Web3Forms, which emails each submission straight
     to the inbox you register. There is no account and no password: you enter
     your email once at web3forms.com, they email you an access key, and that
     key goes in assets/site-data.js under formAccessKey.

     The key is meant to live in public page source, so it is safe there. It
     only lets a form deliver to the address you registered.

     With formAccessKey empty the form validates and shows the thank-you but
     sends nothing, so the page is never broken while you set this up.
     ===================================================================== */

  const FORM_API = 'https://api.web3forms.com/submit';

  const S = window.SITE;

  /* --- icons ------------------------------------------------------------- */

  const renderIcons = function () {
    if (window.lucide) window.lucide.createIcons();
  };
  renderIcons();

  /* --- fill in details from site-data.js --------------------------------- */

  /* In the HTML, `data-site="email"` means "put SITE.email here".
     `data-site-href="mailto:"` builds a link, and `data-site-href-key` names a
     different value for the link than for the visible text (a phone number
     reads as "(813) 597-5980" but must link as "+18135975980").
     `data-site-attr-only` sets the link but leaves the contents alone.      */

  document.querySelectorAll('[data-site], [data-site-href]').forEach(function (el) {
    const textKey = el.getAttribute('data-site');
    const hrefPrefix = el.getAttribute('data-site-href');

    if (hrefPrefix !== null) {
      const hrefValue = S[el.getAttribute('data-site-href-key') || textKey];
      if (hrefValue !== undefined) el.setAttribute('href', hrefPrefix + hrefValue);
    }

    if (textKey && !el.hasAttribute('data-site-attr-only') && S[textKey] !== undefined) {
      el.textContent = S[textKey];
    }
  });

  // The state list reads as a sentence: "Virginia, North Carolina, ... and Alabama."
  const statesEl = document.getElementById('stateSentence');
  if (statesEl && Array.isArray(S.states) && S.states.length) {
    const list = S.states.slice();
    const last = list.pop();
    statesEl.textContent = list.length
      ? list.join(', ') + ', and ' + last + '.'
      : last + '.';
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --- sticky nav: picks up a background once you scroll ----------------- */

  const nav = document.getElementById('nav');

  function paintNav() {
    const scrolled = window.scrollY > 24;
    nav.classList.toggle('bg-white/95', scrolled);
    nav.classList.toggle('backdrop-blur', scrolled);
    nav.classList.toggle('border-stone-200', scrolled);
    nav.classList.toggle('border-transparent', !scrolled);
    // over the dark hero photo the mark, links and button all invert
    nav.classList.toggle('at-top', !scrolled);
  }
  paintNav();
  window.addEventListener('scroll', paintNav, { passive: true });

  /* --- mobile menu ------------------------------------------------------- */

  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  function toggleMenu(force) {
    const open = typeof force === 'boolean' ? force : mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden', !open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.innerHTML = '<i data-lucide="' + (open ? 'x' : 'menu') + '" class="h-6 w-6"></i>';
    renderIcons();
  }
  menuBtn.addEventListener('click', function () { toggleMenu(); });
  document.querySelectorAll('.mobile-link').forEach(function (l) {
    l.addEventListener('click', function () { toggleMenu(false); });
  });

  /* --- fade sections in as they scroll into view ------------------------- */

  const reveals = document.querySelectorAll('.reveal');
  const showAll = function () {
    reveals.forEach(function (el) { el.classList.add('in'); });
  };
  const reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // failsafe: never leave content hidden if the observer never fires
  window.addEventListener('beforeprint', showAll);
  setTimeout(showAll, 3000);

  if (reduceMotion) {
    showAll();
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          const el = e.target;
          setTimeout(function () { el.classList.add('in'); }, Math.min(i * 70, 280));
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    showAll();
  }

  /* --- photo carousel in the About section -------------------------------- *
     Slides are stacked on top of each other and cross-faded. Adding another
     <img class="slide"> to the HTML is all it takes to add a photo.          */

  (function buildCarousel() {
    const root = document.getElementById('photoCarousel');
    if (!root) return;

    const slides = Array.prototype.slice.call(root.querySelectorAll('.slide'));
    const dotsBox = document.getElementById('carouselDots');
    if (slides.length < 2) {
      if (dotsBox) dotsBox.remove();
      return;
    }

    let index = 0;

    // one dot per slide
    const dots = slides.map(function (_, i) {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Show photo ' + (i + 1) + ' of ' + slides.length);
      b.className = 'h-1.5 rounded-full transition-all duration-300';
      b.addEventListener('click', function () { show(i); });
      dotsBox.appendChild(b);
      return b;
    });

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (s, i) {
        const on = i === index;
        s.style.opacity = on ? '1' : '0';
        s.style.transition = 'opacity .5s ease';
        s.setAttribute('aria-hidden', String(!on));
      });
      dots.forEach(function (d, i) {
        const on = i === index;
        d.className = 'h-1.5 rounded-full transition-all duration-300 ' +
          (on ? 'w-5 bg-white' : 'w-1.5 bg-white/60 hover:bg-white/80');
        d.setAttribute('aria-current', String(on));
      });
    }

    document.getElementById('carouselPrev')
      .addEventListener('click', function () { show(index - 1); });
    document.getElementById('carouselNext')
      .addEventListener('click', function () { show(index + 1); });

    // arrow keys work once the carousel has focus inside it
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
    });

    show(0);
  })();

  /* --- the thank-you dialog ---------------------------------------------- */

  const modal = document.getElementById('modal');
  const modalPanel = document.getElementById('modalPanel');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  function openModal(title, body) {
    if (title) modalTitle.textContent = title;
    if (body) modalBody.textContent = body;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () {
      modalPanel.classList.remove('scale-95', 'opacity-0');
      modalPanel.classList.add('scale-100', 'opacity-100');
    });
  }
  function closeModal() {
    modalPanel.classList.add('scale-95', 'opacity-0');
    modalPanel.classList.remove('scale-100', 'opacity-100');
    document.body.style.overflow = '';
    setTimeout(function () {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }, 220);
  }
  ['modalClose', 'modalOk', 'modalBackdrop'].forEach(function (id) {
    document.getElementById(id).addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });


  /* --- book a meeting ----------------------------------------------------- *
     With SITE.bookingUrl set the scheduler is embedded. With it empty the
     section falls back to email and phone, so it always says something useful.

     Some browsers and privacy extensions block third-party frames outright,
     so a plain link to the same scheduler sits underneath the embed.        */

  (function buildBooking() {
    const mount = document.getElementById('bookingMount');
    if (!mount) return;

    const url = (S.bookingUrl || '').trim();
    const shortUrl = (S.bookingShortUrl || url).trim();

    if (url) {
      const frame = document.createElement('iframe');
      frame.src = url;
      frame.title = 'Book a meeting with ' + S.firmName;
      frame.loading = 'lazy';
      frame.className = 'w-full border-0 bg-white';
      frame.style.height = '760px';
      frame.setAttribute('scrolling', 'yes');
      mount.appendChild(frame);

      const alt = document.createElement('p');
      alt.className = 'mt-4 text-[13.5px] text-white/60';
      alt.innerHTML = 'Calendar not loading? ' +
        '<a class="font-medium text-brass-300 underline underline-offset-4 hover:text-brass-200" ' +
        'href="' + shortUrl + '" target="_blank" rel="noopener">Open the booking page in a new tab</a>.';
      mount.parentNode.appendChild(alt);
      return;
    }

    // fallback: no scheduler connected yet
    const link = 'flex items-center gap-3 text-[16px] font-medium text-white transition hover:text-brass-300';
    mount.className = 'rounded-[4px] border border-white/15 bg-white/[0.04] p-8 sm:p-10';
    mount.innerHTML =
      '<p class="text-[15px] leading-relaxed text-white/70">' +
        'Online booking is being set up. In the meantime, email or call to arrange a time.' +
      '</p>' +
      '<div class="mt-7 space-y-4 border-t border-white/15 pt-7">' +
        '<a class="' + link + '" href="mailto:' + S.email + '">' + S.email + '</a>' +
        '<a class="' + link + '" href="tel:' + S.phoneLink + '">' + S.phone + '</a>' +
      '</div>';
  })();

  /* --- contact form ------------------------------------------------------ */

  const form = document.getElementById('contactForm');

  function setError(input, show) {
    const err = input.parentElement.querySelector('.err');
    if (err) err.classList.toggle('hidden', !show);
    input.classList.toggle('border-red-400', show);
    input.classList.toggle('ring-4', show);
    input.classList.toggle('ring-red-50', show);
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    const nameBad = name.value.trim().length < 2;
    const emailBad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
    const msgBad = message.value.trim().length < 10;

    setError(name, nameBad);
    setError(email, emailBad);
    setError(message, msgBad);

    const firstBad = nameBad ? name : (emailBad ? email : (msgBad ? message : null));
    if (firstBad) { firstBad.focus(); return; }

    const firstName = name.value.trim().split(' ')[0];
    const recipient = email.value.trim();
    const submitBtn = form.querySelector('button[type="submit"]');

    // If an endpoint is configured, actually send it.
    const accessKey = (S.formAccessKey || '').trim();

    if (accessKey) {
      const original = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending…';

      const fd = new FormData(form);
      fd.append('access_key', accessKey);
      fd.append('subject', 'Website enquiry from ' + name.value.trim());
      fd.append('from_name', S.firmName + ' website');
      fd.append('replyto', recipient);

      try {
        const res = await fetch(FORM_API, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: fd
        });
        const data = await res.json().catch(function () { return {}; });
        if (!res.ok || data.success === false) {
          throw new Error(data.message || 'status ' + res.status);
        }
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = original;
        openModal('That did not go through',
          'The message was blocked on its way out. Email ' + S.email +
          ' directly, or try again in a moment.');
        return;
      }
      submitBtn.disabled = false;
      submitBtn.innerHTML = original;
    }

    openModal('Thank you, ' + firstName,
      'Your message is in. It will be read personally and answered at ' + recipient +
      ' within 1 business day. What you sent stays private.');

    form.reset();
    [name, email, message].forEach(function (i) { setError(i, false); });
  });

  ['name', 'email', 'message'].forEach(function (id) {
    const el = document.getElementById(id);
    el.addEventListener('input', function () { setError(el, false); });
  });
})();
