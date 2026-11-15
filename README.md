# nagho.github.io

My personal site: [nagho.github.io](https://nagho.github.io)

Astro, no client-side framework, deployed to GitHub Pages on every push to
`main`. Content lives in two places and nowhere else:

```
data/resume.yaml        experience, publications, skills, awards, career path
src/content/blog/*.md   posts
```

## Running it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist
npm run check    # typecheck
```

`npm run dev` runs as a daemon; `npx astro dev status|logs|stop` controls it.

## Editing

| What | Where |
| --- | --- |
| Experience, publications, skills, awards, career path | `data/resume.yaml` |
| New blog post | `src/content/blog/<slug>.md` |
| Paper figures | `src/assets/papers/<slug>.png`, named by `thumb:` in the YAML |
| Colours, type, spacing | `src/styles/global.css` |
| Page structure | `src/pages/`, `src/components/` |

`data/resume.yaml` text fields accept `**bold**`, `` `code` `` and `[label](url)`.

Blog frontmatter (`title`, `description`, `date`, `tags`, `draft`) is
schema-validated at build time, so a typo fails the build instead of shipping.
`draft: true` shows a post in `npm run dev` only. Posts support LaTeX math
(`$...$`, `$$...$$`) and syntax highlighting.

### Paper thumbnails

Each publication's thumbnail is Figure 1 of the paper, cropped from its PDF by
`scripts/paper-figure.py` (needs PyMuPDF):

```bash
python3 scripts/paper-figure.py ~/Downloads/paper.pdf src/assets/papers/my-paper.png 700
```

Then set `thumb: my-paper.png` on that publication. Look at the crop before
committing — figure layouts vary and the heuristic is not infallible. Astro
hashes these and reads their dimensions, so no sizes go in the YAML.

### The CV PDF

`public/cv.pdf` and `public/logos/` are committed, so the build never depends on
the private CV repo. After rebuilding the PDF from `cv.tex` over there:

```bash
npm run sync:cv                       # expects ../resume/cv
CV_DIR=~/path/to/cv npm run sync:cv
```

## Deploying

GitHub Pages builds from `.github/workflows/deploy.yml`. One-time setup:
**Settings → Pages → Source: GitHub Actions**. Free because this repo is public.

For a custom domain: add `public/CNAME` containing the domain, set it under
Settings → Pages, and set a `SITE` environment variable (or edit the fallback in
`astro.config.mjs`) so canonical URLs and the sitemap follow.

`public/_headers` is read by Cloudflare Pages, not GitHub Pages — it is there in
case this moves hosts.

## Related

The LaTeX CV that `data/resume.yaml` mirrors lives in a separate private repo.
Facts are maintained in both; this repo holds nothing that is not public.
