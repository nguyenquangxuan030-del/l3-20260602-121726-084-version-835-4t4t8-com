(function () {
    const menuButton = document.querySelector("[data-menu-button]");
    const mobilePanel = document.querySelector("[data-mobile-panel]");

    if (menuButton && mobilePanel) {
        menuButton.addEventListener("click", function () {
            mobilePanel.classList.toggle("is-open");
        });
    }

    document.querySelectorAll(".search-form").forEach(function (form) {
        form.addEventListener("submit", function (event) {
            const input = form.querySelector("input[name='q']");
            const value = input ? input.value.trim() : "";
            if (!value) {
                event.preventDefault();
                if (input) {
                    input.focus();
                }
                return;
            }
            const target = form.getAttribute("data-search-url") || form.getAttribute("action") || "search.html";
            event.preventDefault();
            window.location.href = target + "?q=" + encodeURIComponent(value);
        });
    });

    document.querySelectorAll("[data-hero]").forEach(function (hero) {
        const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
        const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
        const prev = hero.querySelector("[data-hero-prev]");
        const next = hero.querySelector("[data-hero-next]");
        let index = 0;
        let timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function restart() {
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(function () {
                show(index + 1);
            }, 5000);
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                restart();
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
                restart();
            });
        });

        show(0);
        restart();
    });

    document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
        const input = scope.querySelector("[data-filter-input]");
        const category = scope.querySelector("[data-filter-category]");
        const year = scope.querySelector("[data-filter-year]");
        const empty = scope.querySelector("[data-filter-empty]");
        const cards = Array.from(scope.querySelectorAll("[data-card]"));
        const params = new URLSearchParams(window.location.search);
        const q = params.get("q") || "";

        if (input && q) {
            input.value = q;
        }

        function match(card) {
            const keyword = input ? input.value.trim().toLowerCase() : "";
            const cat = category ? category.value : "";
            const yr = year ? year.value : "";
            const text = [
                card.dataset.title,
                card.dataset.region,
                card.dataset.genre,
                card.dataset.tags,
                card.dataset.category,
                card.dataset.year
            ].join(" ").toLowerCase();
            const okKeyword = !keyword || text.indexOf(keyword) >= 0;
            const okCategory = !cat || card.dataset.category === cat;
            const okYear = !yr || card.dataset.year === yr;
            return okKeyword && okCategory && okYear;
        }

        function apply() {
            let visible = 0;
            cards.forEach(function (card) {
                const ok = match(card);
                card.style.display = ok ? "" : "none";
                if (ok) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle("is-show", visible === 0);
            }
        }

        [input, category, year].forEach(function (control) {
            if (control) {
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            }
        });

        apply();
    });

    document.querySelectorAll("[data-player]").forEach(function (box) {
        const video = box.querySelector("video");
        const cover = box.querySelector("[data-play-cover]");
        const stream = box.getAttribute("data-stream");
        let attached = false;
        let hls = null;

        function attach() {
            if (!video || !stream || attached) {
                return;
            }
            attached = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
            } else {
                video.src = stream;
            }
        }

        function start() {
            attach();
            if (cover) {
                cover.classList.add("is-hidden");
            }
            const playResult = video.play();
            if (playResult && typeof playResult.catch === "function") {
                playResult.catch(function () {
                    if (cover) {
                        cover.classList.remove("is-hidden");
                    }
                });
            }
        }

        if (cover) {
            cover.addEventListener("click", start);
        }

        if (video) {
            video.addEventListener("click", function () {
                if (video.paused) {
                    start();
                }
            });
            video.addEventListener("play", function () {
                if (cover) {
                    cover.classList.add("is-hidden");
                }
            });
            video.addEventListener("ended", function () {
                if (hls) {
                    hls.stopLoad();
                }
            });
        }
    });
})();
