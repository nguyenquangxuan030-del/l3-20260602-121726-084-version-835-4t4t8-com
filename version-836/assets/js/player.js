(function () {
  var video = document.querySelector('[data-stream]');
  var button = document.querySelector('.player-start');

  if (!video) {
    return;
  }

  var attached = false;
  var hlsInstance = null;

  function attachStream() {
    if (attached) {
      return;
    }

    var stream = video.getAttribute('data-stream');

    if (!stream) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      attached = true;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(stream);
      hlsInstance.attachMedia(video);
      attached = true;
      return;
    }

    video.src = stream;
    attached = true;
  }

  function hideButton() {
    if (button) {
      button.classList.add('is-hidden');
    }
  }

  function startPlayback() {
    attachStream();
    hideButton();

    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        if (button) {
          button.classList.remove('is-hidden');
        }
      });
    }
  }

  if (button) {
    button.addEventListener('click', startPlayback);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      startPlayback();
    }
  });

  video.addEventListener('play', hideButton);
  video.addEventListener('loadedmetadata', hideButton);

  window.addEventListener('beforeunload', function () {
    if (hlsInstance && typeof hlsInstance.destroy === 'function') {
      hlsInstance.destroy();
    }
  });
}());
