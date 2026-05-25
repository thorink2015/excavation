// Mobile nav toggle + decorative form handler + footer year.
(function () {
  var toggle = document.querySelector('.gw-nav-toggle');
  var links  = document.querySelector('.gw-nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // Close panel when any nav link is tapped (mobile UX)
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && links.classList.contains('open')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
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

  // Footer year
  document.querySelectorAll('.gw-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
