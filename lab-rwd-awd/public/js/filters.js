/* Filtros del lado del cliente (sin recargar) + apertura del panel en pantallas pequeñas. */
(function () {
  var cat = document.getElementById('f-cat');
  var price = document.getElementById('f-price');
  var priceOut = document.getElementById('f-price-out');
  var count = document.getElementById('f-count');
  var cards = Array.prototype.slice.call(document.querySelectorAll('#grid .card'));
  var toggle = document.getElementById('filters-toggle');

  function apply() {
    var maxPrice = Number(price.value);
    var c = cat.value;
    var visible = 0;
    cards.forEach(function (card) {
      var ok = (!c || card.dataset.cat === c) && Number(card.dataset.price) <= maxPrice;
      card.classList.toggle('is-hidden', !ok);
      if (ok) visible++;
    });
    priceOut.textContent = maxPrice;
    count.textContent = visible;
  }

  cat.addEventListener('change', apply);
  price.addEventListener('input', apply);

  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('filters-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
})();
