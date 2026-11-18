# @zedtech/zedkit-payload-seo

[![npm version](https://img.shields.io/npm/v/@zedtech/zedkit-payload-seo.svg)](https://www.npmjs.com/package/@zedtech/zedkit-payload-seo)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/zedtech-fr/zedkit-lab/blob/main/LICENSE)

> **Lab experiment:** this package is a workbench, not a shelf product — don't use it in production. Steal the code if it's useful; that's the point. [Read the story behind zedkit](https://medium.com/@romain-zt/zedkit-jai-donn%C3%A9-les-cl%C3%A9s-%C3%A0-grokbot-et-gard%C3%A9-mon-t%C3%A9l%C3%A9phone-ce86bfc96636).

Drop-in localized SEO group field for Payload CMS: meta tags, JSON-LD
and length validation, ready for i18n sites. Original work by the same
author.

## Install

```sh
pnpm add @zedtech/zedkit-payload-seo
```

## Usage

```ts
import { seoGroupField } from "@zedtech/zedkit-payload-seo";

export const Page = {
  slug: "pages",
  fields: [/* ... */, seoGroupField()],
};
```

## When to use

Reach for this package when your Payload collections need per-locale
SEO fields. To render the stored values (metadata, sitemaps, JSON-LD),
pair it with `@zedtech/zedkit-seo`.

`seoFields()` returns the nine leaf fields (meta title/description,
keywords, canonical URL, OG title/description/image, robots
noindex/nofollow); `seoGroupField()` wraps them in a group (default
name `"seo"`). Text lengths are capped (70/160) with friendly
validator messages; the OG image uploads to your media collection
(`mediaSlug` option). Pair with `@zedtech/zedkit-seo` to turn stored values
into metadata, sitemaps, and JSON-LD.
