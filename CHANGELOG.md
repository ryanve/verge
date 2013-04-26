# CHANGELOG | [current](./verge.js)

## [1.7](../../tree/114f06e791367d1aca4ea621e419b5313fc1c7ab)

- Added: `verge.aspect()`
- `verge.rectangle()`: Invalid inputs now return `false` rather than `undefined`. Removed undocumented [3rd param](../../commit/798c7edd54f4ebb73b175ab4498848338295729d). 

## [1.6](../../tree/56434a5b32879a3c2bec51370d539aef9eb1518a)

- Added: `verge.matchMedia()`  and `verge.mq()`

## [1.5](../../tree/9699dfff1c6628d667073773f914af9848ca97f1)

Major simplifications were made. All `.fn` methods were removed. See [#1](../../issues/1). This also allowed for the top-level `.bindVerger` and `.bridge` methods to be removed, as integration is now much more simple. See [README.md](./README.md). The `.noConflict` unnecessary and was also removed. What left with is a lightweight [static api](./README.md). Devs can decide how and if they want to implement effins, while [verge](../) simply provides the functional tools to do so.