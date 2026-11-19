# @zedtech/zedkit-storage

> **Lab experiment:** this package is a workbench, not a shelf product — don't use it in production. Steal the code if it's useful; that's the point. [Read the story behind zedkit](https://medium.com/@romain-zt/zedkit-jai-donn%C3%A9-les-cl%C3%A9s-%C3%A0-grokbot-et-gard%C3%A9-mon-t%C3%A9l%C3%A9phone-ce86bfc96636).

S3-compatible object storage helpers for Node services. Original work by the same author.

Peers: `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`.

The client factory sets `requestChecksumCalculation: "WHEN_REQUIRED"` so checksums are sent only when the operation requires them (compatible with many S3-compatible endpoints).

## Install

```sh
pnpm add @zedtech/zedkit-storage @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

## Environment

| Variable | Required |
|---|---|
| `STORAGE_BUCKET` | yes |
| `STORAGE_REGION` | yes |
| `STORAGE_ACCESS_KEY_ID` | yes |
| `STORAGE_SECRET_ACCESS_KEY` | yes |
| `STORAGE_ENDPOINT` | no (custom S3 API base URL) |
| `STORAGE_FORCE_PATH_STYLE` | no (`true` / `false`) |
| `STORAGE_PUBLIC_BASE_URL` | no (CDN base for `buildPublicObjectUrl`) |
| `STORAGE_KEY_PREFIX` | no |

```ts
import { createS3Client, loadStorageConfig, presignPutUrl } from "@zedtech/zedkit-storage";

const config = loadStorageConfig();
const client = createS3Client(config);
const uploadUrl = await presignPutUrl(client, config, { key: "avatar.png", contentType: "image/png" });
```
