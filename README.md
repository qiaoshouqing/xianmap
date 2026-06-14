<div align="center">

# Chang'an · Xi'an — A Map of Two Cities

**The Tang-dynasty capital of Chang'an, registered to real coordinates and laid over modern Xi'an.**

Drag a Kaiyuan Tongbao coin across thirteen centuries — from today's Xi'an back to the Tang capital of Chang'an.

### 🌐 Live demo — **[changan.pomodiary.com](https://changan.pomodiary.com/)**

English · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-9e3b2c.svg)](./LICENSE)
![React](https://img.shields.io/badge/React-19-4f7d77.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-b58a3a.svg)
![MapLibre](https://img.shields.io/badge/MapLibre%20GL-5-7c2d1c.svg)

</div>

---

Inspired by a layered map at the **Shaanxi History Museum**: Tang Chang'an on top,
modern Xi'an below, the two aligned so you can see which ward once stood where you
now stand. This project turns that idea into a web page that **opens on any phone and
works instantly** — a gift to everyone who visits Xi'an.

<div align="center">
  <img src="docs/screenshots/overlay.png" width="80%" alt="Overlay mode: the Tang city drawn over modern streets" />
  <br/><em>Overlay mode — the wards, palaces and markets of Tang Chang'an, floating over today's Xi'an</em>
</div>

## ✨ Features

- **A slider through time** — a Kaiyuan Tongbao coin as the handle, gliding seamlessly
  between *now*, *overlay*, and *Tang*;
- **Tap to know** — click anywhere and a popup tells you which ward (*fang*, 坊) that
  spot belonged to, with stories for the famous ones (the pleasure quarter of Pingkang,
  General Guo Ziyi's mansion in Qinren, the "thousand peach trees" of Chongye… 30+ in all);
- **Then & Now trail** — sixteen places you can still physically visit today: the Giant
  and Small Wild Goose Pagodas, Qinglong Temple, Daming Palace, Hanguang Gate, the West
  Market… each with a *now ↔ Tang* card;
- **Layered detail** — 110 wards, the East and West Markets, the three great palace
  complexes, the Qujiang / Furong garden, the city canals, ten Tang-only landmarks, and
  — as a present-day reference — **the outline of the Ming city wall**, which makes it
  instantly clear that today's walled "old city" occupied only the northeast corner of Tang Chang'an;
- **Painted-on-silk aesthetic** — cinnabar, gold and malachite, with hand-brushed
  vertical ward names, like an old map unrolled across a desk.

<div align="center">
  <img src="docs/screenshots/tang.png" width="49%" alt="Tang mode: the Ming wall covers only one corner" />
  <img src="docs/screenshots/poi.png" width="49%" alt="A then-and-now landmark card" />
  <br/>
  <em>Left: pure Tang mode — the dashed line is today's Ming wall, a mere northeast corner of Chang'an.&nbsp;&nbsp;Right: a landmark's then-and-now card.</em>
</div>

## 🚀 Quick start

```bash
npm install
npm run dev        # dev server, default http://localhost:5173
npm run build      # production build → dist/ (fully static)
npm run preview    # preview the production build locally
```

## 🛠 Tech stack

| Purpose | Choice |
| --- | --- |
| Build / framework | Vite + React 19 + TypeScript |
| Routing | [TanStack Router](https://tanstack.com/router) (`/` map, `/kao` sources & notes) |
| Map engine | [MapLibre GL JS](https://maplibre.org/) |
| Basemap | CARTO Voyager raster tiles (OpenStreetMap-based, WGS84) |
| Tang city layer | GeoJSON generated at runtime from `src/data/changan.ts` |

## 🧭 How it lines up

The Tang city isn't drawn by hand — it's **registered to WGS84 coordinates** at true scale and orientation:

- **Ward layout**: cross-checked column by column against the *Chang'an Zhi* (長安志, by
  Song Minqiu, Song dynasty), vols. 7–10, consistent with the *Tang Liu Dian* (唐六典):
  *"South of the imperial city, ten wards east–west and nine north–south; twelve wards on
  each side; the two markets occupy four wards — one hundred and ten wards in all."*
- **Registration anchors** (three Tang remains still on their original sites): the
  **Mingde Gate** ruins (fixing the Zhuque Avenue axis and the south wall), the
  **Hanguang Gate** ruins (the imperial city's south wall), and the **Danfeng Gate**
  ruins (the north wall line).
- **Self-verification**: after registration, with no further tweaking, the Giant Wild
  Goose Pagoda falls squarely in Jinchang ward, the Small Wild Goose Pagoda in the
  northwest of Anren ward, Da Xingshan Temple at the center of Jingshan ward, Qinglong
  Temple in Xinchang ward, and the Tang West Market Museum directly on the old West
  Market — all matching.

> ⚠️ This is an **illustrative reconstruction**: ward boundaries and streets are
> approximate and the waterways are stylized. **It is not an archaeological reference.**
> Full sourcing and caveats are on the in-app "Sources & Notes" page (`/kao`).

The entire reconstruction lives in a single file — [`src/data/changan.ts`](src/data/changan.ts).
Start there to correct coordinates, add wards, or contribute stories.

## ☁️ Deployment

The build output is fully static and can be hosted anywhere (Cloudflare, Vercel, Netlify, GitHub Pages…).

The repo ships a [`wrangler.jsonc`](wrangler.jsonc) configured for **Cloudflare Workers
static assets with SPA fallback**:

```bash
npm run deploy     # = npm run build && wrangler deploy
```

By default this deploys to `https://changan-map.<your-subdomain>.workers.dev`, ready to
use. To bind your own domain, uncomment and edit the relevant lines in `wrangler.jsonc`.

## 🌏 Notes for serving users in mainland China

- The basemap tiles (`basemaps.cartocdn.com`) and Google Fonts may be slow to reach from
  inside mainland China. If your audience is primarily there:
  1. Switch tiles to a self-hosted or domestically reachable **WGS84** source — **do not**
     use AMap/Baidu tiles, which use the offset GCJ-02 / BD-09 coordinate systems and will
     be misaligned with this map by roughly 300–600 m;
  2. Self-host the fonts (Ma Shan Zheng / ZCOOL XiaoWei / Noto Serif SC) as `woff2`.

## 📁 Project structure

```
src/
├── data/changan.ts      # Tang city reconstruction data & registration logic (core)
├── components/
│   ├── MapView.tsx       # MapLibre map: all layers and interactions
│   ├── ControlDock.tsx   # the time slider
│   └── PoiPanel.tsx      # the "Then & Now" sidebar
├── pages/
│   ├── MapPage.tsx       # main map page
│   └── KaoPage.tsx       # sources & notes
└── index.css            # painted-on-silk design system
```

## 🤝 Contributing

Issues and PRs are welcome: ward/coordinate corrections, additional stories, basemap and
font localization, accessibility improvements, and more. For changes based on historical
sources, please cite the source (text and volume, or archaeological report) in your PR.

## 📜 License

Code is open-sourced under the [MIT License](./LICENSE).

Ward names and city dimensions are drawn from public-domain texts such as the *Chang'an Zhi*
and *Tang Liu Dian*. Basemap data © [OpenStreetMap](https://www.openstreetmap.org/copyright)
contributors; tile style © [CARTO](https://carto.com/).

## 🙏 Acknowledgements

- Song Minqiu's *Chang'an Zhi*, the *Tang Liu Dian*, and generations of archaeological
  reconstruction of Tang Chang'an;
- The [MapLibre](https://maplibre.org/), [CARTO](https://carto.com/) and
  [OpenStreetMap](https://www.openstreetmap.org/) communities;
- Inspired by the layered Chang'an map at the **Shaanxi History Museum**.

<div align="center">
<sub>Chang'an never left. It only changed its name — to Xi'an.</sub>
</div>
