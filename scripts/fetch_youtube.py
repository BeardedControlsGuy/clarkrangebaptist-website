"""Refresh content/latest-videos.json from the church's YouTube channel.

Runs on a schedule via GitHub Actions (.github/workflows/social-sync.yml).
Reads the channel address from content/settings.json, so if the church ever
moves to a new channel, updating the link in Pages CMS is all that's needed.

Standard library only — no dependencies to install or maintain.
"""
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET

SETTINGS = "content/settings.json"
OUTPUT = "content/latest-videos.json"
MAX_VIDEOS = 6
UA = {"User-Agent": "Mozilla/5.0 (clarkrangebaptist.org site bot)"}

ATOM = "{http://www.w3.org/2005/Atom}"
YT = "{http://www.youtube.com/xml/schemas/2015}"
MEDIA = "{http://search.yahoo.com/mrss/}"


def fetch(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", errors="ignore")


def resolve_channel_id(youtube_url):
    m = re.search(r"/channel/(UC[\w-]+)", youtube_url)
    if m:
        return m.group(1)
    page_url = re.sub(r"/(videos|streams|featured|about)/?$", "", youtube_url.strip())
    html = fetch(page_url)
    m = re.search(r'"externalId":"(UC[\w-]+)"', html) or re.search(r'"channelId":"(UC[\w-]+)"', html)
    return m.group(1) if m else None


def main():
    try:
        with open(SETTINGS, encoding="utf-8") as f:
            settings = json.load(f)
    except Exception as e:
        print(f"Could not read {SETTINGS}: {e}")
        return 0

    youtube_url = (settings.get("youtube_url") or "").strip()
    if not youtube_url:
        print("No YouTube link configured — nothing to do.")
        return 0

    try:
        channel_id = resolve_channel_id(youtube_url)
        if not channel_id:
            print("Could not resolve a channel ID from the YouTube link.")
            return 0
        feed_xml = fetch(f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}")
        root = ET.fromstring(feed_xml)
    except Exception as e:
        print(f"Feed fetch failed (leaving existing file untouched): {e}")
        return 0

    videos = []
    for entry in root.findall(f"{ATOM}entry"):
        vid = entry.findtext(f"{YT}videoId") or ""
        title = entry.findtext(f"{ATOM}title") or ""
        published = entry.findtext(f"{ATOM}published") or ""
        updated = entry.findtext(f"{ATOM}updated") or published
        if not vid:
            continue
        videos.append({
            "id": vid,
            "title": title,
            "url": f"https://www.youtube.com/watch?v={vid}",
            # "updated" tracks the latest activity, which reads better than the
            # original publish date for the church's persistent livestream video
            "published": updated,
            "thumbnail": f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg",
        })

    videos.sort(key=lambda v: v["published"], reverse=True)
    payload = {"channel_id": channel_id, "videos": videos[:MAX_VIDEOS]}

    with open(OUTPUT, "w", encoding="utf-8", newline="\n") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"Wrote {OUTPUT} with {len(payload['videos'])} videos.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
