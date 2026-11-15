"""Extract a paper's Figure 1 as a cropped PNG, for use as its thumbnail.

    python3 scripts/paper-figure.py paper.pdf src/assets/papers/slug.png 700

Finds the "Figure 1" caption, grows a region upward from it over the graphics
(vector drawings + raster images) sitting in the caption's column, swallows any
text labels inside that region, and stops at the rule under a running header.

Check the result by eye before committing it: papers lay figures out in ways no
heuristic gets right every time. Requires PyMuPDF (`pip install pymupdf`).
"""
import sys, re, json, fitz

src, out, want_width = sys.argv[1], sys.argv[2], float(sys.argv[3])
GAP = 30.0      # pt: largest vertical gap still treated as the same figure
TEXT_PAD = 30.0 # pt: how far outside the graphics a text label may sit
PAD = 5.0

doc = fitz.open(src)
pat = re.compile(r'^\s*(figure|fig\.?)\s*1\b', re.I)

cap = None
for pno in range(min(len(doc), 12)):
    page = doc[pno]
    for b in page.get_text("blocks"):
        if pat.match(b[4]):
            cap = (pno, fitz.Rect(b[:4]))
            break
    if cap:
        break
if not cap:
    print(json.dumps({"error": "no Figure 1 caption"}))
    sys.exit(1)

pno, caprect = cap
page = doc[pno]
band = fitz.Rect(caprect.x0 - 12, 0, caprect.x1 + 12, caprect.y0 - 1)

ceiling = 0.0  # nothing above the running-header rule belongs to the figure

def overlaps(r):
    global ceiling
    if not (r.x1 > band.x0 and r.x0 < band.x1 and r.y1 <= caprect.y0 + 2):
        return False
    # A hairline spanning most of the column is a page rule, not the figure.
    # When it sits in the top fifth of the page it underlines a running header,
    # so the figure cannot start above it.
    if r.height < 2.0 and r.width > 0.6 * band.width:
        if r.y1 < 0.2 * page.rect.height:
            ceiling = max(ceiling, r.y1)
        return False
    return r.height > 0.8

boxes = []
for d in page.get_drawings():
    r = fitz.Rect(d["rect"])
    if overlaps(r):
        boxes.append(r)
for xref, *_ in page.get_images(full=True):
    for r in page.get_image_rects(xref):
        if overlaps(fitz.Rect(r)):
            boxes.append(fitz.Rect(r))

if not boxes:
    print(json.dumps({"error": "no graphics above caption"}))
    sys.exit(1)

# Walk upward from the caption, keeping boxes separated by less than GAP.
boxes.sort(key=lambda r: -r.y1)
fig = fitz.Rect(boxes[0])
for r in boxes[1:]:
    if fig.y0 - r.y1 > GAP:
        break
    fig |= r

# Pull in text that sits inside the figure (axis labels, node names, legends).
for b in page.get_text("blocks"):
    r = fitz.Rect(b[:4])
    if r.y1 <= caprect.y0 + 2 and r.x1 > band.x0 and r.x0 < band.x1:
        if r.y0 >= fig.y0 - TEXT_PAD and r.y1 <= fig.y1 + TEXT_PAD:
            fig |= r

fig = fitz.Rect(fig.x0 - PAD, fig.y0 - PAD, fig.x1 + PAD, fig.y1 + PAD) & page.rect
if ceiling and fig.y0 < ceiling:
    fig.y0 = ceiling + 2
zoom = want_width / fig.width
pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), clip=fig, alpha=False)
pix.save(out)
print(json.dumps({
    "page": pno, "rect": [round(v) for v in fig],
    "w": pix.width, "h": pix.height, "ceiling": round(ceiling),
    "ratio": round(fig.width / fig.height, 2),
}))
