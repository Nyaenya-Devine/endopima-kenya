#!/usr/bin/env python3
"""
Validate the EndoPima prototype before it is published.

Checks that the application shell is well formed and that everything it
references actually exists. Run from the repository root:

    python3 scripts/validate_prototype.py

Checks performed:
  * the document declares a language and a title
  * element ids are unique
  * the clinical scope warning and demonstration-data labels are present
  * inline and external JavaScript both parse
  * every locally referenced asset (image, script, stylesheet) exists
  * every <img> declares an intrinsic width and height (no layout shift)
  * the Content-Security-Policy permits the assets the page actually uses
"""

from html.parser import HTMLParser
from pathlib import Path
import re
import subprocess
import sys
import tempfile

APP = Path("endopima/index.html")
REDIRECT = Path("index.html")

problems = []


def fail(message):
    problems.append(message)


class Check(HTMLParser):
    """Collects ids, language, and every local asset reference."""

    def __init__(self):
        super().__init__()
        self.ids = set()
        self.duplicates = []
        self.lang = False
        self.title = False
        self.in_title = False
        self.assets = []          # (tag, attribute, value)
        self.images = []          # (src, has_width, has_height)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.lang = bool(a.get("lang"))
        if tag == "title":
            self.in_title = True
        if "id" in a:
            if a["id"] in self.ids:
                self.duplicates.append(a["id"])
            self.ids.add(a["id"])

        if tag == "img":
            self.images.append(
                (a.get("src", ""), "width" in a, "height" in a)
            )

        # Local file references that must resolve on disk.
        for attr in ("src", "href", "poster"):
            value = a.get(attr)
            if not value:
                continue
            if value.startswith(("http://", "https://", "//", "data:", "#", "mailto:", "/")):
                continue
            self.assets.append((tag, attr, value))

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title and data.strip():
            self.title = True


def check_html(path):
    text = path.read_text(encoding="utf-8")
    base = path.parent

    c = Check()
    c.feed(text)

    if not c.lang:
        fail(f"{path}: <html> needs a lang attribute")
    if not c.title:
        fail(f"{path}: <title> is required")
    if c.duplicates:
        fail(f"{path}: duplicate element ids: {sorted(set(c.duplicates))}")

    if path == APP:
        lowered = text.lower()
        if "not a diagnosis" not in lowered:
            fail(f"{path}: the medical scope warning is missing")
        if "DEMONSTRATION DATA" not in text:
            fail(f"{path}: demonstration-data labels are missing")

    # Inline JavaScript must parse.
    inline = 0
    for script in re.findall(r"<script(?:\s[^>]*)?>(.*?)</script>", text, re.S):
        if not script.strip():
            continue
        inline += 1
        with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as f:
            f.write(script)
            name = f.name
        result = subprocess.run(["node", "--check", name], capture_output=True, text=True)
        Path(name).unlink(missing_ok=True)
        if result.returncode != 0:
            fail(f"{path}: inline script does not parse: {result.stderr.strip()[:200]}")

    # External scripts must exist and parse.
    external = 0
    for src in re.findall(r'<script[^>]*\bsrc=["\']([^"\']+)["\']', text):
        if src.startswith(("http://", "https://", "//", "data:")):
            continue
        external += 1
        target = (base / src).resolve()
        if not target.is_file():
            fail(f"{path}: external script not found: {src}")
            continue
        result = subprocess.run(["node", "--check", str(target)], capture_output=True, text=True)
        if result.returncode != 0:
            fail(f"{path}: external script does not parse: {src} — {result.stderr.strip()[:200]}")

    # Every local asset reference must resolve.
    for tag, attr, value in c.assets:
        target = (base / value.split("#")[0].split("?")[0]).resolve()
        if not target.is_file():
            fail(f"{path}: <{tag} {attr}=\"{value}\"> does not resolve to a file")

    # Images need intrinsic dimensions so the page does not shift on load.
    for src, has_w, has_h in c.images:
        if src.startswith("data:"):
            continue
        if not (has_w and has_h):
            fail(f"{path}: <img src=\"{src}\"> is missing width/height")

    # The CSP must permit locally served images and scripts.
    csp = re.search(r'content="([^"]*Content-Security-Policy[^"]*|[^"]*default-src[^"]*)"', text)
    if csp:
        policy = csp.group(1)
        if "img-src" in policy and "'self'" not in policy:
            fail(f"{path}: Content-Security-Policy blocks locally served images")
        if "<script" in text and "script-src" in policy and "'self'" not in policy:
            fail(f"{path}: Content-Security-Policy blocks external scripts")

    return len(c.ids), inline, external


def main():
    if not APP.is_file():
        print(f"error: {APP} not found — run from the repository root", file=sys.stderr)
        return 1

    ids, inline, external = check_html(APP)

    if REDIRECT.is_file():
        redirect_text = REDIRECT.read_text(encoding="utf-8")
        if "endopima/index.html" not in redirect_text:
            fail(f"{REDIRECT}: the root page must point at the prototype")
        check_html(REDIRECT)

    if problems:
        print("validation failed:")
        for p in problems:
            print(f"  - {p}")
        return 1

    print(
        f"validated {APP}: {ids} unique ids, {inline} inline script block(s), "
        f"{external} external script(s), all asset references resolve"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
