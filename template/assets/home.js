// Agency home page — decorative form handler + footer year.
(function () {
  var form = document.querySelector('.gd-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var success = form.querySelector('.gd-form-success');
      if (success) success.classList.add('show');
      var fields = form.querySelectorAll('input, textarea, button');
      fields.forEach(function (el) { if (el.type !== 'button') el.disabled = true; });
    });
  }
  var year = document.querySelector('.gd-year');
  if (year) year.textContent = new Date().getFullYear();
})();
