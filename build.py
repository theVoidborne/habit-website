"""Build the GitHub Pages copy of Minimal HABIT.

Copies the prototype from ../HABIT Website Prototype Minimal and wraps its
index.html fragment in a full HTML document (the artifact host adds that
wrapper itself; GitHub Pages does not). Run: python3 build.py
"""
import os
import shutil

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "HABIT Website Prototype Minimal")
COPY = ["styles.css", "app.js", "data.js", "recipes.js", "img", "vid"]

for name in COPY:
    dst = os.path.join(HERE, name)
    if os.path.isdir(dst):
        shutil.rmtree(dst)
    src = os.path.join(SRC, name)
    (shutil.copytree if os.path.isdir(src) else shutil.copy2)(src, dst)

body = open(os.path.join(SRC, "index.html"), encoding="utf-8").read()
split = body.index("<div")
head_bits = "\n".join(l for l in body[:split].strip().splitlines() if "claude:" not in l)
rest = body[split:]
page = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<meta name="theme-color" content="#16151C">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%2316151C'/%3E%3Ccircle cx='16' cy='19' r='6' fill='%23FF5A4E'/%3E%3C/svg%3E">
{head_bits}
<style>[hidden]{{display:none!important}}</style>
</head>
<body>
{rest.strip()}
</body>
</html>
"""
open(os.path.join(HERE, "index.html"), "w", encoding="utf-8").write(page)
open(os.path.join(HERE, ".nojekyll"), "w").close()
print("built", page.count("\n"), "lines")
