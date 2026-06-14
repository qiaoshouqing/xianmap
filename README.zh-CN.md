<div align="center">

# 長安 · 西安 — 双城舆图

**把唐代长安城按真实坐标，叠回今天的西安。**

拖动一枚开元通宝铜钱，在「今日西安」与「大唐长安」之间穿越一千三百年。

[English](README.md) · 简体中文 · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-9e3b2c.svg)](./LICENSE)
![React](https://img.shields.io/badge/React-19-4f7d77.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-b58a3a.svg)
![MapLibre](https://img.shields.io/badge/MapLibre%20GL-5-7c2d1c.svg)

</div>

---

灵感来自陕西历史博物馆的一张叠层地图：上层是盛唐长安，下层是现代西安，两层对照，
便知此刻脚下唐时是何坊。本项目把这个想法做成了一个**可在手机上打开、即点即用**的网页，
献给每一个来西安的旅行者。

<div align="center">
  <img src="docs/screenshots/overlay.png" width="80%" alt="叠加模式：唐城绢图浮在现代街道之上" />
  <br/><em>叠加模式 —— 唐长安的坊墙、宫城、两市，浮在今日西安的街道之上</em>
</div>

## ✨ 特性

- **时空滑杆**：以开元通宝铜钱为滑钮，在「今」「叠」「唐」之间无级过渡；
- **即点即知**：点击地图任意一处，弹窗告诉你此地唐时属于哪一坊，名坊附以典故
  （平康坊的北里、亲仁坊的郭子仪宅、崇业坊的"桃千树"……三十余条）；
- **古今寻迹**：十六处今天仍能亲身抵达的长安——大雁塔、小雁塔、青龙寺、大明宫、
  含光门、大唐西市……每处配「今 ↔ 唐」对照卡；
- **信息层叠**：110 坊、东西两市、三大内、曲江芙蓉园、城中渠水、十处唐迹点位、
  以及作为今古参照的**明城墙轮廓**——一眼看出今西安城只占唐长安东北一角；
- **绢本设色**：朱砂、泥金、石绿配手写体竖排坊名，像一幅摊开的古地图。

<div align="center">
  <img src="docs/screenshots/tang.png" width="49%" alt="唐模式：明城墙虚线只占唐城一角" />
  <img src="docs/screenshots/poi.png" width="49%" alt="景点古今对照卡" />
  <br/>
  <em>左：纯唐模式，虚线为今日明城墙，仅占唐长安东北一隅　·　右：点击景点的古今对照</em>
</div>

## 🚀 快速开始

```bash
npm install
npm run dev        # 本地开发，默认 http://localhost:5173
npm run build      # 生产构建，产物在 dist/（纯静态）
npm run preview    # 本地预览构建产物
```

## 🛠 技术栈

| 用途 | 选型 |
| --- | --- |
| 构建 / 框架 | Vite + React 19 + TypeScript |
| 路由 | [TanStack Router](https://tanstack.com/router)（`/` 舆图、`/kao` 舆图考） |
| 地图引擎 | [MapLibre GL JS](https://maplibre.org/) |
| 底图 | CARTO Voyager 栅格瓦片（基于 OpenStreetMap，WGS84） |
| 唐城图层 | 运行时由 `src/data/changan.ts` 生成的 GeoJSON |

## 🧭 它是怎么"对齐"的

唐城不是随手画上去的，而是按真实尺度与方位**配准到 WGS84 经纬度**：

- **坊名排布**：逐列核对宋·宋敏求《长安志》卷七–卷十，总纲合于《唐六典》
  "皇城之南，东西十坊，南北九坊；皇城之东西各十二坊，两市居四坊之地，凡一百一十坊"。
- **配准锚点**（三处原址未移的唐代遗存）：明德门遗址（定朱雀大街轴线与南墙）、
  含光门遗址（定皇城南墙）、丹凤门遗址（定北墙一线）。
- **自我验证**：配准后未经刻意校对，大雁塔恰落晋昌坊、小雁塔落安仁坊西北隅、
  大兴善寺据靖善坊正中、青龙寺落新昌坊、大唐西市博物馆压西市原址——皆吻合。

> ⚠️ 本图为**示意性复原**：坊界街衢取其大略，水系走向为意写，**不作考古依据**。
> 完整考据与该打的折扣，见应用内「舆图考」(`/kao`) 一页。

整套复原逻辑集中在一个文件里 —— [`src/data/changan.ts`](src/data/changan.ts)，
若要校正坐标、增删坊名或典故，从这里入手。

## ☁️ 部署

构建产物是纯静态文件，可托管于任意静态平台（Cloudflare、Vercel、Netlify、GitHub Pages…）。

仓库内含 [`wrangler.jsonc`](wrangler.jsonc)，已配置为 **Cloudflare Workers 静态资产 + SPA 回退**：

```bash
npm run deploy     # = npm run build && wrangler deploy
```

默认部署到 `https://changan-map.<你的子域>.workers.dev`，开箱即用。
如需绑定自有域名，按 `wrangler.jsonc` 内注释取消对应行并改成你自己的域名即可。

## 🇨🇳 部署到中国大陆的注意事项

- 底图瓦片（`basemaps.cartocdn.com`）与 Google Fonts 在大陆访问可能较慢。若主要面向大陆用户：
  1. 瓦片换为自托管或国内可达的 **WGS84** 源 —— **切勿**使用高德/百度瓦片，
     它们是 GCJ-02 / BD-09 加偏坐标，会与本图数据错位约 300–600 米；
  2. 字体（马善政体 / 站酷小薇 / 思源宋体）改为自托管 `woff2`。

## 📁 目录结构

```
src/
├── data/changan.ts      # 唐城复原数据与配准逻辑（核心）
├── components/
│   ├── MapView.tsx       # MapLibre 地图与所有图层、交互
│   ├── ControlDock.tsx   # 时空滑杆
│   └── PoiPanel.tsx      # 古今寻迹侧栏
├── pages/
│   ├── MapPage.tsx       # 主页（舆图）
│   └── KaoPage.tsx       # 舆图考
└── index.css            # 绢本设色设计系统
```

## 🤝 贡献

欢迎提 Issue 与 PR：坊名/坐标校正、典故补充、底图与字体本地化、无障碍优化等都很受欢迎。
史料类修改请在 PR 中注明出处（文献卷次或考古报告）。

## 📜 许可证

代码以 [MIT](./LICENSE) 许可证开源。

坊名、城建尺度等史料出自《长安志》《唐六典》等公有领域文献；
底图数据 © [OpenStreetMap](https://www.openstreetmap.org/copyright) 贡献者，瓦片样式 © [CARTO](https://carto.com/)。

## 🙏 致谢

- 宋·宋敏求《长安志》、《唐六典》及历代唐长安城考古复原研究；
- [MapLibre](https://maplibre.org/)、[CARTO](https://carto.com/)、[OpenStreetMap](https://www.openstreetmap.org/) 社区；
- 灵感源自**陕西历史博物馆**的唐长安城叠层对照地图。

<div align="center">
<sub>长安一直在这里。它只是换了个名字，叫西安。</sub>
</div>
