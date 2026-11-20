# daniellepold.github.io

Personal website of Daniel Lepold, built with [Astro](https://astro.build) and deployed to GitHub Pages.

## Develop

```bash
nvm use            # Node 22 (see .nvmrc)
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
```

## Where things live

| What | File |
| --- | --- |
| Texts for hero, about, work, experience, education, toolbox | `src/data/site.ts` |
| Projects (one Markdown file each; `hasPage: true` gets a case-study page) | `src/content/projects/*.md` |
| Project illustrations (inline SVG) | `src/components/Illustration.astro` |
| Colours, fonts, shared styles | `src/styles/global.css` |
| Hero animation (building → city → runner point cloud) | `src/components/Hero.astro` |

## Deploy

Every push to `master` builds and deploys via `.github/workflows/deploy.yml`.
One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Hero runner animation

`public/runner.bin` is a run cycle baked into a point cloud (1200 uniformly spaced surface points × 20 frames,
plus normals and 13 joints). It was generated once from the X Bot model in the three.js examples
(`examples/models/gltf/Xbot.glb`, Mixamo character, `run` clip):

```bash
# in a scratch folder with `npm i three@0.160.0`
MESH= node tools/bake-runner.mjs Xbot.glb run public/runner.bin 1200 20
```

The page itself needs neither three.js nor the model; it only loads `runner.bin` (~220 KB).
