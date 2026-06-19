
(function () {
  function attachPlayer(video) {
    var src = video.getAttribute('data-src');
    var shell = video.closest('.video-shell');
    var button = shell ? shell.querySelector('.video-play') : null;
    var isLoaded = false;

    function load() {
      if (isLoaded || !src) {
        return Promise.resolve();
      }

      isLoaded = true;

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          lowLatencyMode: true,
          enableWorker: true
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        return new Promise(function (resolve) {
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            resolve();
          });
        });
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else {
        video.src = src;
      }

      return Promise.resolve();
    }

    function play() {
      load().then(function () {
        if (shell) {
          shell.classList.add('playing');
        }
        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {
            if (shell) {
              shell.classList.remove('playing');
            }
          });
        }
      });
    }

    if (button) {
      button.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener('play', function () {
      if (shell) {
        shell.classList.add('playing');
      }
    });

    video.addEventListener('pause', function () {
      if (shell) {
        shell.classList.remove('playing');
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('.movie-video')).forEach(attachPlayer);
})();
