(function () {
  const menuButton = document.querySelector('.menu-button');
  const mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      const open = mobileNav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
  }

  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.hero-dot'));
  let current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === current);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showSlide(Number(dot.dataset.slide || '0'));
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5500);
  }

  const pageFilter = document.querySelector('.page-filter');
  if (pageFilter) {
    const cards = Array.from(document.querySelectorAll('.movie-card'));
    pageFilter.addEventListener('input', function () {
      const value = pageFilter.value.trim().toLowerCase();
      cards.forEach(function (card) {
        const text = (card.dataset.search || card.textContent || '').toLowerCase();
        card.classList.toggle('is-hidden-card', value && !text.includes(value));
      });
    });
  }

  const siteSearch = document.getElementById('site-search');
  const categoryFilter = document.getElementById('category-filter');
  const yearFilter = document.getElementById('year-filter');
  const resultCount = document.getElementById('result-count');
  const searchCards = Array.from(document.querySelectorAll('.searchable-grid .movie-card'));

  function syncQueryInput() {
    if (!siteSearch) {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
      siteSearch.value = q;
    }
  }

  function runSearch() {
    if (!siteSearch || !searchCards.length) {
      return;
    }
    const query = siteSearch.value.trim().toLowerCase();
    const category = categoryFilter ? categoryFilter.value.trim().toLowerCase() : '';
    const year = yearFilter ? yearFilter.value.trim() : '';
    let count = 0;

    searchCards.forEach(function (card) {
      const text = (card.dataset.search || card.textContent || '').toLowerCase();
      const inQuery = !query || text.includes(query);
      const inCategory = !category || text.includes(category);
      const inYear = !year || card.dataset.year === year;
      const visible = inQuery && inCategory && inYear;
      card.classList.toggle('is-hidden-card', !visible);
      if (visible) {
        count += 1;
      }
    });

    if (resultCount) {
      resultCount.textContent = String(count);
    }
  }

  syncQueryInput();
  if (siteSearch) {
    siteSearch.addEventListener('input', runSearch);
    runSearch();
  }
  if (categoryFilter) {
    categoryFilter.addEventListener('change', runSearch);
  }
  if (yearFilter) {
    yearFilter.addEventListener('change', runSearch);
  }
})();
