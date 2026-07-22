/* ============================================================
   Clarkrange Baptist Church — main.js
   Site behavior. You normally will NOT need to edit this file.
   Content is edited at https://app.pagescms.org (announcements
   and site links) or in index.html (service times, staff).
   ============================================================ */
document.documentElement.classList.add("js");
(async function () {
  "use strict";

  var DEFAULTS = {
    facebook_url: "https://www.facebook.com/clarkrangebaptist",
    instagram_url: "https://www.instagram.com/clarkrangebaptistchurch",
    youtube_url: "",
    giving_url: ""
  };

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
  async function loadJSON(path) {
    try {
      var r = await fetch(path, { cache: "no-cache" });
      if (r.ok) return await r.json();
    } catch (e) { /* fall through to null */ }
    return null;
  }
  var results = await Promise.all([
    loadJSON("content/announcements.json"),
    loadJSON("content/settings.json"),
    loadJSON("content/latest-videos.json")
  ]);
  var announcements = (results[0] && Array.isArray(results[0].items)) ? results[0].items : [];
  var settings = Object.assign({}, DEFAULTS, results[1] || {});
  var videos = (results[2] && Array.isArray(results[2].videos)) ? results[2].videos : [];

  /* Social links: any element with data-social="facebook|instagram" */
  ["facebook", "instagram"].forEach(function (network) {
    var url = settings[network + "_url"];
    if (!url) return;
    document.querySelectorAll('[data-social="' + network + '"]').forEach(function (el) {
      el.href = url;
    });
  });

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

  /* Facebook feed embed (Page Plugin — follows the CMS facebook link) */
  var fbBox = document.getElementById("fb-embed");
  if (fbBox && settings.facebook_url) {
    var fbFrame = document.createElement("iframe");
    fbFrame.title = "Clarkrange Baptist Church on Facebook";
    fbFrame.loading = "lazy";
    fbFrame.height = 520;
    fbFrame.style.height = "520px";
    fbFrame.setAttribute("allow", "encrypted-media");
    fbFrame.src = "https://www.facebook.com/plugins/page.php" +
      "?href=" + encodeURIComponent(settings.facebook_url) +
      "&tabs=timeline&width=500&height=520&small_header=true" +
      "&adapt_container_width=true&hide_cover=false&show_facepile=false";
    fbBox.innerHTML = "";
    fbBox.appendChild(fbFrame);
    var fbNote = document.createElement("p");
    fbNote.className = "note";
    var fbLink = document.createElement("a");
    fbLink.href = settings.facebook_url;
    fbLink.rel = "noopener";
    fbLink.textContent = "See more on our Facebook page";
    fbNote.appendChild(fbLink);
    fbBox.appendChild(fbNote);
  }

  /* Latest sermons from YouTube (auto-updated by GitHub Action) */
  var sermonsWrap = document.getElementById("sermons");
  var sermonsList = document.getElementById("sermons-list");
  if (sermonsWrap && sermonsList && videos.length > 0) {
    videos.slice(0, 3).forEach(function (v) {
      var card = document.createElement("a");
      card.className = "sermon-card reveal";
      card.href = v.url;
      card.rel = "noopener";
      var img = document.createElement("img");
      img.src = v.thumbnail;
      img.alt = "";
      img.loading = "lazy";
      card.appendChild(img);
      var body = document.createElement("span");
      body.className = "s-body";
      var t = document.createElement("span");
      t.className = "s-title";
      t.textContent = v.title;
      body.appendChild(t);
      if (v.published) {
        var d = document.createElement("span");
        d.className = "s-date";
        var dt = new Date(v.published);
        d.textContent = isNaN(dt) ? "" : dt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
        body.appendChild(d);
      }
      card.appendChild(body);
      sermonsList.appendChild(card);
    });
    sermonsWrap.hidden = false;
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
