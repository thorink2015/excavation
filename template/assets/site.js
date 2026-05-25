// Mobile nav toggle + decorative form handler + footer year.
(function () {
  var toggle = document.querySelector('.gw-nav-toggle');
  var links  = document.querySelector('.gw-nav-links');

  function closeMenu() {
    if (!links || !links.classList.contains('open')) return;
    links.classList.remove('open');
    document.body.classList.remove('gw-menu-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }
  function openMenu() {
    if (!links) return;
    links.classList.add('open');
    document.body.classList.add('gw-menu-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
  }

  if (toggle && links) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      if (links.classList.contains('open')) closeMenu(); else openMenu();
    });

    // Close panel when an actual nav link is tapped (mobile UX)
    links.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (a && links.contains(a)) closeMenu();
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeMenu(); if (toggle) toggle.focus(); }
    });

    // Close if viewport grows past the mobile breakpoint (orientation change)
    var mq = window.matchMedia('(min-width: 861px)');
    var onChange = function (ev) { if (ev.matches) closeMenu(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
  }

  // Close any open <details> dropdown when clicking outside
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.gw-nav-dropdown[open]').forEach(function (d) {
      if (!d.contains(e.target)) d.removeAttribute('open');
    });
  });

  // Decorative quote form
  var form = document.querySelector('.gw-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var success = form.querySelector('.gw-form-success');
      if (success) success.classList.add('show');
      var fields = form.querySelectorAll('input, textarea, select, button');
      fields.forEach(function (el) { if (el.type !== 'button') el.disabled = true; });
    });
  }

  // Footer year (all instances)
  document.querySelectorAll('.gw-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
