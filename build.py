"""Stage only public portfolio assets for static hosting: python3 build.py."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / 'dist'
FILES = ('index.html', 'styles.css',
         'interactions.js', 'portfolio.js', 'project-explorer.js', 'life-cards.js', 'robots.txt')
DIRECTORIES = ('assets', 'cv.pdf', 'attestation')
for name in FILES + DIRECTORIES:
    if not (ROOT / name).exists():
        raise SystemExit(f'Missing public asset: {name}')
OUTPUT.mkdir(exist_ok=True)
for name in FILES:
    shutil.copy2(ROOT / name, OUTPUT / name)
for name in DIRECTORIES:
    shutil.copytree(ROOT / name, OUTPUT / name, dirs_exist_ok=True)
print(f'Static portfolio ready in {OUTPUT}')
