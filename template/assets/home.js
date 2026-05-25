// Ground Workers — agency home page interactions.
(function () {
  // 1. Email reveal — buttons swap the placeholder for the real address on first click,
  //    then open mailto: on the second click. Email lives in a non-rendered JSON
  //    <script> tag so dumb scrapers don't pick it up from the rendered HTML.
  var emailNode = document.getElementById('gd-email-data');
  var email = emailNode ? (emailNode.textContent || '').trim() : '';
  if (email) {
    document.querySelectorAll('.gd-email-reveal').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.classList.contains('is-revealed')) {
          window.location.href = 'mailto:' + email;
          return;
        }
        btn.classList.add('is-revealed');
        btn.textContent = email;
        btn.setAttribute('aria-label', 'Email ' + email);
      });
    });
  }

  // 2. Mobile nav toggle
  var toggle = document.querySelector('.gd-nav-toggle');
  var links  = document.querySelector('.gd-nav-links');
  function closeMenu() {
    if (!links || !links.classList.contains('open')) return;
    links.classList.remove('open');
    document.body.classList.remove('gd-menu-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }
  function openMenu() {
    if (!links) return;
    links.classList.add('open');
    document.body.classList.add('gd-menu-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
  }
  if (toggle && links) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      if (links.classList.contains('open')) closeMenu(); else openMenu();
    });
    links.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (a) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
    var mq = window.matchMedia('(min-width: 761px)');
    var onChange = function (ev) { if (ev.matches) closeMenu(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
  }

  // 3. Decorative contact form (no backend)
  var form = document.querySelector('.gd-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var success = form.querySelector('.gd-form-success');
      if (success) success.classList.add('show');
      form.querySelectorAll('input, textarea, button').forEach(function (el) {
        if (el.type !== 'button') el.disabled = true;
      });
    });
  }

  // 4. Footer year
  document.querySelectorAll('.gd-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // 5. Scroll-in animations
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.gd-fade-up').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.gd-fade-up').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
})();
