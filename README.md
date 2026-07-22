# Clarkrange Baptist Church — Website

**Live site:** https://clarkrangebaptist.org
**Edit the site at:** https://app.pagescms.org
**Hosting:** GitHub Pages (free — no hosting bill, ever)
**Motto:** *Where everyone is someone and Jesus Christ is Lord!*

This is the whole website. There is no WordPress, no monthly fee, and nothing to
renew except the domain name itself. When content changes, the live website
updates itself automatically in about a minute.

---

## Updating the site (no coding, no GitHub knowledge needed)

The site has a friendly editing dashboard at **[app.pagescms.org](https://app.pagescms.org)**.
Sign in, pick this site, and you'll see two screens:

- **Announcements** — add, edit, or remove the announcements shown in the
  "Church News" section. Fill in the form, click **Save**, and the live
  site updates in about a minute.
- **Site Links** — the church's Facebook, Instagram, YouTube, and online
  giving (Converge Pay) links. Buttons and feeds across the site follow
  these automatically; leave a box empty and its button stays hidden.

### Social media syncs itself

- **Facebook:** the "Latest from Facebook" box on the site shows the page's
  timeline live — post to Facebook and it's on the website, nothing to do.
- **YouTube:** a scheduled task checks the church's channel four times a day
  and refreshes the "Recent Services & Sermons" section automatically.
- **Instagram:** linked from the site (Instagram doesn't allow free feed
  embeds, so it's a follow link).

### Giving someone editing access

An administrator signs in at app.pagescms.org and invites new editors from the
site's **Settings → Collaborators** by email address. Invited editors sign in
with just their email (a magic sign-in link) — **they do not need a GitHub
account**.

## Less-frequent updates (service times, staff, contact info)

Those live in `index.html` in this repository. Two ways to edit:

1. In Pages CMS, some plans/screens let you edit files directly; or
2. On GitHub: open `index.html`, click the pencil icon (✏️), search for the
   marker comments like `<!-- ✏️ EDIT SERVICE TIMES HERE -->`, change the
   words between the tags, and click **Commit changes**.

| What changed | Where to edit |
|---|---|
| Announcements, YouTube link, giving link | app.pagescms.org (dashboard) |
| Service times | `index.html` — search `EDIT SERVICE TIMES` |
| Staff / leadership | `index.html` — search `EDIT STAFF` |
| Phone, email, prayer-request number | `index.html` — `Contact` section |

Nothing is ever truly lost — every prior version of every file is kept
(click "History" on any file on GitHub to restore one).

## Giving the keys to someone new

- **Add a website editor:** invite them by email in Pages CMS (see above).
- **Hand over full ownership:** on GitHub, repository **Settings → General →
  Transfer ownership** to the new caretaker's GitHub account. The live site
  keeps working during the transfer.

## The technical bits (for whoever inherits this)

- Pure static HTML/CSS/JS — no build step, no dependencies, no framework.
- `index.html` — the entire site (one page). `styles.css` — appearance.
  `main.js` — menu, content loading, scroll effects.
- Editable content lives in `content/announcements.json` and
  `content/settings.json`; the Pages CMS dashboard (configured by `.pages.yml`)
  edits those files by committing to this repository, which triggers GitHub
  Pages to republish.
- `content/latest-videos.json` is auto-written by the scheduled GitHub Action
  in `.github/workflows/social-sync.yml` (runs `scripts/fetch_youtube.py`,
  stdlib only). If GitHub ever pauses the schedule for repo inactivity, one
  click on "Run workflow" in the Actions tab re-arms it.
- Site photography: NPS public-domain images + one CC BY 3.0 photo
  (credited in the site footer). Staff photos from the church's prior site.
- Domain `clarkrangebaptist.org` is registered/DNS-managed at Cloudflare;
  apex + www point at GitHub Pages, and the `CNAME` file in this repo tells
  GitHub Pages which domain to answer for. **Don't delete the `CNAME` file.**
- Services stream on Facebook: https://www.facebook.com/clarkrangebaptist
- Instagram: https://www.instagram.com/clarkrangebaptistchurch

*Site rebuilt July 2026.*
