"""Check the offline release, relative links, image headers and required controls."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]

class ReleasePage(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.targets = []

    def handle_starttag(self, tag, attrs):
        props = dict(attrs)
        if "id" in props:
            assert props["id"] not in self.ids, props["id"]
            self.ids.add(props["id"])
        for attr in ("href", "src"):
            if props.get(attr):
                self.targets.append(props[attr])

page = ReleasePage()
page.feed((ROOT / "index.html").read_text(encoding="utf-8"))
for target in page.targets:
    link = urlsplit(target)
    assert not link.netloc and not link.scheme, target
    if link.path:
        assert (ROOT / link.path).is_file(), target
    elif link.fragment:
        assert link.fragment in page.ids, target
assert {"drive", "road", "meters", "pause", "close", "timer"} <= page.ids
for name in ("causeway", "tidal-keys"):
    assert (ROOT / "assets" / (name + ".webp")).read_bytes()[8:12] == b"WEBP"
print("Offline release checks passed.")
