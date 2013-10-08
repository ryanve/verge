# Changelog

#### [Browse](../../releases) or [compare](../../compare/1.7.0...1.8.0) releases.

## [1.8](../../releases/tag/1.8.0)

- Use [grunt](GruntFile.js) to generate builds.
- Added: `verge.viewport()` as alternate syntax to get viewport dimensions.

## [1.7](../../releases/tag/1.7.0)

- Added: `verge.aspect()`
- `verge.rectangle()`: Invalid inputs now return `false` rather than `undefined`. Removed undocumented [3rd param](../../commit/798c7edd54f4ebb73b175ab4498848338295729d). 

## [1.6](../../releases/tag/1.6.0)

- Added: `verge.matchMedia()`  and `verge.mq()`

## [1.5](../../releases/tag/1.5.0)

Major simplifications were made: `.fn` and related integration methods were removed (see [#1](../../issues/1)). `.noConflict` was unnecessary and also removed. What's left is a lightweight [static api](./README.md).