---
title: Complete Rewrite to Use React Hooks
author: Adam Klein
---

We've managed to find a way to use regular React hooks, which can leverage hooks libraries, project's custom hooks, ESLint rules and devtools.

<!--truncate-->

There were a few problems which this approach, the major one was that we couldn't define the store inside context because we had to setup the units prematurely, instead of lazily on the first use.
This is because we need the unit's initial value synchronously the first time we invoke the hook.
