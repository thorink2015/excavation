// Ground Workers — agency home page interactions.
(function () {
  // 1. Email reveal: click swaps the button for a mailto link.
  //    Email lives in an inline <script type="application/json"> so it isn't
  //    visible to dumb HTML scrapers but is trivially available to a real visitor.
  var btn = document.querySelector('.gd-email-reveal');
  var emailNode = document.getElementById('gd-email-data');
  if (btn && emailNode) {
    var email = (emailNode.textContent || '').trim();
    btn.addEventListener('click', function () {
      if (btn.classList.contains('is-revealed')) {
        // Already revealed — actually open the mail client
        window.location.href = 'mailto:' + email;
        return;
      }
      btn.classList.add('is-revealed');
      btn.textContent = email;
      btn.setAttribute('aria-label', 'Email ' + email);
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

  // 3. Footer year (single source of truth)
  document.querySelectorAll('.gd-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // 4. Scroll-in animations via IntersectionObserver.
  //    Adds .is-visible to .gd-fade-up elements when they enter the viewport.
  //    Respects prefers-reduced-motion (CSS skips the transition there).
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.gd-fade-up').forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: just reveal everything immediately
    document.querySelectorAll('.gd-fade-up').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
})();
