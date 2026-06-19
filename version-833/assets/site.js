
(function () {
  var toggle = document.querySelector('.menu-toggle');
  var panel = document.querySelector('.mobile-panel');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  var carousel = document.querySelector('[data-carousel]');

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dots button'));
    var index = 0;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });

    show(0);
    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  var params = new URLSearchParams(window.location.search);
  var query = params.get('q') || '';
  var globalSearch = document.querySelector('.global-search');

  if (globalSearch && query) {
    globalSearch.value = query;
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applyLocalFilter() {
    var localInput = document.querySelector('.local-filter');
    var yearFilter = document.querySelector('.year-filter');
    var scope = document.querySelector('.filter-scope');

    if (!scope || (!localInput && !yearFilter)) {
      return;
    }

    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
    var keyword = normalize(localInput ? localInput.value : '');
    var year = normalize(yearFilter ? yearFilter.value : '');

    cards.forEach(function (card) {
      var haystack = normalize([
        card.dataset.title,
        card.dataset.region,
        card.dataset.type,
        card.dataset.year,
        card.dataset.genre,
        card.dataset.category,
        card.textContent
      ].join(' '));
      var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      var matchYear = !year || normalize(card.dataset.year) === year;
      card.classList.toggle('is-hidden', !(matchKeyword && matchYear));
    });
  }

  var localInput = document.querySelector('.local-filter');
  var yearFilter = document.querySelector('.year-filter');

  if (localInput) {
    localInput.addEventListener('input', applyLocalFilter);
  }

  if (yearFilter) {
    yearFilter.addEventListener('change', applyLocalFilter);
  }

  function applySearchFilter() {
    var scope = document.querySelector('.search-scope');

    if (!scope) {
      return;
    }

    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
    var keyword = normalize(document.querySelector('.global-search') ? document.querySelector('.global-search').value : '');
    var region = normalize(document.querySelector('.region-select') ? document.querySelector('.region-select').value : '');
    var type = normalize(document.querySelector('.type-select') ? document.querySelector('.type-select').value : '');
    var year = normalize(document.querySelector('.year-select') ? document.querySelector('.year-select').value : '');

    cards.forEach(function (card) {
      var haystack = normalize([
        card.dataset.title,
        card.dataset.region,
        card.dataset.type,
        card.dataset.year,
        card.dataset.genre,
        card.dataset.category,
        card.textContent
      ].join(' '));
      var ok = (!keyword || haystack.indexOf(keyword) !== -1) &&
        (!region || normalize(card.dataset.region) === region) &&
        (!type || normalize(card.dataset.type) === type) &&
        (!year || normalize(card.dataset.year) === year);
      card.classList.toggle('is-hidden', !ok);
    });
  }

  ['.global-search', '.region-select', '.type-select', '.year-select'].forEach(function (selector) {
    var el = document.querySelector(selector);
    if (!el) {
      return;
    }
    el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', applySearchFilter);
  });

  if (document.querySelector('.search-scope')) {
    applySearchFilter();
  }
})();
