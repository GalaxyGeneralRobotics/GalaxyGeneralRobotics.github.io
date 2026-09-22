# 探索 GPT-6 Astra 作为策略的综合能力 · 网页交付包

2026-09-20 版本。包含完整构建的中英文报告、rollout gallery，以及可重新构建的全部网页源码。图片、图表、CSV 和本地视频按网页引用保留。

## 直接查看

安装 Node.js 22.12 或更新版本，在解压后的目录运行：

```sh
node serve.mjs
```

- 首页（English）：<http://localhost:4178/index.html>
- 首页（中文）：<http://localhost:4178/index.html?lang=zh>
- Rollout gallery：<http://localhost:4178/index.html?view=gallery>

内置服务器支持视频拖动播放，无需安装 npm 依赖。也可将本目录直接放到任意静态网站服务器上。请通过 HTTP 打开网页。

## 网页结构

首页给出总体结论、十项领先结果的对照图（FIG. 00）、六个领域的简述与核心发现，每个领域再链接到独立的子页面：

| 子页面 | URL | 内容 |
| --- | --- | --- |
| 操作 | `?view=manipulation` | RoboDojo、RoboLab、RoboCasa365 |
| 灵巧手 | `?view=dexterous` | 10 项灵巧操作任务、Sharpa 与 Allegro 手内控制 |
| 视觉导航 | `?view=navigation` | VLN-CE R2R / RxR、ObjectNav MP3D / HM3D v2 |
| 人形控制 | `?view=humanoid` | HumanoidBench 30 项任务（Unitree G1） |
| 运动与地形 | `?view=locomotion` | LAFAN1 运动追踪、平地运动、楼梯与沟隙 |
| 避障 | `?view=obstacles` | 杂乱场景避障、五点与 14-point 接口 |

`lang=zh` 与 `view=` 可组合使用，例如 `index.html?lang=zh&view=navigation`。

## 编辑和重新构建

全部 React/Vite 源码、package.json 和 lockfile 位于 `_source/app/`，运行时依赖只有 React 与 ReactDOM：

```sh
npm --prefix _source/app install
npm --prefix _source/app run build
node serve.mjs
```

构建更新根目录的 `index.html` 和 `report-assets/`（重建前可先清空 `report-assets/`），保留已有媒体、数据及独立页面。`npm --prefix _source/app run dev` 可启动带热更新的开发服务器。

> `package-lock.json` 中平台相关的可选原生依赖（`@rolldown/binding-*`、`lightningcss-*`）在打包时被裁剪，因此 `npm ci` 会报 `Invalid Version`。请使用上面的 `npm install`；如构建时提示缺少原生模块，再按提示安装对应平台的 `@rolldown/binding-<platform>` 与 `lightningcss-<platform>`（例如 `npm --prefix _source/app install --no-save @rolldown/binding-darwin-arm64 lightningcss-darwin-arm64`）。

源码布局：

| 路径 | 内容 |
| --- | --- |
| `src/App.jsx`、`src/site.js` | 路由：首页 / 领域子页面 / gallery（gallery 按需加载）；`view` 与 `lang` 参数解析、链接生成 |
| `src/app.css` | 唯一的样式表：设计 token、页面骨架、首页、报告正文、图表、视频卡片与弹窗、gallery、响应式与打印 |
| `src/i18n.jsx` | 语言 Provider、`useCopy(en, zh)`、语言切换按钮、报告标题 |
| `src/ui.jsx`、`src/media.jsx` | 报告原语（Section、Setup、Figure、Bars、DataTable、Details、Toggle、Stats…）与视频卡片 / 播放弹窗 |
| `src/chrome.jsx` | 顶部导航与页脚 |
| `src/motion.js` | 滚动入场动画（IntersectionObserver + Web Animations）与章节导航的滚动高亮；`prefers-reduced-motion` 下自动关闭 |
| `src/references.jsx` | 文内引用 `<Cite>` 与按页编号的参考文献列表、BibTeX 引用块 |
| `src/pages/` | `Landing`、`LeadingResults`（FIG. 00）、`Insights`、`DomainPage`、`GalleryPage` |
| `src/domains/index.jsx` | 六个领域的注册表：名称、导语、关键数字、首页图表、精选视频、所属章节 |
| `src/domains/<Section>.jsx` | 各评测章节的正文、图表与视频；每个组件带 `meta = {id, title}` 供章节导航使用 |
| `src/data/` | 数据模块与 `evidence/` 下的结构化记录、gallery 索引、参考文献、BibTeX |
| `src/assets/` | Poppins 400/500/600 Latin 子集（OFL，见 `Poppins-OFL.txt`）、Galbot 标识及其许可说明 |

视觉沿用 Galbot 品牌：近黑底色与钴蓝强调、Poppins 几何无衬线作标题。配色与字体集中在 `app.css` 顶部的 `:root`：底色 `--bg` / `--bg-2` / `--bg-3`、文字 `--fg` 到 `--fg-4`、钴蓝强调 `--accent` / `--accent-text`、标题字体 `--display`、正文 `--sans`、等宽 `--mono`。图表语义固定在 `ui.jsx` 的 `colors`：钴蓝一律代表 Astra 配置，石板灰一律代表对比方法。

## 文件说明

| 路径 | 内容 |
| --- | --- |
| `index.html`、`report-assets/` | 已构建的报告与 gallery |
| `_source/app/` | 可编辑、可重新构建的完整源码 |
| `media/`、`sources/navigation-mobile/` | 网页使用的图片、视频及导航/移动操作数据 |
| `joint-data/` | 图表和下载数据（含 RoboDojo / RoboLab 得分 CSV） |
| `serve.mjs` | 零依赖本地预览服务器 |
| `package-manifest.json` | 交付文件大小与 SHA-256 清单 |

原始上传 ZIP、未采用的报告素材、内部核验记录、Git 历史和 node_modules 均不打包。视频库中的 RoboLab 回放沿用 GitHub Release 视频链接，这部分视频播放需要联网；其余视频均在本地。

版权与第三方许可见 `LICENSE`、`THIRD_PARTY_NOTICES.md` 与 `_source/app/src/assets/Poppins-OFL.txt`。

## English quick start

This package contains the built bilingual website and its complete editable source. With Node.js 22.12+, run `node serve.mjs`, then open <http://localhost:4178/index.html>. The landing page carries the headline comparison and six domain summaries; each domain links to its own page via `?view=manipulation`, `?view=dexterous`, `?view=navigation`, `?view=humanoid`, `?view=locomotion` or `?view=obstacles`, and `?view=gallery` opens the rollout gallery. To rebuild, run `npm --prefix _source/app install` and `npm --prefix _source/app run build`. RoboLab rollout videos in the gallery retain their GitHub Release URLs and require an internet connection.
