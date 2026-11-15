/* ==========================================================================
   Benedict Karaya · portfolio behaviour
   Small, dependency-free. The page works fully without this file;
   it only adds the mobile menu, active-section highlighting and gentle fades.
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Portrait: fall back to the monogram if photo.jpg is missing ---------- */
  var portrait = document.querySelector(".portrait");
  var photo = portrait && portrait.querySelector("img");
  function photoState() {
    var ok = photo.complete && photo.naturalWidth > 0;
    portrait.classList.toggle("is-empty", !ok);
    portrait.classList.toggle("placeholder", !ok);
  }
  if (photo) {
    photo.addEventListener("load", photoState);
    photo.addEventListener("error", photoState);
    if (photo.complete) photoState();
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    var label = toggle.querySelector(".nav-toggle-label");
    if (label) label.textContent = open ? "Close" : "Menu";
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    // Close after choosing a section, or on Escape (focus returns to the button)
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Highlight the nav link for the section in view ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".site-nav a"));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          var match = a.getAttribute("href") === "#" + entry.target.id;
          if (match) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- Gentle fade-in for sections and projects ---------- */
  if (!reduceMotion && "IntersectionObserver" in window) {
    var targets = document.querySelectorAll(".section .section-body, .project");
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    Array.prototype.forEach.call(targets, function (el) {
      el.classList.add("reveal");
      revealObserver.observe(el);
    });
  }

  /* ---------- Terminal: reveal lines one by one, once ---------- */
  var terminal = document.querySelector(".terminal");
  if (terminal && !reduceMotion) {
    var lines = terminal.querySelectorAll(".t-line");
    terminal.classList.add("is-typing");
    Array.prototype.forEach.call(lines, function (line, i) {
      // Commands take a little longer than their output, like someone typing
      var delay = 350 + i * 230;
      setTimeout(function () { line.classList.add("is-shown"); }, delay);
    });
  }
})();
