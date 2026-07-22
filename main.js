/* ============================================================
   Clarkrange Baptist Church — main.js
   Site behavior. You normally will NOT need to edit this file.
   Content is edited at https://app.pagescms.org (announcements
   and site links) or in index.html (service times, staff).
   ============================================================ */
document.documentElement.classList.add("js");
(async function () {
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

  /* Footer year */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* Load editable content (managed via Pages CMS) */
  var announcements = [];
  var settings = {};
  try {
    var r = await fetch("content/announcements.json", { cache: "no-cache" });
    if (r.ok) {
      var d = await r.json();
      if (d && Array.isArray(d.items)) announcements = d.items;
    }
  } catch (e) { /* content unavailable — the section shows a friendly fallback */ }
  try {
    var r2 = await fetch("content/settings.json", { cache: "no-cache" });
    if (r2.ok) {
      var s = await r2.json();
      if (s && typeof s === "object") settings = s;
    }
  } catch (e) { /* optional links simply stay hidden */ }

  /* Render announcements */
  var list = document.getElementById("announcements-list");
  if (list) {
    if (announcements.length === 0) {
      var empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "No announcements right now — check our Facebook page for the latest.";
      list.appendChild(empty);
    } else {
      announcements.forEach(function (a) {
        var card = document.createElement("article");
        card.className = "announcement reveal";
        if (a.date) {
          var date = document.createElement("p");
          date.className = "a-date";
          date.textContent = a.date;
          card.appendChild(date);
        }
        var title = document.createElement("h3");
        title.textContent = a.title || "";
        card.appendChild(title);
        var text = document.createElement("p");
        text.textContent = a.text || "";
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

  /* Optional YouTube + Giving links (set in the CMS "Site Links" screen) */
  if (settings.youtube_url) {
    document.querySelectorAll(".yt-link").forEach(function (el) {
      el.href = settings.youtube_url;
      el.hidden = false;
    });
    document.querySelectorAll(".yt-footer").forEach(function (el) { el.hidden = false; });
  }
  if (settings.giving_url) {
    document.querySelectorAll(".give-link").forEach(function (el) {
      el.href = settings.giving_url;
      el.hidden = false;
    });
  }

  /* Gentle scroll-reveal animation (runs after content is in the page) */
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
