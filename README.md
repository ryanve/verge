[verge](http://github.com/ryanve/verge)
=======

[verge](http://github.com/ryanve/verge) is a compact (<1k gzipped) set of cross-browser viewport utilities written in native JavaScript. It includes the ability to detect if an element is in the current viewport. It works as a standalone module, an [ender](http://ender.jit.su) module, or as a [jQuery](http://jquery.com) plugin.

## installation

#### [jQuery](http://jquery.com)

```js
jQuery.extend(verge); // augment jQuery with methods from verge
```

#### [NPM](https://npmjs.org/package/verge)

```
$ npm install verge
```

## methods [(1.6)](https://github.com/ryanve/verge/blob/master/CHANGELOG.md)

### notes

In standalone usage, methods are available on the **verge** namespace: `verge.scrollY()`, ...

The docs below use `$` to denote `verge` or a host lib (like jQuery or ender).

### $.viewportW()

```js
$.viewportW()            // Get the current viewport width (in pixels).
```

### $.viewportH()

```js
$.viewportH()            // Get the current viewport height (in pixels).
```

### $.inViewport()

Test if any part of an element (or the first element in a matched set) is in the current viewport. Returns **boolean**.

```js
$.inViewport(elem)       // true if elem is in the current viewport
$.inViewport(elem, 100)  // true if elem is in the current viewport or within 100px of it
$.inViewport(elem, -100) // true if elem is in the current viewport and not within 99px of the edge
```

**Tip:** If you're dealing with a page that only ever scrolls in one direction, it is faster to substitute `inViewport` with `inY` or `inX`. On pages that **never** scroll horizontally, `inX` always returns `true`. On pages that **never** scroll vertically, `inY` always returns `true`. In other words, use `inY` on sites that scroll **only** vertically, and `inX` on sites that scroll **only** horizontally. If the viewport width is greater than or equal to the `document` width, then `inX` will always return `true`.

```js
$.inViewport(elem) === $.inX(elem) && $.inY(elem) // always true
```

### $.inX()

Test if any part of an element (or the first element in a matched set) is in the same x-axis section as the viewport. Returns **boolean**. 

```js
$.inX(elem)       // true if elem is in same x-axis as the viewport (exact)
$.inX(elem, 100)  // true if elem is in same x-axis as the viewport or within 100px of it
$.inX(elem, -100) // true if elem in is the viewport and not within 99px of the edge
```

### $.inY()

Test if any part of an element (or the first element in a matched set) is in the same y-axis section as the viewport. Returns **boolean**.

### $.mq()

Test if a media query is active.

```js
$.mq(mediaQueryString)
$.mq('(orientation:portrait)')
```

```js
$.inY(elem)       // true if elem is in same y-axis as the viewport (exact)
$.inY(elem, 100)  // true if elem is in same y-axis as the viewport or within 100px of it
$.inY(elem, -100) // true if elem in is the viewport and not within 99px of the edge
```

### $.rectangle()

The `$.rectangle(elem [, cushion])` method returns an a object containing the properties `top`, `bottom`, `left`, `right`, `width`, and `height` with respect to the top-left corner of the current viewport, and with an optional cushion amount. Its return is like that of the native [getBoundingClientRect](https://developer.mozilla.org/en/DOM/element.getBoundingClientRect) (with the added assurance that all six properties will exist).

The optional `cushion` parameter is an amount of pixels to act as a cushion around the element. If none is provided then it defaults to `0` and the rectangle will match the result of the native rectangle. If a cushion is specified, the properties are adjusted according to the cushion amount. If the cushion is **positive** the rectangle will represent an area that is larger that the actual element. If the cushion is **negative** then the rectangle will represent an area that is **smaller** that the actual element. 

```js
$.rectangle(elem)       // get elem's rectangle object
$.rectangle(elem, 100)  // get elem's rectangle object adjusted by 100 pixels
```

## libs that use verge 

[Response JS](https://github.com/ryanve/response.js)


## license

### [verge](http://github.com/ryanve/verge) is available under the [MIT license](http://en.wikipedia.org/wiki/MIT_License)

Copyright (C) 2012 by [Ryan Van Etten](https://github.com/ryanve)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.