(function () {
    var video = document.querySelector(".hero-video");
    var sound = document.querySelector(".sound");

    if (video && sound) {
        sound.addEventListener("click", function () {
            var nextMuted = !video.muted;
            video.muted = nextMuted;
            if (!nextMuted) {
                var playPromise = video.play();
                if (playPromise && typeof playPromise.catch === "function") {
                    playPromise.catch(function () {
                        video.muted = true;
                    });
                }
            }
            var muted = video.muted;
            sound.setAttribute("aria-pressed", muted ? "false" : "true");
            sound.setAttribute("aria-label", muted ? "Unmute video" : "Mute video");
        });
    }
})();
