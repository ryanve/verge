[verge](http://github.com/ryanve/verge)
=======

[verge](http://github.com/ryanve/verge) provides viewport utils and area filters that work as a standalone lib or as a jQuery plugin. 

# Methods

To simplify the docs below, let `$` represent `verge` or the host lib.

## chainable

The chainable versions of `inX`/`inY`/`inViewport` are **filters** designed for use with jQuery (or jQuery-compatible hosts). All three use the same signature:

```js
/**
 * inX() / inY() / inViewport()
 * @param {number=}   verge    is an optional cushion amount in pixels to surround the
 *                             element in question. (default: 0)
 * @param {boolean=}  invert   when set to true, will invert the filter. (default: false)
 */
```

```js
$(elems).inViewport()
$(elems).inViewport(verge)
$(elems).inViewport(verge, invert)
```

### $.fn.inViewport()

Filter a matched set so that it contains only elements that are in the current viewport. An element is considered in the viewport if at least one pixel of it is in the viewport. Returns the filtered set (e.g. jQuery object). 

```js
$('div').inViewport()     // contains div's in the current viewport (exact)
$('div').inViewport(100)  // contains div's in the current viewport or within 100px of it
$('div').inViewport(-100) // contains div's in the current viewport and not w/in 99px of the edge
$('div').inViewport(0, true) // contains div's that are *not* in the current viewport (exact)
```

Using the standalone `verge` object, it is also possible to filter an element array (or array-like object) into a new **array** like so:

```js
// Get array that only contains elems in the current viewport:
verge.inViewport.call(elementArray [, verge, invert])
```

### $.fn.inX()

Filter a matched set so that it contains only elements that are in the current viewport. Returns the filtered set (e.g. jQuery object). 

```js
$('div').inX()     // contains div's in the same x-axis section as the viewport
$('div').inX(100)  // contains div's in the same x-axis section as the viewport or w/in 100px of it
$('div').inX(0, true) // contains div's outside the y-axis section that the viewport in in (exact)
verge.inX.call($('div')) // get *array* that contains div's in the same x-axis section as the current viewport
```

### $.fn.inY()

Filter a matched set so that it contains only elements that are in the current viewport. Returns the filtered set (e.g. jQuery object). 

```js
$('div').inY()     // contains div's in the same y-axis section as the viewport
$('div').inY(100)  // contains div's in the same y-axis section as the viewport or w/in 100px of it
$('div').inY(0, true) // contains div's outside the y-axis section that the viewport in in (exact)
verge.inY.call($('div')) // get *array* that contains div's in the same y-axis section as the viewport
```

## top-level

### $.viewportW()

```js
$.viewportW()            // Get the current viewport width (in pixels).
```

### $.viewportH()

```js
$.viewportH()            // Get the current viewport height (in pixels).
```

### $.inViewport()

Test if any part of an element (or the first element in a matched set) is in the current viewport. Returns boolean.

```js
$.inViewport(elem)       // true if elem is in the current viewport
$.inViewport(elem, 100)  // true if elem is in the current viewport or within 100px of it
$.inViewport(elem, -100) // true if elem is in the current viewport and not within 99px of the edge
```

If you're dealing with a page that only ever scrolls in one direction, it is slightly faster to substitute `inViewport` with `inY` or `inX`. (On pages that **never** scroll horizontally, `inX` always returns `true`. On pages that **never** scroll vertically, `inY` always returns `true`.)

```js
$.inViewport(elem) === $.inX(elem) && $.inY(elem) // always true
```

### $.inX()

Test if any part of an element (or the first element in a matched set) is in the same x-axis section as the viewport. Returns boolean. 

```js
$.inX(elem)       // true if elem is in same x-axis as the viewport (exact)
$.inX(elem, 100)  // true if elem is in same x-axis as the viewport or within 100px of it
$.inX(elem, -100) // true if elem in is the viewport and not within 99px of the edge
```

### $.inY()

Test if any part of an element (or the first element in a matched set) is in the same y-axis section as the viewport. Returns boolean.

```js
$.inY(elem)       // true if elem is in same y-axis as the viewport (exact)
$.inY(elem, 100)  // true if elem is in same y-axis as the viewport or within 100px of it
$.inY(elem, -100) // true if elem in is the viewport and not within 99px of the edge
```

### $.rectangle()

The `$.rectangle(elem [, verge])` method returns an a object containing the properties `top`, `bottom`, `left`, `right`, `width`, and `height` with respect to the top-left corner of the current viewport, and with an optional verge amount. Its return is like that of the native [getBoundingClientRect](https://developer.mozilla.org/en/DOM/element.getBoundingClientRect), plus the assurance that all six properties will exist. The optional `verge` parameter is an amount of pixels to act as a cushion around the element. If none is provided then it defaults to `0` and the rectangle will match the result of the native rectangle. If a verge is provided, the properties are adjusted according to the verge amount. If the verge is **positive** the rectangle will represent an area that is larger that the actual element. If the verge is a **negative** number then the rectangle will represent an area that is **smaller** that the actual element. 

```js
$.rectangle(elem)       // get elem's rectangle object
$.rectangle(elem, 100)  // get elem's rectangle object adjusted by 100 pixels
```

### $.bindVerger()

Convert a function into a filter for the specified wrapper. It binds a filter function to a wrapper and returns the bound function. The resulting method will be [faster](http://jsperf.com/bind-verger) than manually filtering via `$.fn.filter()` or `$.fn.not()`

```js
/**
 * @param  {function(elem [, option])}  fn         the function to convert
 * @param  {Object|function|null}       wrapper    the object or function to bind to (e.g. jQuery). 
 *                                                 (Default: `this`) If the wrapper is a function 
 *                                                 like the jQuery function, then the return of the 
 *                                                 new function would be an instanceof the wrapper.
 *                                                 Otherwise the new function will return an array.
 */
```

**Contrived example**: create a method that filters out non-sqaure elements:

```js
$.fn.isSquare = $.bindVerger(function(elem) {
	var dims = $.rectangle(elem);
	return !!dims.width && dims.width === dims.height;
}, $);
```

Then `$.fn.isSquare` could be used like so:

```js
$('div').isSquare() // contains only divs that are square
```

The `bindVerger` method is used internally to convert the top-level boolean forms of `inX` / `inY` / `inViewport` into their corresponding effin filters. For them, the `option` parameter is utilized for the specifying the verge amount. Custom functions can utilize the `option` parameter as they see fit. The signature of the new function is like that of `$.fn.inViewport()` described above—including the abilty to invert via the second parameter.


### verge.bridge()

The bridge handles the integration of methods into a host. It augments the host with the above-detailed methods. If a host is detected at runtime, the bridge will run once automatically. Existing methods on the host are **not** overwritten unless the 2nd param is set to `true`.

```js
verge.bridge(host)       // integrate verge into host (existing methods are not overwritten)
verge.bridge(host, true) // integrate verge into host (overwriting existing methods, if any)
```

```js
verge.bridge(jQuery)     // integrate verge's methods into jQuery
verge.bridge(ender)      // integrate verge's methods into ender
```

### verge.noConflict()

Destroy the global `verge` and return `verge`. Optionally call a function that gets `verge` supplied as the first arg.

```js
verge.noConflict(); // simply destroys the global
```

```js
verge.noConflict(function(verge){  
  /* use verge in here */  
});
```

# [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) usage

```js
define('verge', verge.noConflict); // define the module and simultaneously destroy the global
```

```js
define('verge', function(){ return verge; }); // define the module and keep the global too
```

# License

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