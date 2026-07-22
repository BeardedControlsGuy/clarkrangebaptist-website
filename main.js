/* ============================================================
   Clarkrange Baptist Church — main.js
   Site behavior. You normally will NOT need to edit this file.
   Content edits happen in announcements.js and index.html.
   ============================================================ */
document.documentElement.classList.add("js");
(function () {
  "use strict";

  /* Mobile navigation toggle */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Render announcements from announcements.js */
  var list = document.getElementById("announcements-list");
  if (list) {
    var items = (typeof ANNOUNCEMENTS !== "undefined" && Array.isArray(ANNOUNCEMENTS)) ? ANNOUNCEMENTS : [];
    if (items.length === 0) {
      var empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "No announcements right now — check our Facebook page for the latest.";
      list.appendChild(empty);
    } else {
      items.forEach(function (a) {
        var card = document.createElement("article");
        card.className = "announcement reveal";
        var date = document.createElement("p");
        date.className = "a-date";
        date.textContent = a.date || "";
        var title = document.createElement("h3");
        title.textContent = a.title || "";
        var text = document.createElement("p");
        text.textContent = a.text || "";
        if (a.date) card.appendChild(date);
        card.appendChild(title);
        card.appendChild(text);
        if (a.link) {
          var more = document.createElement("a");
          more.className = "a-more";
          more.href = a.link;
          more.rel = "noopener";
          more.textContent = a.linkText || "Learn more";
          card.appendChild(more);
        }
        list.appendChild(card);
      });
    }
  }

  /* Optional YouTube + Giving links (set in announcements.js) */
  if (typeof YOUTUBE_URL !== "undefined" && YOUTUBE_URL) {
    document.querySelectorAll(".yt-link").forEach(function (el) {
      el.href = YOUTUBE_URL;
      el.hidden = false;
    });
    document.querySelectorAll(".yt-footer").forEach(function (el) { el.hidden = false; });
  }
  if (typeof GIVING_URL !== "undefined" && GIVING_URL) {
    document.querySelectorAll(".give-link").forEach(function (el) {
      el.href = GIVING_URL;
      el.hidden = false;
    });
  }

  /* Footer year */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* Gentle scroll-reveal animation */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }
})();
