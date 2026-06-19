(function() {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var mobilePanel = document.querySelector("[data-mobile-panel]");

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function() {
      mobilePanel.classList.toggle("open");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var active = 0;
    var timer;

    function showSlide(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function(slide, i) {
        slide.classList.toggle("is-active", i === active);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle("is-active", i === active);
      });
    }

    function runNext() {
      showSlide(active + 1);
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(runNext, 5000);
    }

    if (slides.length > 1) {
      if (prev) {
        prev.addEventListener("click", function() {
          showSlide(active - 1);
          restart();
        });
      }
      if (next) {
        next.addEventListener("click", function() {
          showSlide(active + 1);
          restart();
        });
      }
      dots.forEach(function(dot) {
        dot.addEventListener("click", function() {
          showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
          restart();
        });
      });
      restart();
    }
  }

  document.querySelectorAll("[data-scroll-dir]").forEach(function(button) {
    button.addEventListener("click", function() {
      var wrap = button.closest(".scroll-wrap");
      var target = wrap ? wrap.querySelector("[data-scroll-target]") : null;
      if (!target) {
        return;
      }
      var direction = button.getAttribute("data-scroll-dir") === "left" ? -1 : 1;
      target.scrollBy({ left: direction * 420, behavior: "smooth" });
    });
  });

  document.querySelectorAll("[data-filter-list]").forEach(function(list) {
    var root = list.closest(".content-section") || document;
    var input = root.querySelector("[data-filter-input]");
    var year = root.querySelector("[data-year-filter]");
    var sort = root.querySelector("[data-sort-filter]");

    function textOf(card) {
      return [
        card.getAttribute("data-title") || "",
        card.getAttribute("data-region") || "",
        card.getAttribute("data-genre") || "",
        card.getAttribute("data-tags") || "",
        card.getAttribute("data-year") || ""
      ].join(" ").toLowerCase();
    }

    function applyFilter() {
      var query = input ? input.value.trim().toLowerCase() : "";
      var selectedYear = year ? year.value : "";
      Array.prototype.slice.call(list.children).forEach(function(card) {
        var matchesQuery = !query || textOf(card).indexOf(query) !== -1;
        var matchesYear = !selectedYear || card.getAttribute("data-year") === selectedYear;
        card.style.display = matchesQuery && matchesYear ? "" : "none";
      });
    }

    function applySort() {
      if (!sort) {
        return;
      }
      var cards = Array.prototype.slice.call(list.children);
      var mode = sort.value;
      cards.sort(function(a, b) {
        var ay = Number(a.getAttribute("data-year") || 0);
        var by = Number(b.getAttribute("data-year") || 0);
        var at = a.getAttribute("data-title") || "";
        var bt = b.getAttribute("data-title") || "";
        if (mode === "year-asc") {
          return ay - by || at.localeCompare(bt, "zh-Hans-CN");
        }
        if (mode === "title-asc") {
          return at.localeCompare(bt, "zh-Hans-CN") || by - ay;
        }
        return by - ay || at.localeCompare(bt, "zh-Hans-CN");
      });
      cards.forEach(function(card) {
        list.appendChild(card);
      });
      applyFilter();
    }

    if (input) {
      input.addEventListener("input", applyFilter);
    }
    if (year) {
      year.addEventListener("change", applyFilter);
    }
    if (sort) {
      sort.addEventListener("change", applySort);
    }
    applyFilter();
  });
})();

function sitePlayer(streamUrl) {
  var video = document.getElementById("moviePlayer");
  var button = document.getElementById("playerStart");
  var initialized = false;
  var hlsInstance = null;

  if (!video || !button || !streamUrl) {
    return;
  }

  function attachStream() {
    if (initialized) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
    } else {
      video.src = streamUrl;
    }

    initialized = true;
  }

  function beginPlay() {
    attachStream();
    button.classList.add("is-hidden");
    var playTask = video.play();
    if (playTask && typeof playTask.catch === "function") {
      playTask.catch(function() {});
    }
  }

  button.addEventListener("click", beginPlay);

  video.addEventListener("click", function() {
    if (video.paused) {
      beginPlay();
    } else {
      video.pause();
    }
  });

  video.addEventListener("play", function() {
    button.classList.add("is-hidden");
  });

  window.addEventListener("beforeunload", function() {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
