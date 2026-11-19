# @zedtech/zedkit-i18n

> **Lab experiment:** this package is a workbench, not a shelf product — don't use it in production. Steal the code if it's useful; that's the point. [Read the story behind zedkit](https://medium.com/p/ce86bfc96636).

Typed message catalogs and a React provider factory shared with
`@zedtech/zedkit-ui`. Original work by the same author.

## Install

```sh
pnpm add @zedtech/zedkit-i18n
```

## Use

```ts
import { formatMessage } from "@zedtech/zedkit-i18n";
import { createMessagesContext } from "@zedtech/zedkit-i18n/react";

const catalog = { title: "Notes", pageOf: "Page {page} of {pageCount}" };
const { MessagesProvider, useMessages } = createMessagesContext(catalog);

formatMessage(catalog.pageOf, { page: 1, pageCount: 3 });
```

The UI kit wraps the same factory for `ZedkitUiProvider` / `useUiMessages`.
