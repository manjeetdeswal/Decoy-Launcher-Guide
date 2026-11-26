// Decoy Launcher website: theme switch, mobile menu, the hero reveal and
// the guide pages' table of contents. Everything works without it too.

(function () {
  var root = document.documentElement;

  // ---- Theme (remembered in this browser only) ----
  function storedTheme() {
    try { return localStorage.getItem("decoy-theme"); } catch (e) { return null; }
  }
  function storeTheme(v) {
    try { localStorage.setItem("decoy-theme", v); } catch (e) { /* private mode */ }
  }
  var saved = storedTheme();
  if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);

  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function labelThemeButtons() {
    var next = currentTheme() === "dark" ? "light" : "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.setAttribute("aria-label", "Switch to " + next + " theme");
      b.setAttribute("title", "Switch to " + next + " theme");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    labelThemeButtons();
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.addEventListener("click", function () {
        var next = currentTheme() === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        storeTheme(next);
        labelThemeButtons();
      });
    });

    // ---- Mobile menu ----
    var menuBtn = document.querySelector(".menu-btn");
    var nav = document.getElementById("site-nav");
    if (menuBtn && nav) {
      menuBtn.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    // ---- Hero: show what's hidden ----
    var phone = document.querySelector(".reveal-phone");
    var revealBtn = document.querySelector("[data-reveal]");
    var caption = document.querySelector(".reveal-caption");
    if (phone && revealBtn) {
      revealBtn.addEventListener("click", function () {
        var on = phone.classList.toggle("revealed");
        revealBtn.setAttribute("aria-pressed", on ? "true" : "false");
        revealBtn.textContent = on ? "Hide them again" : "Show what's hidden";
        if (caption) {
          caption.textContent = on
            ? "Typing your secret code in search brings the hidden apps back for a moment."
            : "This is what anyone else sees.";
        }
      });
    }

    // ---- Guide pages: highlight the section being read ----
    var links = Array.prototype.slice.call(document.querySelectorAll(".toc a[href^='#']"));
    if (links.length && "IntersectionObserver" in window) {
      var byId = {};
      links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            links.forEach(function (a) { a.classList.remove("active"); });
            var a = byId[e.target.id];
            if (a) a.classList.add("active");
          }
        });
      }, { rootMargin: "-20% 0px -70% 0px" });
      Object.keys(byId).forEach(function (id) {
        var el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }
  });
})();
