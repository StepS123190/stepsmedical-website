(function () {
  var toggle = document.querySelector(".menu-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  if (!toggle || !mobileNav) return;

  toggle.addEventListener("click", function () {
    var isOpen = mobileNav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  mobileNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      mobileNav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    });
  });
})();

/* ---------- Hero image carousel ----------
   Progressively enhances a static hero image into an auto-rotating
   crossfade carousel. Markup: a .hero-carousel container with
   data-carousel-images (JSON array of image URLs) and data-carousel-interval
   (ms), holding a single <img>. Images are shuffled once per page load and
   swapped on an interval, loading each one on demand rather than upfront. */
(function () {
  var el = document.querySelector(".hero-carousel");
  if (!el) return;

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  var raw = el.getAttribute("data-carousel-images");
  if (!raw) return;
  var images;
  try {
    images = JSON.parse(raw);
  } catch (e) {
    return;
  }
  if (!Array.isArray(images) || images.length < 2) return;

  var img = el.querySelector("img");
  if (!img) return;

  var interval = parseInt(el.getAttribute("data-carousel-interval"), 10) || 30000;

  // Group by job: real project frames key off the /work/<project>/ folder;
  // everything else (generic lab/macro photography) shares one "generic"
  // key, so two shots from the same job (or two generic shots) never land
  // back to back.
  function jobKey(src) {
    var m = src.match(/\/assets\/images\/work\/([^/]+)\//);
    return m ? m[1] : "generic";
  }

  // Fisher-Yates shuffle so each page load gets a fresh random order.
  for (var i = images.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = images[i];
    images[i] = images[j];
    images[j] = tmp;
  }

  // Don't show the same image twice in a row as the very first swap.
  var currentSrc = img.getAttribute("src");
  images = images.filter(function (src) {
    return src !== currentSrc;
  });
  if (!images.length) return;

  // Rearrange so no two adjacent images (including the wrap from the last
  // image back to the first) share a job key.
  var keys = images.map(jobKey);
  for (var k = 1; k < images.length; k++) {
    if (keys[k] === keys[k - 1]) {
      for (var s = k + 1; s < images.length; s++) {
        if (keys[s] !== keys[k - 1] && (s !== images.length - 1 || keys[s] !== keys[0])) {
          var tmpImg = images[k];
          images[k] = images[s];
          images[s] = tmpImg;
          var tmpKey = keys[k];
          keys[k] = keys[s];
          keys[s] = tmpKey;
          break;
        }
      }
    }
  }
  if (images.length > 1 && keys[keys.length - 1] === keys[0]) {
    for (var w = images.length - 2; w > 0; w--) {
      if (keys[w] !== keys[0] && keys[w] !== keys[images.length - 2]) {
        var tmpImg2 = images[images.length - 1];
        images[images.length - 1] = images[w];
        images[w] = tmpImg2;
        break;
      }
    }
  }

  var idx = 0;

  function preload(src) {
    return new Promise(function (resolve) {
      var loader = new Image();
      loader.onload = function () {
        resolve(true);
      };
      loader.onerror = function () {
        resolve(false);
      };
      loader.src = src;
    });
  }

  function showNext() {
    if (!images.length) return;
    var src = images[idx % images.length];
    idx += 1;
    preload(src).then(function (ok) {
      if (!ok) {
        showNext();
        return;
      }
      img.style.opacity = "0";
      setTimeout(function () {
        img.src = src;
        img.style.opacity = "1";
      }, 500);
    });
  }

  setInterval(showNext, interval);
})();

/* ---------- On-page video lightbox ----------
   Used by direct/Mux video files (work-tile and video-block buttons render
   with data-video-src) so the film plays inline over the current page
   instead of navigating away or opening a new tab. */
(function () {
  function onEscape(e) {
    if (e.key === "Escape") closeVideoLightbox();
  }

  window.openVideoLightbox = function (src, title) {
    closeVideoLightbox();
    var overlay = document.createElement("div");
    overlay.className = "video-lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    if (title) overlay.setAttribute("aria-label", title);

    var inner = document.createElement("div");
    inner.className = "video-lightbox-inner";

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "video-lightbox-close";
    closeBtn.setAttribute("aria-label", "Close video");
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", closeVideoLightbox);

    var video = document.createElement("video");
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    if (title) video.setAttribute("title", title);

    inner.appendChild(closeBtn);
    inner.appendChild(video);
    overlay.appendChild(inner);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeVideoLightbox();
    });

    document.body.appendChild(overlay);
    document.body.classList.add("video-lightbox-open");
    document.addEventListener("keydown", onEscape);
    closeBtn.focus();
  };

  window.closeVideoLightbox = function () {
    var overlay = document.querySelector(".video-lightbox");
    if (!overlay) return;
    var video = overlay.querySelector("video");
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
    overlay.remove();
    document.body.classList.remove("video-lightbox-open");
    document.removeEventListener("keydown", onEscape);
  };
})();

/* ---------- Contact form: submit via fetch, stay on the page ---------- */
(function () {
  var form = document.getElementById("contact-form");
  if (!form) return;
  var status = form.querySelector(".form-status");
  var submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (status) {
      status.textContent = "Sending…";
      status.className = "form-status is-sending";
    }
    if (submitBtn) submitBtn.disabled = true;

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    })
      .then(function (response) {
        if (response.ok) {
          if (status) {
            status.textContent = "Thanks, your enquiry has been sent. We’ll be in touch soon.";
            status.className = "form-status is-success";
          }
          form.reset();
        } else {
          return response.json().then(function (data) {
            throw new Error(
              data && data.errors
                ? data.errors.map(function (err) { return err.message; }).join(", ")
                : "Something went wrong."
            );
          });
        }
      })
      .catch(function () {
        if (status) {
          status.innerHTML =
            'Something went wrong sending that. Please try again, or email us directly at <a href="mailto:jason@studiosteps.co">jason@studiosteps.co</a>.';
          status.className = "form-status is-error";
        }
      })
      .finally(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
  });
})();
