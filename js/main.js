(function () {
    var video = document.querySelector(".hero-video");
    var sound = document.querySelector(".sound");
    var soundOn = false;
    var soundReady = false;

    function primeInline() {
        if (!video) {
            return;
        }
        video.playsInline = true;
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");
        if (!soundOn) {
            video.defaultMuted = true;
            video.muted = true;
            video.setAttribute("muted", "");
        }
    }

    function startHero() {
        if (!video || !video.paused) {
            return;
        }
        primeInline();
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function () {});
        }
    }

    function useSound(done) {
        if (!video || soundReady || !video.getAttribute("data-sound")) {
            done();
            return;
        }
        var time = video.currentTime || 0;
        var resume = function () {
            video.removeEventListener("loadeddata", resume);
            try {
                video.currentTime = time;
            } catch (error) {
                /* seek can fail before the new file is ready */
            }
            soundReady = true;
            done();
        };
        video.addEventListener("loadeddata", resume);
        video.src = video.getAttribute("data-sound");
        video.load();
    }

    if (video) {
        primeInline();
        startHero();
        video.addEventListener("loadeddata", startHero);
        video.addEventListener("canplay", startHero);
        video.addEventListener("ended", function () {
            video.currentTime = 0;
            startHero();
        });
        document.addEventListener("visibilitychange", function () {
            if (!document.hidden) {
                startHero();
            }
        });
        window.addEventListener("pageshow", startHero);
        window.addEventListener("touchstart", startHero, { passive: true });
    }

    if (video && sound) {
        sound.addEventListener("click", function () {
            var nextMuted = !video.muted;
            soundOn = !nextMuted;
            var apply = function () {
                video.muted = nextMuted;
                if (!nextMuted) {
                    var playPromise = video.play();
                    if (playPromise && typeof playPromise.catch === "function") {
                        playPromise.catch(function () {
                            video.muted = true;
                            soundOn = false;
                            syncSoundButton();
                        });
                    }
                }
                syncSoundButton();
            };
            if (!nextMuted) {
                useSound(apply);
                return;
            }
            apply();
        });
    }

    function syncSoundButton() {
        if (!sound || !video) {
            return;
        }
        var muted = video.muted;
        sound.setAttribute("aria-pressed", muted ? "false" : "true");
        sound.setAttribute("aria-label", muted ? "Unmute video" : "Mute video");
    }
})();
