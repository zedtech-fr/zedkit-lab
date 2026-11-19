# @zedtech/zedkit-payload-access

## 0.1.2

### Patch Changes

- 13cd5e7: Rewrite the lab notice at the top of every published package README (and the repo root / getting-started docs) in reader-first voice: "Take what you need from the source. Don't ship these packages to production." No API change.
- c7943a0: Point package `repository` and `bugs` URLs at the zedkit-lab GitHub repo after the rename. No API or runtime change.

## 0.1.1

### Patch Changes

- 2fe5608: Point every package `homepage` at https://zedkit.app so npm package pages link the docs site.

## 0.1.0

### Minor Changes

- a6ebc75: Initial `@zedtech/zedkit-payload-access`: `granted`, `roleOfRequest`, `collectionAccess`, `globalAccess`, `withGeneratedAccess` and `withGeneratedGlobalAccess` compile role grants you pass in to default-deny Payload access functions.
