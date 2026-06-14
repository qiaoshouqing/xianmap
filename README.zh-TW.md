<div align="center">

# 長安 · 西安 — 雙城輿圖

**把唐代長安城按真實座標，疊回今天的西安。**

拖動一枚開元通寶銅錢，在「今日西安」與「大唐長安」之間穿越一千三百年。

[English](README.md) · [简体中文](README.zh-CN.md) · 繁體中文 · [日本語](README.ja.md) · [한국어](README.ko.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-9e3b2c.svg)](./LICENSE)
![React](https://img.shields.io/badge/React-19-4f7d77.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-b58a3a.svg)
![MapLibre](https://img.shields.io/badge/MapLibre%20GL-5-7c2d1c.svg)

</div>

---

靈感來自陝西歷史博物館的一張疊層地圖：上層是盛唐長安，下層是現代西安，兩層對照，
便知此刻腳下唐時是何坊。本專案把這個想法做成了一個**可在手機上開啟、即點即用**的網頁，
獻給每一個來西安的旅人。

<div align="center">
  <img src="docs/screenshots/overlay.png" width="80%" alt="疊加模式：唐城絹圖浮在現代街道之上" />
  <br/><em>疊加模式 —— 唐長安的坊牆、宮城、兩市，浮在今日西安的街道之上</em>
</div>

## ✨ 特色

- **時空滑桿**：以開元通寶銅錢為滑鈕，在「今」「疊」「唐」之間無級過渡；
- **即點即知**：點擊地圖任意一處，彈窗告訴你此地唐時屬於哪一坊，名坊附以典故
  （平康坊的北里、親仁坊的郭子儀宅、崇業坊的「桃千樹」……三十餘條）；
- **古今尋蹟**：十六處今天仍能親身抵達的長安——大雁塔、小雁塔、青龍寺、大明宮、
  含光門、大唐西市……每處配「今 ↔ 唐」對照卡；
- **資訊層疊**：110 坊、東西兩市、三大內、曲江芙蓉園、城中渠水、十處唐蹟點位、
  以及作為今古參照的**明城牆輪廓**——一眼看出今西安城只佔唐長安東北一角；
- **絹本設色**：硃砂、泥金、石綠配手寫體豎排坊名，像一幅攤開的古地圖。

<div align="center">
  <img src="docs/screenshots/tang.png" width="49%" alt="唐模式：明城牆虛線只佔唐城一角" />
  <img src="docs/screenshots/poi.png" width="49%" alt="景點古今對照卡" />
  <br/>
  <em>左：純唐模式，虛線為今日明城牆，僅佔唐長安東北一隅　·　右：點擊景點的古今對照</em>
</div>

## 🚀 快速開始

```bash
npm install
npm run dev        # 本地開發，預設 http://localhost:5173
npm run build      # 生產建置，產物在 dist/（純靜態）
npm run preview    # 本地預覽建置產物
```

## 🛠 技術棧

| 用途 | 選型 |
| --- | --- |
| 建置 / 框架 | Vite + React 19 + TypeScript |
| 路由 | [TanStack Router](https://tanstack.com/router)（`/` 輿圖、`/kao` 輿圖考） |
| 地圖引擎 | [MapLibre GL JS](https://maplibre.org/) |
| 底圖 | CARTO Voyager 柵格瓦片（基於 OpenStreetMap，WGS84） |
| 唐城圖層 | 執行時由 `src/data/changan.ts` 生成的 GeoJSON |

## 🧭 它是怎麼「對齊」的

唐城不是隨手畫上去的，而是按真實尺度與方位**配準到 WGS84 經緯度**：

- **坊名排佈**：逐列核對宋·宋敏求《長安志》卷七–卷十，總綱合於《唐六典》
  「皇城之南，東西十坊，南北九坊；皇城之東西各十二坊，兩市居四坊之地，凡一百一十坊」。
- **配準錨點**（三處原址未移的唐代遺存）：明德門遺址（定朱雀大街軸線與南牆）、
  含光門遺址（定皇城南牆）、丹鳳門遺址（定北牆一線）。
- **自我驗證**：配準後未經刻意校對，大雁塔恰落晉昌坊、小雁塔落安仁坊西北隅、
  大興善寺據靖善坊正中、青龍寺落新昌坊、大唐西市博物館壓西市原址——皆吻合。

> ⚠️ 本圖為**示意性復原**：坊界街衢取其大略，水系走向為意寫，**不作考古依據**。
> 完整考據與該打的折扣，見應用內「輿圖考」(`/kao`) 一頁。

整套復原邏輯集中在一個檔案裡 —— [`src/data/changan.ts`](src/data/changan.ts)，
若要校正座標、增刪坊名或典故，從這裡入手。

## ☁️ 部署

建置產物是純靜態檔案，可託管於任意靜態平台（Cloudflare、Vercel、Netlify、GitHub Pages…）。

倉庫內含 [`wrangler.jsonc`](wrangler.jsonc)，已設定為 **Cloudflare Workers 靜態資產 + SPA 回退**：

```bash
npm run deploy     # = npm run build && wrangler deploy
```

預設部署到 `https://changan-map.<你的子域>.workers.dev`，開箱即用。
如需綁定自有網域，按 `wrangler.jsonc` 內註解取消對應行並改成你自己的網域即可。

## 🌏 部署到中國大陸的注意事項

- 底圖瓦片（`basemaps.cartocdn.com`）與 Google Fonts 在大陸存取可能較慢。若主要面向大陸使用者：
  1. 瓦片換為自託管或國內可達的 **WGS84** 源 —— **切勿**使用高德/百度瓦片，
     它們是 GCJ-02 / BD-09 加偏座標，會與本圖資料錯位約 300–600 公尺；
  2. 字型（馬善政體 / 站酷小薇 / 思源宋體）改為自託管 `woff2`。

## 📁 目錄結構

```
src/
├── data/changan.ts      # 唐城復原資料與配準邏輯（核心）
├── components/
│   ├── MapView.tsx       # MapLibre 地圖與所有圖層、互動
│   ├── ControlDock.tsx   # 時空滑桿
│   └── PoiPanel.tsx      # 古今尋蹟側欄
├── pages/
│   ├── MapPage.tsx       # 主頁（輿圖）
│   └── KaoPage.tsx       # 輿圖考
└── index.css            # 絹本設色設計系統
```

## 🤝 貢獻

歡迎提 Issue 與 PR：坊名/座標校正、典故補充、底圖與字型在地化、無障礙優化等都很受歡迎。
史料類修改請在 PR 中註明出處（文獻卷次或考古報告）。

## 📜 授權

程式碼以 [MIT](./LICENSE) 授權條款開源。

坊名、城建尺度等史料出自《長安志》《唐六典》等公有領域文獻；
底圖資料 © [OpenStreetMap](https://www.openstreetmap.org/copyright) 貢獻者，瓦片樣式 © [CARTO](https://carto.com/)。

## 🙏 致謝

- 宋·宋敏求《長安志》、《唐六典》及歷代唐長安城考古復原研究；
- [MapLibre](https://maplibre.org/)、[CARTO](https://carto.com/)、[OpenStreetMap](https://www.openstreetmap.org/) 社群；
- 靈感源自**陝西歷史博物館**的唐長安城疊層對照地圖。

<div align="center">
<sub>長安一直在這裡。它只是換了個名字，叫西安。</sub>
</div>
