(function () {
  var toggle = document.querySelector(".menu-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  if (!toggle || !mobileNav) return;

  toggle.addEventListener("click", function () {
    var isOpen = mobileNav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  mobileNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      mobileNav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
})();
