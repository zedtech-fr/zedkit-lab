# @zedtech/zedkit-observability

> **Lab experiment:** this package is a workbench, not a shelf product — don't use it in production. Steal the code if it's useful; that's the point. [Read the story behind zedkit](https://medium.com/@romain-zt/zedkit-jai-donn%C3%A9-les-cl%C3%A9s-%C3%A0-grokbot-et-gard%C3%A9-mon-t%C3%A9l%C3%A9phone-ce86bfc96636).

Logger and product-analytics **ports** with console, noop, and in-memory
adapters. React apps mount `ObservabilityProvider` and read
`useLogger` / `useTracker`. Optional subpaths wrap `pino` and a browser
analytics SDK (peer dependencies).

Original work by the same author.

```ts
import { createConsoleLogger, createNoopTracker } from "@zedtech/zedkit-observability";
import { ObservabilityProvider } from "@zedtech/zedkit-observability/react";
```

See [CATALOG.md](./CATALOG.md) for needs and examples.
