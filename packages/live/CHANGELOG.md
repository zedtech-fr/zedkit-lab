# @zedtech/zedkit-live

## 0.2.1

### Patch Changes

- 13cd5e7: Rewrite the lab notice at the top of every published package README (and the repo root / getting-started docs) in reader-first voice: "Take what you need from the source. Don't ship these packages to production." No API change.
- c7943a0: Point package `repository` and `bugs` URLs at the zedkit-lab GitHub repo after the rename. No API or runtime change.
- Updated dependencies [13cd5e7]
- Updated dependencies [c7943a0]
  - @zedtech/zedkit-core@1.0.2

## 0.2.0

### Minor Changes

- 370eee2: Add `fetchJson`: GET JSON with timeout, retry, and `Retry-After`, returning a `Result`.

## 0.1.1

### Patch Changes

- 2fe5608: Point every package `homepage` at https://zedkit.app so npm package pages link the docs site.
- Updated dependencies [2fe5608]
  - @zedtech/zedkit-core@1.0.1

## 0.1.0

### Minor Changes

- 40f9ec5: Initial `@zedtech/zedkit-live`: a framework-free `LiveSource` interface, `createLiveSource`, `pollingSource` (no overlap, backoff, abort, optional dedupe), and `wsSource` (jittered reconnect, per-attempt URL, optional polling fallback).
