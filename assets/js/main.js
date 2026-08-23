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
            'Something went wrong sending that. Please try again, or email us directly at <a href="mailto:hello@studiosteps.co">hello@studiosteps.co</a>.';
          status.className = "form-status is-error";
        }
      })
      .finally(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
  });
})();
