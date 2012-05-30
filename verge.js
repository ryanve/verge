/*!
 * verge        viewport utils and area filters that work
 *              as a standalone lib or as a jQuery plugin
 * 
 * @author      Ryan Van Etten (c) 2012
 * @link        github.com/ryanve/verge
 * @license     MIT
 * @version     1.0.0
 */

/*jslint browser: true, devel: true, node: true, passfail: false, bitwise: true
, continue: true, debug: true, eqeq: true, es5: true, forin: true, newcap: true
, nomen: true, plusplus: true, regexp: true, undef: true, sloppy: true, stupid: true
, sub: true, white: true, indent: 4, maxerr: 50 */

(function(context, win) {

    var name = 'verge'
      , old = context[name]
      , api = {}      // holds all exports
      , effins = {}   // holds chainable fns
      , viewportW, viewportH, scrollX, scrollY, bindVerger
      , inX, inY, inViewport, rectangle
      , docElem = win.document.documentElement
    ;
        
    /** 
     * viewportW()          cross-browser viewport width
     *
     * @return  {integer}
     * @link    responsejs.com/labs/dimensions/#viewport
     */

    api['viewportW'] = viewportW = function() {
        return docElem.clientWidth; 
    };

    /** 
     * viewportH()          cross-browser viewport height
     *
     * @return  {integer}
     * @link    responsejs.com/labs/dimensions/#viewport
     */
    
    api['viewportH'] = viewportH = function() {
        return docElem.clientHeight; 
    };
    
    /** 
     * scrollX()           Cross-browser version of window.scrollX
     * @return {integer}
     */
     
    api['scrollX'] = scrollX = function scrollX() {
        return win.pageXOffset || docElem.scrollLeft; 
    };

    /** 
     * scrollY()          Cross-browser version of window.scrollY
     * @return  {integer}
     */
    
    api['scrollY'] = scrollY = function scrollY() {
        return win.pageYOffset || docElem.scrollTop; 
    };

    /** 
     * rectangle()                     getBoundingClientRect w/ optional verge parameter.
     *                                 
     * @param   {Object|Array} el      native element or node list or matched set
     * @param   {number=}      verge   (described below)
     * @return  {Object}               (if el is invalid, it returns undefined)
     */
     
    api['rectangle'] = rectangle = function(el, verge) {
        var r, o;
        el = el && (el.nodeType ? el : el[0]); // isolate node
        if (el && el.nodeType === 1) {         // elements only
            if (verge !== +verge) { verge = 0; } // non-nums become 0
            r = el.getBoundingClientRect();    // read only 
            o = {
                top:    r.top - verge
              , left:   r.left - verge
              , bottom: r.bottom + verge
              , right:  r.right + verge
            };
            o.width = o.right - o.left;   // includes verge * 2
            o.height = o.bottom - o.top;  // includes verge * 2
        }
        return o;
    };

    // The verge is the amount of pixels to act as a cushion around the viewport. It can be any 
    // integer. If verge is zero, then the inX/inY/inViewport methods are exact. If verge is set to 100, 
    // then those methods return true when for elements that are are in the viewport *or* near it, 
    // with *near* being defined as within 100 pixels outside the viewport edge. Elements immediately 
    // outside the viewport are 'on the verge' of being scrolled to.

    api['inX'] = inX = function(elem, verge) {
        var r = rectangle(elem, verge);
        return !!r && r.right >= 0 && r.left <= viewportW();
    };

    api['inY'] = inY = function(elem, verge) {
        var r = rectangle(elem, verge);
        return !!r && r.bottom >= 0 && r.top <= viewportH();
    };

    api['inViewport'] = inViewport = function(elem, verge) {
        // equiv to: inX(elem, verge) && inY(elem, verge)
        // But just manually do both to avoid calling rectangle() twice, and 
        // so that it'll fail faster. It gzips just as small this way too:
        var r = rectangle(elem, verge);
        return !!r && r.bottom >= 0 && r.right >= 0 && r.top <= viewportH() && r.left <= viewportW();
    };
    
    /**
     * noConflict()  Destroy the global and return the api. Optionally call 
     *               a function that gets the api supplied as the first arg.
     * @param        {function(*)=}    callback
     * @example      var localVerge = verge.noConflict();
     * @example      verge.noConflict(function(verge){    });
     */
    api['noConflict'] = function(callback) {
        if (typeof old === 'undefined') { 
            delete context[name]; 
        }
        else {
            context[name] = old;
        }
        if (typeof callback === 'function') { 
            callback(api); 
        }
        return api;
    };

    /**
     * bindVerger()            Convert a function into a filter for 
     *                         the specified wrapper.
     *
     * @param  {function(*)}   method    the function to convert
     * @param  {function(*)=}  wrapper   e.g. jQuery
     */
    api['bindVerger'] = bindVerger = function(method, wrapper) {
        var rewrap = 0;
        if (typeof method !== 'function') {
            throw 'invalid type';
        }
        if (typeof wrapper === 'undefined') {
            wrapper = this; 
        }
        if (typeof wrapper === 'function') {
            try {
                if (wrapper('')) { 
                    rewrap = 1;
                }
            }
            catch (e) {
                throw 'invalid wrapper'; 
            }
        }
        return function(option, invert) {
            // In here `this` refers to the current instance of the wrapper (e.g. jQuery). We 
            // could push passing els to a fresh array, and then call the wrapper on that array.
            // Instead we start with a fresh instance of the wrapper and push directly onto that. 
            // Doing it this way saves steps and prevents having to arrayify again in the wrapper.
            var i, v, j = 0
              , l = this.length
              , fresh = rewrap ? wrapper('') : [];

            invert = invert === true; // boolean

            for (i = 0; i < l; i++) {
                v = this[i]; // in case method mutates value
                // use === ! to make bool-to-bool comparison:
                if (invert === !method.call(v, v, option)) {
                    fresh[j++] = this[i];
                }
            }
            fresh.length = j; // in case fresh is not array
            return fresh;
        };
    };

    // Create area filters that are bound to api:
    effins['inX'] = bindVerger(inX, api);
    effins['inY'] = bindVerger(inY, api);
    effins['inViewport'] = bindVerger(inViewport, api);

    // Create fn.rectangle:
    effins['rectangle'] = function(verge) {
        return rectangle(this, verge);
    };

    // Expose effins:
    api['fn'] = effins;

    // Server vs browser:
    if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        module.exports = api; // nodejs.org / ender.no.de
    }
    else {// browser
        context[name] = api; // expose to global context
    }

    /**
     * bridge()      Handler for integrating (mixing out) methods into a host. It
     *               augments the host with only the listed methods. If the host is
     *               jQuery-compatible, then it'll also get the effins. Existing methods
     *               on the host are not overwritten unless the force param is set to true.
     *
     * @param {Object|function(*)}   host    the receiver
     * @param {boolean=}             force   indicates whether existing methods on the host 
     *                                       should be overwritten (default: false)
     */
    api['bridge'] = function (host, force) {
        var j, a, m;

        if (host) {

            a = [ 'inX'
                , 'inY'
                , 'inViewport'
                , 'rectangle'
                , 'bindVerger'
                , 'viewportW'
                , 'viewportH'
                , 'scrollX'
                , 'scrollY'
               ];

            j = 9; // a.length
        
            // top-level (all 9)
            while (j--) {
                m = a[j]; // method name
                if (force || typeof host[m] === 'undefined') { 
                    host[m] = api[m]; 
                }
            }

            // effins (first 4)
            if (typeof host === 'function' && host['fn']) {
                j = 4;
                while (j--) {
                    m = a[j]; // method name
                    if (force || typeof host['fn'][m] === 'undefined') {
                        // The first 3 are filters so build them w/ bindVerger:
                        host['fn'][m] = j < 3 ? bindVerger(api[m], host) : effins[m];
                    }
                }
            }
        }

        return api;
    };
    
    // Run the bridge once and return the api:
    return api['bridge'](context['$']);
    
}(this, window));