# CHANGELOG | [current](https://github.com/ryanve/verge/blob/master/verge.js)

## 1.6

- Added: `verge.matchMedia`  and `verge.mq`

## 1.5

Major simplifications were made. All `.fn` methods were removed. ([See here.](https://github.com/ryanve/verge/issues/1)) This also allowed for the top-level `.bindVerger` and `.bridge` methods to be removed, as integration is now much more simple. See [the readme](https://github.com/ryanve/verge/blob/master/README.md). The `.noConflict` unnecessary and was also removed. What left with is a lightweight [static api](https://github.com/ryanve/verge/blob/master/README.md). Devs can decide how and if they want to implement effins, while [verge](https://github.com/ryanve/verge) simply provides the functional tools to do so.