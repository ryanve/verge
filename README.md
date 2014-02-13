# [verge](../../)

<b>verge</b> is a compact set of cross-browser viewport utilities written in native JavaScript. It includes the ability to detect if an element is in the current viewport. It works as a standalone module, an [ender](#ender) module, or as a [jQuery](#jquery) plugin. (<b>npm</b>: [verge](https://www.npmjs.org/package/verge))

## API ([1.9](../../releases))

- <a href="#viewportw"><b>.viewportW()</b></a>
- <a href="#viewporth"><b>.viewportH()</b></a>
- <a href="#viewport"><b>.viewport()</b></a> <b>1.8+</b>
- <a href="#inviewport"><b>.inViewport()</b></a>
- <a href="#inx"><b>.inX()</b></a>
- <a href="#iny"><b>.inY()</b></a>
- <a href="#scrollx"><b>.scrollX()</b></a>
- <a href="#scrolly"><b>.scrollY()</b></a>
- <a href="#mq"><b>.mq()</b></a> <b>1.6+</b>
- <a href="#rectangle"><b>.rectangle()</b></a>
- <a href="#aspect"><b>.aspect()</b></a> <b>1.7+</b>

#### Accuracy

- <b>verge</b>'s viewport methods represent the [CSS viewport](http://www.w3.org/TR/CSS2/visuren.html#viewport) and thus match [`@media (width)`](http://dev.w3.org/csswg/mediaqueries4/#width) and [`@media (height)`](http://dev.w3.org/csswg/mediaqueries4/#height) breakpoints.
- At certain zooms the viewport dimensions given by <b>verge</b> may be 1px off the expected `@media` value due to native rounding. For greater precision (at a slight speed tradeoff) consider [<b>actual</b>](https://github.com/ryanve/actual).

***

### .viewportW()

```js
verge.viewportW() // -> viewport width in pixels
```

### .viewportH()

```js
verge.viewportH() // -> viewport height in pixels
```

### .viewport()

Get <b>both</b> CSS viewport dimensions as an <b>object</b> with width and height properties.

```js
verge.viewportW() === verge.viewport().width  // always true
verge.viewportH() === verge.viewport().height // always true
```

The [`.viewportW()`](#viewportw) syntax is slightly faster.

### .inViewport()

Test if any part of an element (or the first element in a matched set) is in the current viewport. Returns **boolean**.

```js
verge.inViewport(elem) // true if elem is in the current viewport
verge.inViewport(elem, 100) // true if elem is in the current viewport or within 100px of it
verge.inViewport(elem, -100) // true if elem is in the current viewport and not within 99px of the edge
```

#### Performance tip for sites that only scroll along **1** axis

```js
verge.inViewport(elem) === verge.inX(elem) && verge.inY(elem) // always true
```

##### Substitute [inViewport](#inviewport) with: [inY](#iny) on *vertical* sites, [inX](#inx) on *horizontal* ones. 

- On pages without horizontal scroll, [inX](#inx) is always `true`. 
- On pages without vertical scroll, [inY](#iny) is always `true`. 
- If the viewport width is `>=` the `document` width, then [inX](#inx) is always `true`.

### .inX()

Test if any part of an element (or the first element in a matched set) is in the same x-axis section as the viewport. Returns **boolean**. 

```js
verge.inX(elem) // true if elem is in same x-axis as the viewport (exact)
verge.inX(elem, 100) // true if elem is in same x-axis as the viewport or within 100px of it
verge.inX(elem, -100) // true if elem in is the viewport and not within 99px of the edge
```

### .inY()

Test if any part of an element (or the first element in a matched set) is in the same y-axis section as the viewport. Returns **boolean**.

```js
verge.inY(elem) // true if elem is in same y-axis as the viewport (exact)
verge.inY(elem, 100) // true if elem is in same y-axis as the viewport or within 100px of it
verge.inY(elem, -100) // true if elem in is the viewport and not within 99px of the edge
```

### .scrollX()

Get the <b>horizontal</b> scroll position in pixels. (Like [`window.scrollX`](https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollX), but cross-browser.)

```js
verge.scrollX() // -> horizontal pixels scrolled
```

### .scrollY()

Get the <b>vertical</b> scroll position in pixels. (Like [`window.scrollY`](https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY), but cross-browser.)

```js
verge.scrollY() // -> vertical pixels scrolled
```

### .mq()
#### .mq(mediaQueryString)

Test if a [media query](http://airve.com/mq/) is active.

```js
verge.mq('(min-color:2)') // -> boolean
verge.mq('tv') // -> boolean
```

### .rectangle()
#### .rectangle(element, cushion?)

Get an a <b>object</b> containing the properties `top`, `bottom`, `left`, `right`, `width`, and `height` with respect to the top-left corner of the current viewport, and with an optional cushion amount. Its return is like that of the native [getBoundingClientRect](https://developer.mozilla.org/en/DOM/element.getBoundingClientRect).

The optional <b>cushion</b> parameter is an amount of pixels to act as a cushion around the element. If none is provided then it defaults to `0` and the rectangle will match the native rectangle. If a cushion is specified, the properties are adjusted according to the cushion amount. If the cushion is **positive** the rectangle will represent an area that is larger that the actual element. If the cushion is **negative** then the rectangle will represent an area that is **smaller** that the actual element. 

```js
verge.rectangle(element) // rectangle object
verge.rectangle(element, 100) // rectangle object adjusted by 100 pixels
```

### .aspect()
#### .aspect(object?)

Get the aspect ratio of the viewport <b>or</b> of an object with width/height properties.

```js
verge.aspect() // -> viewport aspect ratio
verge.aspect(element) // -> element aspect ratio
verge.aspect(screen) // -> device aspect ratio
1 < verge.aspect() // => landscape orientation
```

## Integrate

### <a href="http://jquery.com">jQuery</a>

```js
jQuery.extend(verge)
```

### <a href="https://github.com/ender-js">ender</a>


```sh
$ ender build verge
```

## Contribute

Contribute by making edits in [`/src`](./src) or reporting [issues](../../issues).

```sh
$ npm install
$ grunt jshint:src
```

## Fund

<b>[Tip the developer](https://www.gittip.com/ryanve/)</b> =)

## License

[MIT](http://opensource.org/licenses/MIT)