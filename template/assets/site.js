// Mobile nav toggle + decorative form handler.
(function () {
  var toggle = document.querySelector('.gw-nav-toggle');
  var links  = document.querySelector('.gw-nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

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

  var year = document.querySelector('.gw-year');
  if (year) year.textContent = new Date().getFullYear();
})();
