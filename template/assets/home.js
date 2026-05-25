// Ground Workers — agency home page interactions.
(function () {
  // 1. Email reveal buttons (any number of them on the page).
  //    Email lives in an inline JSON script tag so dumb scrapers don't see it
  //    in the visible HTML. First click reveals; second click opens mailto:.
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

  // 2. Decorative contact form (no backend)
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

  // 3. Footer year
  document.querySelectorAll('.gd-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // 4. Scroll-in animations via IntersectionObserver.
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
