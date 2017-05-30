# Changelog

#### [Browse](../../releases) or [compare](../../compare/1.8.0...1.9.0) releases.

## 1.10
- [No API changes.](../../pull/36)

## 1.9

- [Don't assume one wants `Modernizr.mq`](../../commit/c10da267eb3e6cc57c72e8032f8061f6671981fc)

## 1.8

- Use [grunt](GruntFile.js) to generate builds.
- Added: `verge.viewport()` as alternate syntax to get viewport dimensions.

## 1.7

- Added: `verge.aspect()`
- `verge.rectangle()`
  - Invalid inputs now return `false` rather than `undefined`.
  - Removed undocumented [iteration guard parameter](../../commit/798c7edd54f4ebb73b175ab4498848338295729d).

## 1.6

- Added: `verge.matchMedia()` and `verge.mq()`

## 1.5

- Simplified into a lightweight [static api](./README.md).
  - Removed: `.noConflict`, [`.fn`](../../issues/1), and integration methods.
