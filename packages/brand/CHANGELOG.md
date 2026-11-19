# @zedtech/zedkit-brand

## 0.1.2

### Patch Changes

- 13cd5e7: Rewrite the lab notice at the top of every published package README (and the repo root / getting-started docs) in reader-first voice: "Take what you need from the source. Don't ship these packages to production." No API change.
- c7943a0: Point package `repository` and `bugs` URLs at the zedkit-lab GitHub repo after the rename. No API or runtime change.

## 0.1.1

### Patch Changes

- 2fe5608: Point every package `homepage` at https://zedkit.app so npm package pages link the docs site.

## 0.1.0

### Minor Changes

- 4a751a2: Add `@zedtech/zedkit-brand`: the zedkit Z-wave mark and wordmark as SVG files (light and dark), `logoSvg` and `logoAsset` for favicon, apple-touch and social card sources, and a React `ZedkitLogo`. It is standalone and does not touch `@zedtech/zedkit-ui`.
