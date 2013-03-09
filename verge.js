/*!
 * verge        viewport utilities module
 * @link        verge.airve.com
 * @license     MIT
 * @copyright   2012 Ryan Van Etten
 * @version     1.6.3
 */

/*jslint browser: true, devel: true, node: true, passfail: false, bitwise: true
, continue: true, debug: true, eqeq: true, es5: true, forin: true, newcap: true
, nomen: true, plusplus: true, regexp: true, undef: true, sloppy: true, stupid: true
, sub: true, white: true, indent: 4, maxerr: 180 */

(function(root, name, definition) {// github.com/umdjs/umd
    if (typeof module != 'undefined' && module['exports']) {
        module['exports'] = definition(); // common|node|ender
    } else { root[name] = definition(); } // browser
}(this, 'verge', function() {

    var win = window
      , docElem = document.documentElement
      , Modernizr = win['Modernizr']
      , matchMedia = win['matchMedia'] || win['msMatchMedia']
      , mq = matchMedia ? function(q) {
            return !!matchMedia.call(win, q).matches;
        } : function() {
            return false;
        }
      , makeViewportGetter = function(dim, inner, client) {
            // @link  responsejs.com/labs/dimensions/
            // @link  quirksmode.org/mobile/viewports2.html
            // @link  github.com/ryanve/response.js/issues/17
            return (docElem[client] < win[inner] && mq('(min-' + dim + ':' + win[inner] + 'px)')
                ? function() { return win[inner]; }
                : function() { return docElem[client]; }
            );
        }
      , viewportW = makeViewportGetter('width', 'innerWidth', 'clientWidth')
      , viewportH = makeViewportGetter('height', 'innerHeight', 'clientHeight')
      , xports = {}
      , effins = {};
      
    xports['mq'] = !matchMedia && Modernizr && Modernizr['mq'] || mq;
    xports['matchMedia'] = matchMedia ? function() {
        // matchMedia must be binded to window
        return matchMedia.apply(win, arguments);
    } : function() {
        return {};
    };

    /** 
     * Get the layout viewport width.
     * @since   1.0.0
     * @return  {number}
     */
    xports['viewportW'] = viewportW;

    /** 
     * Get the layout viewport height.
     * @since   1.0.0
     * @return  {number}
     */
    xports['viewportH'] = viewportH;
    
    /** 
     * Cross-browser version of window.scrollX
     * @since   1.0.0
     * @return  {number}
     */
    function scrollX() {
        return win.pageXOffset || docElem.scrollLeft; 
    }
    xports['scrollX'] = scrollX;

    /** 
     * Cross-browser version of window.scrollY
     * @since   1.0.0
     * @return  {number}
     */
    function scrollY() {
        return win.pageYOffset || docElem.scrollTop; 
    }
    xports['scrollY'] = scrollY;

    /** 
     * Cross-browser element.getBoundingClientRect plus optional cushion. Coords are 
     * relative to the top-left corner of the viewport.
     * @since  1.0.0
     * @param  {Object|Array} el       DOM element or collection (defaults to first item)
     * @param  {number=}      cushion  +/- pixel amount to act as a cushion around the viewport
     * @param  {*=}           nix      if truthy, assumes v/i/o iterator and `cushion` resets to 0
     * @return {Object|undefined}
     */
    function rectangle(el, cushion, nix) {
        var o = {};
        el && !el.nodeType && (el = el[0]);
        if (!el || 1 !== el.nodeType) { return; }
        cushion = typeof cushion == 'number' && !nix && cushion || 0;
        el = el.getBoundingClientRect(); // read-only
        o['width'] = (o['right'] = el['right'] + cushion) - (o['left'] = el['left'] - cushion);
        o['height'] = (o['bottom'] = el['bottom'] + cushion) - (o['top'] = el['top'] - cushion);
        return o;
    }
    xports['rectangle'] = rectangle;
    effins['rectangle'] = function(cushion) {
        return rectangle(this, cushion);
    };

    /**
     * Determine if an element is in the same section 
     * of the x-axis as the current viewport is.
     * @since   1.0.0
     * @param   {Object}   el
     * @param   {number=}  cushion
     * @return  {boolean}
     */
    function inX(el, cushion) {
        var r = rectangle(el, cushion);
        return !!r && r.right >= 0 && r.left <= viewportW();
    }
    xports['inX'] = inX;

    /**
     * Determine if an element is in the same section 
     * of the y-axis as the current viewport is.
     * @since   1.0.0
     * @param   {Object}   el
     * @param   {number=}  cushion
     * @return  {boolean}
     */
    function inY(el, cushion) {
        var r = rectangle(el, cushion);
        return !!r && r.bottom >= 0 && r.top <= viewportH();
    }
    xports['inY'] = inY;

    /**
     * Determine if an element is in the current viewport.
     * @since   1.0.0
     * @param   {Object}   el
     * @param   {number=}  cushion
     * @return  {boolean}
     */
    function inViewport(el, cushion) {
        // Equiv to `inX(el, cushion) && inY(el, cushion)` but just manually do both 
        // to avoid calling rectangle() twice. It gzips just as small like this.
        var r = rectangle(el, cushion);
        return !!r && r.bottom >= 0 && r.right >= 0 && r.top <= viewportH() && r.left <= viewportW();
    }
    xports['inViewport'] = inViewport;

    // xports['fn'] = effins;
    return xports;

}));