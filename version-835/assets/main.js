(function () {
  function toggleMenu() {
    var panel = document.querySelector(".mobile-panel");
    if (panel) {
      panel.classList.toggle("open");
    }
  }

  var menuButton = document.querySelector(".menu-toggle");
  if (menuButton) {
    menuButton.addEventListener("click", toggleMenu);
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
  var prev = document.querySelector(".hero-prev");
  var next = document.querySelector(".hero-next");
  var active = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    active = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle("active", i === active);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("active", i === active);
    });
  }

  if (slides.length) {
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        showSlide(i);
      });
    });
    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(active - 1);
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        showSlide(active + 1);
      });
    }
    setInterval(function () {
      showSlide(active + 1);
    }, 5200);
  }

  var filterRoot = document.querySelector("[data-filter-root]");
  if (filterRoot) {
    var search = filterRoot.querySelector("[data-filter-search]");
    var year = filterRoot.querySelector("[data-filter-year]");
    var region = filterRoot.querySelector("[data-filter-region]");
    var type = filterRoot.querySelector("[data-filter-type]");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));

    function matchCard(card) {
      var q = search ? search.value.trim().toLowerCase() : "";
      var y = year ? year.value : "";
      var r = region ? region.value : "";
      var t = type ? type.value : "";
      var text = [
        card.dataset.title || "",
        card.dataset.genre || "",
        card.dataset.region || "",
        card.dataset.type || ""
      ].join(" ").toLowerCase();

      if (q && text.indexOf(q) === -1) {
        return false;
      }
      if (y && card.dataset.year !== y) {
        return false;
      }
      if (r && card.dataset.region !== r) {
        return false;
      }
      if (t && card.dataset.type !== t) {
        return false;
      }
      return true;
    }

    function applyFilters() {
      cards.forEach(function (card) {
        card.style.display = matchCard(card) ? "" : "none";
      });
    }

    [search, year, region, type].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilters);
        control.addEventListener("change", applyFilters);
      }
    });
  }

  var searchApp = document.querySelector("[data-search-app]");
  if (searchApp && window.SEARCH_MOVIES) {
    var params = new URLSearchParams(window.location.search);
    var queryInput = searchApp.querySelector("[data-search-input]");
    var resultGrid = searchApp.querySelector("[data-search-results]");
    var empty = searchApp.querySelector("[data-search-empty]");
    var initial = params.get("q") || "";

    if (queryInput) {
      queryInput.value = initial;
    }

    function renderResults() {
      var q = queryInput ? queryInput.value.trim().toLowerCase() : "";
      var list = window.SEARCH_MOVIES.filter(function (item) {
        if (!q) {
          return true;
        }
        return [
          item.title,
          item.oneLine,
          item.region,
          item.type,
          item.year,
          item.genre,
          item.category
        ].join(" ").toLowerCase().indexOf(q) !== -1;
      }).slice(0, 120);

      if (resultGrid) {
        resultGrid.innerHTML = list.map(function (item) {
          return [
            '<article class="movie-card">',
            '<a class="poster-link" href="' + item.url + '" aria-label="' + escapeHtml(item.title) + '">',
            '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
            '<span class="play-badge">播放</span>',
            '</a>',
            '<div class="card-body">',
            '<div class="meta-row"><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.type) + '</span></div>',
            '<h3><a href="' + item.url + '">' + escapeHtml(item.title) + '</a></h3>',
            '<p>' + escapeHtml(item.oneLine) + '</p>',
            '<div class="tag-row"><span>' + escapeHtml(item.genre) + '</span><span>' + escapeHtml(item.category) + '</span></div>',
            '</div>',
            '</article>'
          ].join("");
        }).join("");
      }
      if (empty) {
        empty.style.display = list.length ? "none" : "block";
      }
    }

    function escapeHtml(value) {
      return String(value || "").replace(/[&<>\"]/g, function (ch) {
        return {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "\"": "&quot;"
        }[ch];
      });
    }

    if (queryInput) {
      queryInput.addEventListener("input", renderResults);
    }
    renderResults();
  }
})();
