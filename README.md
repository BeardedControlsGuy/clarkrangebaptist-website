# Clarkrange Baptist Church — Website

**Live site:** https://clarkrangebaptist.org
**Hosting:** GitHub Pages (free — no hosting bill, ever)
**Motto:** *Where everyone is someone and Jesus Christ is Lord!*

This is the whole website. There is no WordPress, no monthly fee, and nothing to
renew except the domain name itself. When a file in this repository changes, the
live website updates itself automatically in about a minute.

---

## How to make everyday updates (no coding needed)

Everything that changes week-to-week lives in **one file: `announcements.js`**.

1. Sign in at github.com and open this repository.
2. Click the file **`announcements.js`**.
3. Click the **pencil icon** (✏️, top-right of the file view).
4. Make your change — the file is full of comments explaining exactly what to do:
   - **Announcements** — add, edit, or remove announcement blocks.
   - **YouTube link** — paste the channel address if the church starts one; a
     YouTube button appears on the site automatically.
   - **Online giving link** — paste the Converge Pay address; a "Give Online"
     button appears automatically.
5. Click the green **Commit changes** button. Done — refresh the live site in a
   minute or two.

## Less-frequent updates (still no coding needed)

Open **`index.html`** the same way and look for markers like
`<!-- ✏️ EDIT SERVICE TIMES HERE -->`. The text between the tags is normal
English — change the words, commit, done. Common spots:

| What changed | Where to edit |
|---|---|
| Service times | `index.html` — search for `EDIT SERVICE TIMES` |
| Staff / leadership | `index.html` — search for `EDIT STAFF` |
| Phone, email, prayer-request number | `index.html` — search for `Contact` |
| Announcements, YouTube, giving link | `announcements.js` |

**Tip:** if you're ever unsure, make the edit and look at the preview tab before
committing. And nothing is ever truly lost — GitHub keeps every prior version
(click "History" on any file to restore one).

## Giving the keys to someone new

- **Add an editor:** repository **Settings → Collaborators → Add people** (they
  need a free GitHub account).
- **Hand over the whole site:** repository **Settings → General → Transfer
  ownership** to their GitHub account. The site keeps working during transfer.

## The technical bits (for whoever inherits this)

- Pure static HTML/CSS/JS — no build step, no dependencies, no framework.
- `index.html` — the entire site (one page). `styles.css` — appearance.
  `main.js` — menu, announcements rendering, scroll effects.
- Domain `clarkrangebaptist.org` is registered/DNS-managed at Cloudflare;
  DNS points at GitHub Pages, and the `CNAME` file in this repo tells GitHub
  Pages which domain to answer for. Don't delete the `CNAME` file.
- Services stream on Facebook: https://www.facebook.com/clarkrangebaptist
- Instagram: https://www.instagram.com/clarkrangebaptistchurch

*Site rebuilt July 2026.*
