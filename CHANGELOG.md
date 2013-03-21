# CHANGELOG | [current](https://github.com/ryanve/verge/blob/master/verge.js)

## [1.7](https://github.com/ryanve/verge/blob/74095aff6156e3023bc49c4f388ac752b3c346d5/verge.js)

- Added: `verge.aspect()`
- `verge.rectangle()`: Invalid inputs now return `false` rather than `undefined`. Removed undocumented [3rd param](https://github.com/ryanve/verge/commit/798c7edd54f4ebb73b175ab4498848338295729d). 

## [1.6](https://github.com/ryanve/verge/blob/c33d67d70ca0fb3048d95b1d046d95f0a8b08707/verge.js)

- Added: `verge.matchMedia()`  and `verge.mq()`

## [1.5](https://github.com/ryanve/verge/blob/9699dfff1c6628d667073773f914af9848ca97f1/verge.js)

Major simplifications were made. All `.fn` methods were removed. ([See here.](https://github.com/ryanve/verge/issues/1)) This also allowed for the top-level `.bindVerger` and `.bridge` methods to be removed, as integration is now much more simple. See [the readme](https://github.com/ryanve/verge/blob/master/README.md). The `.noConflict` unnecessary and was also removed. What left with is a lightweight [static api](https://github.com/ryanve/verge/blob/master/README.md). Devs can decide how and if they want to implement effins, while [verge](https://github.com/ryanve/verge) simply provides the functional tools to do so.