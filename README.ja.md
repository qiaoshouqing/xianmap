<div align="center">

# 長安 · 西安 — 二つの都市の地図

**唐の都・長安を実座標に合わせ、現在の西安に重ねる。**

開元通宝の銅銭をスライドさせ、千三百年を行き来する——今日の西安から、唐の長安へ。

[English](README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · 日本語 · [한국어](README.ko.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-9e3b2c.svg)](./LICENSE)
![React](https://img.shields.io/badge/React-19-4f7d77.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-b58a3a.svg)
![MapLibre](https://img.shields.io/badge/MapLibre%20GL-5-7c2d1c.svg)

</div>

---

着想のもとは、陝西歴史博物館にある重ね合わせ地図です。上層が盛唐の長安、下層が現代の西安。
二つを重ねれば、今立っているこの場所が唐の時代にはどの坊であったかが分かります。本プロジェクトは
そのアイデアを、**スマホで開いてすぐ使える**ウェブページにしたもの——西安を訪れるすべての旅人へ。

<div align="center">
  <img src="docs/screenshots/overlay.png" width="80%" alt="重ね合わせモード：唐の都が現代の街路の上に浮かぶ" />
  <br/><em>重ね合わせモード —— 唐長安の坊壁・宮城・東西市が、今日の西安の街路の上に浮かぶ</em>
</div>

## ✨ 特長

- **時空のスライダー**：開元通宝の銅銭をつまみに、「今」「重ね」「唐」の間をなめらかに移動;
- **タップで分かる**：地図のどこをタップしても、その場所が唐代にどの坊（ファン、坊）だったかを表示。
  著名な坊には逸話付き（平康坊の歓楽街、親仁坊の郭子儀の邸宅、崇業坊の「桃千樹」……三十余り）;
- **今と昔をたどる**：今日でも実際に訪れられる長安を十六か所——大雁塔・小雁塔・青龍寺・大明宮・
  含光門・大唐西市……それぞれに「今 ↔ 唐」の対照カード;
- **重なる情報層**：110 の坊、東西二市、三大宮城、曲江・芙蓉園、城内の運河、唐代のみ存在した
  十か所、そして現代の参照としての**明代城壁の輪郭**——今日の城壁内「旧城」が、唐長安の北東の
  一隅に過ぎないことが一目で分かります;
- **絹本着色の趣**：朱・金・緑青に、手書きの縦書き坊名。机に広げた古地図のように。

<div align="center">
  <img src="docs/screenshots/tang.png" width="49%" alt="唐モード：明代城壁は唐城の一隅のみ" />
  <img src="docs/screenshots/poi.png" width="49%" alt="名所の今昔対照カード" />
  <br/>
  <em>左：唐モード。破線は今日の明代城壁で、長安の北東の一隅のみ。&nbsp;&nbsp;右：名所の今昔対照カード。</em>
</div>

## 🚀 クイックスタート

```bash
npm install
npm run dev        # 開発サーバー、既定 http://localhost:5173
npm run build      # 本番ビルド → dist/（完全な静的ファイル）
npm run preview    # 本番ビルドをローカルでプレビュー
```

## 🛠 技術スタック

| 用途 | 採用 |
| --- | --- |
| ビルド / フレームワーク | Vite + React 19 + TypeScript |
| ルーティング | [TanStack Router](https://tanstack.com/router)（`/` 地図、`/kao` 典拠と注） |
| 地図エンジン | [MapLibre GL JS](https://maplibre.org/) |
| ベースマップ | CARTO Voyager ラスタータイル（OpenStreetMap ベース、WGS84） |
| 唐城レイヤー | `src/data/changan.ts` から実行時に生成される GeoJSON |

## 🧭 どうやって「重ねた」のか

唐城は手描きではなく、真の縮尺と方位で **WGS84 座標に位置合わせ**されています：

- **坊の配置**：宋・宋敏求『長安志』巻七〜十を列ごとに照合。『唐六典』の記述と整合します——
  「皇城の南、東西十坊、南北九坊。皇城の東西おのおの十二坊。両市は四坊の地を占め、凡そ一百一十坊」。
- **位置合わせの基準点**（今も原位置に残る三つの唐代遺構）：**明徳門**址（朱雀大街の軸線と
  南壁を定める）、**含光門**址（皇城の南壁）、**丹鳳門**址（北壁の線）。
- **自己検証**：位置合わせ後、特に調整せずとも、大雁塔は晋昌坊にぴたりと収まり、小雁塔は安仁坊の
  北西隅、大興善寺は靖善坊の中央、青龍寺は新昌坊、大唐西市博物館は旧西市の上——すべて一致します。

> ⚠️ 本図は**概略的な復元**です。坊界や街路は大略であり、水系は様式化されています。
> **考古学的な典拠ではありません。** 完全な出典と但し書きはアプリ内「典拠と注」(`/kao`) を参照。

復元ロジック全体は一つのファイルにまとまっています —— [`src/data/changan.ts`](src/data/changan.ts)。
座標の修正、坊の追加、逸話の寄稿はここから。

## ☁️ デプロイ

ビルド成果物は完全な静的ファイルで、任意の静的ホスティング（Cloudflare、Vercel、Netlify、
GitHub Pages…）に配置できます。

リポジトリには [`wrangler.jsonc`](wrangler.jsonc) が同梱され、**Cloudflare Workers の静的アセット
＋ SPA フォールバック**として設定済みです：

```bash
npm run deploy     # = npm run build && wrangler deploy
```

既定では `https://changan-map.<あなたのサブドメイン>.workers.dev` にデプロイされ、すぐ使えます。
独自ドメインを割り当てるには、`wrangler.jsonc` 内のコメントを解除して該当行を編集してください。

## 🌏 中国本土のユーザー向けの注意

- ベースマップのタイル（`basemaps.cartocdn.com`）と Google Fonts は中国本土からのアクセスが
  遅い場合があります。主な利用者が本土の場合：
  1. タイルを自己ホストまたは国内で到達可能な **WGS84** ソースに切り替える —— AMap／Baidu の
     タイルは**使用しないこと**。これらは偏移座標系（GCJ-02 / BD-09）で、本図と約 300〜600 m ずれます;
  2. フォント（Ma Shan Zheng / ZCOOL XiaoWei / Noto Serif SC）を `woff2` として自己ホスト。

## 📁 プロジェクト構成

```
src/
├── data/changan.ts      # 唐城の復元データと位置合わせロジック（中核）
├── components/
│   ├── MapView.tsx       # MapLibre 地図：全レイヤーと操作
│   ├── ControlDock.tsx   # 時空スライダー
│   └── PoiPanel.tsx      # 「今と昔」サイドバー
├── pages/
│   ├── MapPage.tsx       # メイン地図ページ
│   └── KaoPage.tsx       # 典拠と注
└── index.css            # 絹本着色のデザインシステム
```

## 🤝 コントリビュート

Issue と PR を歓迎します：坊名・座標の修正、逸話の追加、ベースマップやフォントのローカライズ、
アクセシビリティ改善など。史料に基づく変更は、PR に出典（文献と巻、または考古報告）をご明記ください。

## 📜 ライセンス

コードは [MIT ライセンス](./LICENSE)で公開しています。

坊名や城郭の規模などの史料は『長安志』『唐六典』などのパブリックドメイン文献に基づきます。
ベースマップデータ © [OpenStreetMap](https://www.openstreetmap.org/copyright) コントリビューター、
タイルスタイル © [CARTO](https://carto.com/)。

## 🙏 謝辞

- 宋・宋敏求『長安志』、『唐六典』、および歴代の唐長安城の考古学的復元研究;
- [MapLibre](https://maplibre.org/)、[CARTO](https://carto.com/)、[OpenStreetMap](https://www.openstreetmap.org/) の各コミュニティ;
- **陝西歴史博物館**の唐長安城・重ね合わせ地図に着想を得ました。

<div align="center">
<sub>長安は、ずっとここにある。ただ名を変えただけ——西安と。</sub>
</div>
