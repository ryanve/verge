# CHANGELOG | [current](https://github.com/ryanve/verge/blob/master/verge.js)

## 1.5.0

Major simplifications were made. All `.fn` methods were removed. ([See here.](https://github.com/ryanve/verge/issues/1)) This also allowed for the top-level `.bindVerger` and `.bridge` methods to be removed, as integration is now much more simple. See [the readme](https://github.com/ryanve/verge/blob/master/README.md). The `.noConflict` method was also removed, as this seemed rarely necessary. What we're left with is a very lightweight [static api](https://github.com/ryanve/verge/blob/master/README.md). Basically devs can decide how and if they want to implement effins, while [verge](https://github.com/ryanve/verge) simply provides the functional tools to do so.