# @zedtech/zedkit-storage

## 0.2.3

### Patch Changes

- 13cd5e7: Rewrite the lab notice at the top of every published package README (and the repo root / getting-started docs) in reader-first voice: "Take what you need from the source. Don't ship these packages to production." No API change.
- c7943a0: Point package `repository` and `bugs` URLs at the zedkit-lab GitHub repo after the rename. No API or runtime change.

## 0.2.2

### Patch Changes

- 2fe5608: Point every package `homepage` at https://zedkit.app so npm package pages link the docs site.
- 003d355: Rebuild with TypeScript 6.0 (explicit ambient node types in tsconfig; no public API change).

## 0.2.1

### Patch Changes

- fa7ce48: Declare `engines.node` (`>=22`) on every published package; CI blocks tarballs that omit it (reliability R33).

## 0.2.0

### Minor Changes

- 75b133d: Initial `@zedtech/zedkit-storage`: env config, key sanitising, S3 client factory (`requestChecksumCalculation: WHEN_REQUIRED`), presigned PUT/GET, head, public URL helper, and cache/CSP header helpers.
