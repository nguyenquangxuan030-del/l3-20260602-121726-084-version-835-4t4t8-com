(function() {
    const mobileToggle = document.querySelector(".mobile-toggle");
    const mobilePanel = document.querySelector(".mobile-panel");

    if (mobileToggle && mobilePanel) {
        mobileToggle.addEventListener("click", function() {
            mobilePanel.classList.toggle("open");
        });
    }

    const slides = Array.from(document.querySelectorAll(".hero-slide"));
    const dots = Array.from(document.querySelectorAll(".hero-dot"));
    let currentSlide = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        currentSlide = (index + slides.length) % slides.length;

        slides.forEach(function(slide, slideIndex) {
            slide.classList.toggle("active", slideIndex === currentSlide);
        });

        dots.forEach(function(dot, dotIndex) {
            dot.classList.toggle("active", dotIndex === currentSlide);
        });
    }

    if (slides.length) {
        dots.forEach(function(dot, index) {
            dot.addEventListener("click", function() {
                showSlide(index);
            });
        });

        setInterval(function() {
            showSlide(currentSlide + 1);
        }, 5200);
    }

    const searchInput = document.querySelector("[data-search-input]");
    const typeSelect = document.querySelector("[data-type-filter]");
    const regionSelect = document.querySelector("[data-region-filter]");
    const yearSelect = document.querySelector("[data-year-filter]");
    const searchableCards = Array.from(document.querySelectorAll("[data-search]"));

    function applyFilters() {
        const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
        const selectedType = typeSelect ? typeSelect.value : "";
        const selectedRegion = regionSelect ? regionSelect.value : "";
        const selectedYear = yearSelect ? yearSelect.value : "";

        searchableCards.forEach(function(card) {
            const text = (card.getAttribute("data-search") || "").toLowerCase();
            const type = card.getAttribute("data-type") || "";
            const region = card.getAttribute("data-region") || "";
            const year = card.getAttribute("data-year") || "";
            const matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
            const matchedType = !selectedType || type === selectedType;
            const matchedRegion = !selectedRegion || region === selectedRegion;
            const matchedYear = !selectedYear || year === selectedYear;

            card.classList.toggle("is-hidden", !(matchedKeyword && matchedType && matchedRegion && matchedYear));
        });
    }

    [searchInput, typeSelect, regionSelect, yearSelect].forEach(function(control) {
        if (control) {
            control.addEventListener("input", applyFilters);
            control.addEventListener("change", applyFilters);
        }
    });

    const playerBox = document.querySelector(".player-box");
    const video = document.querySelector("[data-video-player]");
    const playerCover = document.querySelector(".player-cover");
    const playerButton = document.querySelector(".player-btn");

    function startVideo() {
        if (!video) {
            return;
        }

        const source = video.getAttribute("data-src");

        if (!source) {
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            const hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: false
            });

            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function() {
                video.play().catch(function() {});
            });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
            video.addEventListener("loadedmetadata", function() {
                video.play().catch(function() {});
            }, { once: true });
        } else {
            video.src = source;
            video.play().catch(function() {});
        }

        if (playerCover) {
            playerCover.classList.add("hidden");
        }
    }

    if (playerBox) {
        playerBox.addEventListener("click", function(event) {
            if (event.target === video) {
                return;
            }

            if (playerCover && !playerCover.classList.contains("hidden")) {
                startVideo();
            }
        });
    }

    if (playerButton) {
        playerButton.addEventListener("click", function(event) {
            event.preventDefault();
            event.stopPropagation();
            startVideo();
        });
    }
})();
