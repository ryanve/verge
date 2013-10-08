/*!
  * =============================================================
  * Ender: open module JavaScript framework (https://ender.no.de)
  * Build: ender build aok curious bonzo blood scan elo
  * Packages: ender-js@0.5.0 aok@1.3.0 curious@0.5.0 bonzo@1.3.5 blood@0.6.0 scan@0.5.4 elo@1.5.4
  * =============================================================
  */

/*!
  * Ender: open module JavaScript framework (client-lib)
  * copyright Dustin Diaz & Jacob Thornton 2011-2012 (@ded @fat)
  * http://ender.jit.su
  * License MIT
  */
(function (context, window, document) {

  // a global object for node.js module compatiblity
  // ============================================

  context['global'] = context

  // Implements simple module system
  // loosely based on CommonJS Modules spec v1.1.1
  // ============================================

  var modules = {}
    , old = context['$']
    , oldEnder = context['ender']
    , oldRequire = context['require']
    , oldProvide = context['provide']

  /**
   * @param {string} name
   */
  function require(name) {
    // modules can be required from ender's build system, or found on the window
    var module = modules['$' + name] || window[name]
    if (!module) throw new Error("Ender Error: Requested module '" + name + "' has not been defined.")
    return module
  }

  /**
   * @param {string} name
   * @param {*}      what
   */
  function provide(name, what) {
    return (modules['$' + name] = what)
  }

  context['provide'] = provide
  context['require'] = require

  function aug(o, o2) {
    for (var k in o2) k != 'noConflict' && k != '_VERSION' && (o[k] = o2[k])
    return o
  }
  
  /**
   * @param   {*}  o  is an item to count
   * @return  {number|boolean}
   */
  function count(o) {
    if (typeof o != 'object' || !o || o.nodeType || o === window)
      return false
    return typeof (o = o.length) == 'number' && o === o ? o : false
  }

  /**
   * @constructor
   * @param  {*=}      item   selector|node|collection|callback|anything
   * @param  {Object=} root   node(s) from which to base selector queries
   */  
  function Ender(item, root) {
    var i
    this.length = 0 // Ensure that instance owns length

    if (typeof item == 'string')
      // Start @ strings so the result parlays into the other checks
      // The .selector prop only applies to strings
      item = ender['_select'](this['selector'] = item, root)

    if (null == item)
      return this // Do not wrap null|undefined

    if (typeof item == 'function')
      ender['_closure'](item, root)

    // DOM node | scalar | not array-like
    else if (false === (i = count(item)))
      this[this.length++] = item

    // Array-like - Bitwise ensures integer length:
    else for (this.length = i = i > 0 ? i >> 0 : 0; i--;)
      this[i] = item[i]
  }
  
  /**
   * @param  {*=}      item   selector|node|collection|callback|anything
   * @param  {Object=} root   node(s) from which to base selector queries
   * @return {Ender}
   */
  function ender(item, root) {
    return new Ender(item, root)
  }

  ender['_VERSION'] = '0.4.x'

  // Sync the prototypes for jQuery compatibility
  ender['fn'] = ender.prototype = Ender.prototype 

  Ender.prototype['$'] = ender // handy reference to self

  // dev tools secret sauce
  Ender.prototype['splice'] = function () { throw new Error('Not implemented') }
  
  /**
   * @param   {function(*, number, Ender)} fn
   * @param   {Object=} opt_scope
   * @return  {Ender}
   */
  Ender.prototype['forEach'] = function (fn, opt_scope) {
    var i, l
    // opt out of native forEach so we can intentionally call our own scope
    // defaulting to the current item and be able to return self
    for (i = 0, l = this.length; i < l; ++i) i in this && fn.call(opt_scope || this[i], this[i], i, this)
    // return self for chaining
    return this
  }

  /**
   * @param {Object|Function} o
   * @param {boolean=}        chain
   */
  ender['ender'] = function (o, chain) {
    aug(chain ? Ender.prototype : ender, o)
  }

  /**
   * @param {string}  s
   * @param {Node=}   r
   */
  ender['_select'] = function (s, r) {
    return s ? (r || document).querySelectorAll(s) : []
  }

  /**
   * @param {Function} fn
   */
  ender['_closure'] = function (fn) {
    fn.call(document, ender)
  }

  /**
   * @param {(boolean|Function)=} fn  optional flag or callback
   * To unclaim the global $, use no args. To unclaim *all* ender globals, 
   * use `true` or a callback that receives (require, provide, ender)
   */
  ender['noConflict'] = function (fn) {
    context['$'] = old
    if (fn) {
      context['provide'] = oldProvide
      context['require'] = oldRequire
      context['ender'] = oldEnder
      typeof fn == 'function' && fn(require, provide, this)
    }
    return this
  }

  if (typeof module !== 'undefined' && module['exports']) module['exports'] = ender
  // use subscript notation as extern for Closure compilation
  // developers.google.com/closure/compiler/docs/api-tutorial3
  context['ender'] = context['$'] = ender

}(this, window, document));

(function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
   * aok 1.3.0+201309070321
   * https://github.com/ryanve/aok
   * MIT License 2013 Ryan Van Etten
   */

  (function(root, name, make) {
      typeof module != 'undefined' && module['exports'] ? module['exports'] = make() : root[name] = make();
  }(this, 'aok', function() {

      var globe = (function() { return this; }())
        , plain = {}
        , owns = plain.hasOwnProperty
        , toString = plain.toString
        , win = typeof window != 'undefined' && window
        , doc = typeof document != 'undefined' && document
        , nativeConsole = typeof console != 'undefined' && console
        , hasAlert = win && 'alert' in win
        , uid = 0;
      
      /**
       * @constructor 
       * @param  {*=}  data
       */
      function Aok(data) {
          // Own 'test' unless instantiated w/o args,
          // or unless `data` is 'object' w/o 'test'.
          // Running proceeds only if 'test' is owned.
          if (data && typeof data == 'object')
              for (var k in data) owns.call(data, k) && (this[k] = data[k]); 
          else arguments.length && (this['test'] = data);
          this['init']();
      }

      /**
       * @param  {*=}  data
       * @return {Aok}
       */
      function aok(data) {
          return arguments.length ? new Aok(data) : new Aok; 
      }
    
      // Sync the prototypes
      aok.prototype = Aok.prototype;
    
      // Default messages
      aok.prototype['pass'] = 'Pass';
      aok.prototype['fail'] = 'Fail';
    
      // Console abstractions
      (function(target, console, hasAlert, win) {
          /**
           * @param  {string}            name
           * @param  {(boolean|number)=} force
           * @param  {string=}           key
           */
          function assign(name, force, key) {
              var method = console && typeof console[name] == 'function' ? function() {
                  console[name].apply(console, arguments);
              } : hasAlert ? function() {
                  method['force'] && win.alert(name + ': ' + [].join.call(arguments, ' '));
              } : function() {};
              method['force'] = !!force;
              target[key || name] = method;
          }
        
          assign('info', 1);
          assign('warn', 1);
          assign('error', 1);
          assign('trace');
          assign('log');
          assign('log', 0, 'express');
      }(aok, nativeConsole, hasAlert, win));
    
      // Alias the "express" method. `aok.prototype.express` is used in the 
      // default handler. Override it as needed for customization.
      aok.prototype['express'] = aok['express'];
    
      /**
       * @param  {*}  item
       * @return {string}
       */
      function explain(item) {
          return '' + (item === Object(item) ? toString.call(item) : item);
      }
      aok['explain'] = explain;
    
      /**
       * @param {Function|Object|*} o
       * @param {(string|number)=}  k  
       * @example result(0)      // 0
       * @example result([1], 0) // 1
       */
      function result(o, k) {
          return 2 == arguments.length ? result.call(o, o[k]) : typeof o == 'function' ? o.call(this) : o;
      }
      aok['result'] = result;

      /**
       * Get a new function that uses try/catch to test if `fn` can run.
       * @param  {Function|string} fn  callback or key
       * @return {Function}
       */
      aok['can'] = function(fn) {
          return function() {
              try {
                  (typeof fn == 'string' ? this[fn] : fn).apply(this, arguments);
              } catch (e) { return false; }
              return true;
          };
      };

      /**
       * @return {Aok}
       */
      aok.prototype['init'] = function() {
          if (this === globe) throw new Error('@this');
          owns.call(this, 'id') || (this['id'] = ++uid);
          owns.call(this, 'test') && this['run']();
          return this;
      };
    
      /**
       * @return {Aok}
       */
      aok.prototype['run'] = function() {
          if (this === globe) throw new Error('@this');
          this['test'] = !!result(this, 'test'); // Run the test.
          return this['handler'](); // Trigger the handler.
      };
    
      /**
       * @param  {(string|number)=}    key
       */
      aok.prototype['cull'] = function(key) {
          return this[this[null == key ? 'test' : key] ? 'pass' : 'fail'];
      };

      /**
       * default handler can be overridden
       * @return {Aok}
       */
      aok.prototype['handler'] = function() {
          var msg = this['cull']();
          if (typeof msg == 'function') {
              msg.call(this);
          } else {
              msg = explain(msg);
              owns.call(this, 'remark') && (msg += ' (' + explain(this['remark']) + ')');
              this['express']('#' + this['id'] + ': ' + msg); 
          }
          return this;
      };
    
      /**
       * @param  {string}  n   
       * @return {Node|boolean}
       */
      aok['id'] = function(n) {
          return doc.getElementById(n) || false;
      };

      return aok;
  }));
  if (typeof provide == "function") provide("aok", module.exports);
  $.ender(module.exports);
}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
   * curious 0.5.0+201309210304
   * https://github.com/ryanve/curious
   * MIT License 2013 Ryan Van Etten
   */

  !function(root, name, make) {
      if (typeof module != 'undefined' && module['exports']) module['exports'] = make.call(root);
      else root[name] = make.call(root);
  }(this, 'curious', function() {

      var xports = {}
        , globe = (function() { return this; }())
        , types = /function|object|string|number|boolean|undefined/
        , owns = xports.hasOwnProperty
        , toString = xports.toString;

      /**
       * @param   {*}      item    item to test
       * @param   {string} type    case-sensitive type to test for
       * @return  {boolean}
       * @example is(item, 'object')  # true for typeof "object"
       * @example is(item, 'Object')  # true for [object Object]
       * @example is(item, 'null')    # true if item === null
       */
      function is(item, type) {
          if (typeof item === type) return true; // object|function|undefined|number|boolean|string
          if (null == item || item !== item) return ('' + item) === type; // null|undefined|NaN
          return ('[object ' + type + ']') === toString.call(item); // Object|Array|RegExp|Date|...
      }
      xports['is'] = is;

      /**
       * @param  {*}  a
       * @param  {*=} b
       * @return {boolean}
       */
      function it(a, b) {
          // Emulate ES6 Object.is
          return a === b ? (0 !== a || 1/a === 1/b) : a !== a && b !== b;
      }

      /**
       * @param  {(string|*)=} type  a string type to test via `is` OR a value to compare.
       * @param  {boolean=}    inv   Invert the test by setting `inv` to `true`.
       * @return {Function}
       */
      function automateIs(type, inv) {
          inv = true === inv;
          return typeof type == 'string' ? types.test(type) ? function(o) {
              return (typeof o === type) != inv; 
          } : function(o) {
              return is(o, type) != inv; 
          } : function(o) {
              return it(o, type) != inv;
          };
      }
      is['automate'] = automateIs;
    
      function isWindow(o) {
          return null != o && o == o.window;
      }
      xports['isWindow'] = isWindow;
      xports['isGlobe'] = automateIs(globe);

      // Use the native isArray when available.
      var isArray = xports['isArray'] = is['Array'] = Array.isArray || automateIs('Array');

      // In modern browsers, `window` is not [object Object]. Normalize that.
      xports['isObject'] = is['Object'] = isWindow(globe) && is(globe, 'Object') ? function(item) {
          return !isWindow(item) && is(item, 'Object');
      } : automateIs('Object');
    
      xports['isArguments'] = is['Arguments'] = !is(arguments, 'Arguments') ? function(item) {
          return !!(item && owns.call(item, 'callee'));
      } : automateIs('Arguments');
    
      // ~ github.com/ded/valentine
      is['boo'] = automateIs('boolean');
      is['obj'] = automateIs('object');
      is['num'] = automateIs('number');
      is['str'] = automateIs('string');
      is['fun'] = xports['isFunction'] = automateIs('function');
      //is['und'] = xports['isUndefined'] = automateIs();
      is['und'] = automateIs();
      is['def'] = automateIs(void 0, true);
    
      // + oper coerces funcs and plain objs to NaN 
      xports['isNaN'] = is['nan'] = automateIs(+{});
    
      // ~ underscorejs.org
      // debating on whether or not to expose all of these
      xports['isRegExp'] = is['RegExp'] = is['reg'] = automateIs('RegExp');
      //xports['isNull'] = automateIs(null);
      //xports['isBoolean'] = automateIs('Boolean');
      //xports['isString'] = automateIs('String');
      //xports['isDate'] = automateIs('Date');
      //xports['isFunction'] = automateIs('Function');

      //function isRealNumber(o) {// "number" and finite
      //    return o ? typeof o == 'number' && o > (o - 1) : 0 === o; 
      //}
      //is['real'] = isRealNumber;

      /**
       * @return {number|boolean}
       */
      function isNode(o) {
          return !!o && o.nodeType || false;
      }
      xports['isNode'] = is['node'] = isNode;
    
      function automateNode(n) {
          return function(o) {
              return !!o && n === o.nodeType;
          };
      }
      isNode['automate'] = automateNode;
      xports['isElement'] = is['elem'] = automateNode(1);
    
      /**
       * @param  {*} o
       * @param  {*} k
       * @return {boolean}
       */
      //function has(o, k) {
      //    return owns.call(o, k);
      //}
      //xports['has'] = has;
    
      /**
       * @return {boolean}
       */
      //function isStack(o) {
      //    return !!o && typeof o == 'object' && !o.nodeType && o.length === +o.length && o != o.window;
      //}
  
      /**
       * @return {boolean}
       */
      function hasEnums(o) {
          for (var k in o) 
              if (owns.call(o, k)) return true;
          return false;
      }
  
      /**
       * @return {*}  o
       * @return {boolean}
       */
      xports['isEmpty'] = is['emp'] = function(o) {
          return '' === o || null == o || (isArray(o) ? 0 === o.length : !hasEnums(o));
      };
    
      /**
       * @param  {*}  a
       * @param  {*}  b
       * @return {boolean}
       */
      function isEqual(a, b) {
          var t = typeof a;
          if (a ? !b : b) return false;
          if (t != typeof b) return false; 
          if (it(a, b)) return true;
          if (!a || !b || toString.call(a) !== toString.call(b)) return false; 
          if ('object' != t && 'function' != t) return false; 
          for (t in a) if (!isEqual(a[t], b[t])) return false;
          return isEqual(+a, +b);
      }
      xports['isEqual'] = is['eq'] = isEqual;

      return xports;
  });
  if (typeof provide == "function") provide("curious", module.exports);
  $.ender(module.exports);
}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * Bonzo: DOM Utility (c) Dustin Diaz 2012
    * https://github.com/ded/bonzo
    * License MIT
    */
  (function (name, context, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define(definition)
    else context[name] = definition()
  })('bonzo', this, function() {
    var win = window
      , doc = win.document
      , html = doc.documentElement
      , parentNode = 'parentNode'
      , specialAttributes = /^(checked|value|selected|disabled)$/i
        // tags that we have trouble inserting *into*
      , specialTags = /^(select|fieldset|table|tbody|tfoot|td|tr|colgroup)$/i
      , simpleScriptTagRe = /\s*<script +src=['"]([^'"]+)['"]>/
      , table = ['<table>', '</table>', 1]
      , td = ['<table><tbody><tr>', '</tr></tbody></table>', 3]
      , option = ['<select>', '</select>', 1]
      , noscope = ['_', '', 0, 1]
      , tagMap = { // tags that we have trouble *inserting*
            thead: table, tbody: table, tfoot: table, colgroup: table, caption: table
          , tr: ['<table><tbody>', '</tbody></table>', 2]
          , th: td , td: td
          , col: ['<table><colgroup>', '</colgroup></table>', 2]
          , fieldset: ['<form>', '</form>', 1]
          , legend: ['<form><fieldset>', '</fieldset></form>', 2]
          , option: option, optgroup: option
          , script: noscope, style: noscope, link: noscope, param: noscope, base: noscope
        }
      , stateAttributes = /^(checked|selected|disabled)$/
      , ie = /msie/i.test(navigator.userAgent)
      , hasClass, addClass, removeClass
      , uidMap = {}
      , uuids = 0
      , digit = /^-?[\d\.]+$/
      , dattr = /^data-(.+)$/
      , px = 'px'
      , setAttribute = 'setAttribute'
      , getAttribute = 'getAttribute'
      , byTag = 'getElementsByTagName'
      , features = function() {
          var e = doc.createElement('p')
          e.innerHTML = '<a href="#x">x</a><table style="float:left;"></table>'
          return {
            hrefExtended: e[byTag]('a')[0][getAttribute]('href') != '#x' // IE < 8
          , autoTbody: e[byTag]('tbody').length !== 0 // IE < 8
          , computedStyle: doc.defaultView && doc.defaultView.getComputedStyle
          , cssFloat: e[byTag]('table')[0].style.styleFloat ? 'styleFloat' : 'cssFloat'
          , transform: function () {
              var props = ['transform', 'webkitTransform', 'MozTransform', 'OTransform', 'msTransform'], i
              for (i = 0; i < props.length; i++) {
                if (props[i] in e.style) return props[i]
              }
            }()
          , classList: 'classList' in e
          , opasity: function () {
              return typeof doc.createElement('a').style.opacity !== 'undefined'
            }()
          }
        }()
      , trimReplace = /(^\s*|\s*$)/g
      , whitespaceRegex = /\s+/
      , toString = String.prototype.toString
      , unitless = { lineHeight: 1, zoom: 1, zIndex: 1, opacity: 1, boxFlex: 1, WebkitBoxFlex: 1, MozBoxFlex: 1 }
      , query = doc.querySelectorAll && function (selector) { return doc.querySelectorAll(selector) }
      , trim = String.prototype.trim ?
          function (s) {
            return s.trim()
          } :
          function (s) {
            return s.replace(trimReplace, '')
          }

      , getStyle = features.computedStyle
          ? function (el, property) {
              var value = null
                , computed = doc.defaultView.getComputedStyle(el, '')
              computed && (value = computed[property])
              return el.style[property] || value
            }
          : !(ie && html.currentStyle)
            ? function (el, property) {
                return el.style[property]
              }
            :
            /**
             * @param {Element} el
             * @param {string} property
             * @return {string|number}
             */
            function (el, property) {
              var val, value
              if (property == 'opacity' && !features.opasity) {
                val = 100
                try {
                  val = el['filters']['DXImageTransform.Microsoft.Alpha'].opacity
                } catch (e1) {
                  try {
                    val = el['filters']('alpha').opacity
                  } catch (e2) {}
                }
                return val / 100
              }
              value = el.currentStyle ? el.currentStyle[property] : null
              return el.style[property] || value
            }

    function isNode(node) {
      return node && node.nodeName && (node.nodeType == 1 || node.nodeType == 11)
    }


    function normalize(node, host, clone) {
      var i, l, ret
      if (typeof node == 'string') return bonzo.create(node)
      if (isNode(node)) node = [ node ]
      if (clone) {
        ret = [] // don't change original array
        for (i = 0, l = node.length; i < l; i++) ret[i] = cloneNode(host, node[i])
        return ret
      }
      return node
    }

    /**
     * @param {string} c a class name to test
     * @return {boolean}
     */
    function classReg(c) {
      return new RegExp('(^|\\s+)' + c + '(\\s+|$)')
    }


    /**
     * @param {Bonzo|Array} ar
     * @param {function(Object, number, (Bonzo|Array))} fn
     * @param {Object=} opt_scope
     * @param {boolean=} opt_rev
     * @return {Bonzo|Array}
     */
    function each(ar, fn, opt_scope, opt_rev) {
      var ind, i = 0, l = ar.length
      for (; i < l; i++) {
        ind = opt_rev ? ar.length - i - 1 : i
        fn.call(opt_scope || ar[ind], ar[ind], ind, ar)
      }
      return ar
    }


    /**
     * @param {Bonzo|Array} ar
     * @param {function(Object, number, (Bonzo|Array))} fn
     * @param {Object=} opt_scope
     * @return {Bonzo|Array}
     */
    function deepEach(ar, fn, opt_scope) {
      for (var i = 0, l = ar.length; i < l; i++) {
        if (isNode(ar[i])) {
          deepEach(ar[i].childNodes, fn, opt_scope)
          fn.call(opt_scope || ar[i], ar[i], i, ar)
        }
      }
      return ar
    }


    /**
     * @param {string} s
     * @return {string}
     */
    function camelize(s) {
      return s.replace(/-(.)/g, function (m, m1) {
        return m1.toUpperCase()
      })
    }


    /**
     * @param {string} s
     * @return {string}
     */
    function decamelize(s) {
      return s ? s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() : s
    }


    /**
     * @param {Element} el
     * @return {*}
     */
    function data(el) {
      el[getAttribute]('data-node-uid') || el[setAttribute]('data-node-uid', ++uuids)
      var uid = el[getAttribute]('data-node-uid')
      return uidMap[uid] || (uidMap[uid] = {})
    }


    /**
     * removes the data associated with an element
     * @param {Element} el
     */
    function clearData(el) {
      var uid = el[getAttribute]('data-node-uid')
      if (uid) delete uidMap[uid]
    }


    function dataValue(d) {
      var f
      try {
        return (d === null || d === undefined) ? undefined :
          d === 'true' ? true :
            d === 'false' ? false :
              d === 'null' ? null :
                (f = parseFloat(d)) == d ? f : d;
      } catch(e) {}
      return undefined
    }


    /**
     * @param {Bonzo|Array} ar
     * @param {function(Object, number, (Bonzo|Array))} fn
     * @param {Object=} opt_scope
     * @return {boolean} whether `some`thing was found
     */
    function some(ar, fn, opt_scope) {
      for (var i = 0, j = ar.length; i < j; ++i) if (fn.call(opt_scope || null, ar[i], i, ar)) return true
      return false
    }


    /**
     * this could be a giant enum of CSS properties
     * but in favor of file size sans-closure deadcode optimizations
     * we're just asking for any ol string
     * then it gets transformed into the appropriate style property for JS access
     * @param {string} p
     * @return {string}
     */
    function styleProperty(p) {
        (p == 'transform' && (p = features.transform)) ||
          (/^transform-?[Oo]rigin$/.test(p) && (p = features.transform + 'Origin')) ||
          (p == 'float' && (p = features.cssFloat))
        return p ? camelize(p) : null
    }

    // this insert method is intense
    function insert(target, host, fn, rev) {
      var i = 0, self = host || this, r = []
        // target nodes could be a css selector if it's a string and a selector engine is present
        // otherwise, just use target
        , nodes = query && typeof target == 'string' && target.charAt(0) != '<' ? query(target) : target
      // normalize each node in case it's still a string and we need to create nodes on the fly
      each(normalize(nodes), function (t, j) {
        each(self, function (el) {
          fn(t, r[i++] = j > 0 ? cloneNode(self, el) : el)
        }, null, rev)
      }, this, rev)
      self.length = i
      each(r, function (e) {
        self[--i] = e
      }, null, !rev)
      return self
    }


    /**
     * sets an element to an explicit x/y position on the page
     * @param {Element} el
     * @param {?number} x
     * @param {?number} y
     */
    function xy(el, x, y) {
      var $el = bonzo(el)
        , style = $el.css('position')
        , offset = $el.offset()
        , rel = 'relative'
        , isRel = style == rel
        , delta = [parseInt($el.css('left'), 10), parseInt($el.css('top'), 10)]

      if (style == 'static') {
        $el.css('position', rel)
        style = rel
      }

      isNaN(delta[0]) && (delta[0] = isRel ? 0 : el.offsetLeft)
      isNaN(delta[1]) && (delta[1] = isRel ? 0 : el.offsetTop)

      x != null && (el.style.left = x - offset.left + delta[0] + px)
      y != null && (el.style.top = y - offset.top + delta[1] + px)

    }

    // classList support for class management
    // altho to be fair, the api sucks because it won't accept multiple classes at once
    if (features.classList) {
      hasClass = function (el, c) {
        return el.classList.contains(c)
      }
      addClass = function (el, c) {
        el.classList.add(c)
      }
      removeClass = function (el, c) {
        el.classList.remove(c)
      }
    }
    else {
      hasClass = function (el, c) {
        return classReg(c).test(el.className)
      }
      addClass = function (el, c) {
        el.className = trim(el.className + ' ' + c)
      }
      removeClass = function (el, c) {
        el.className = trim(el.className.replace(classReg(c), ' '))
      }
    }


    /**
     * this allows method calling for setting values
     *
     * @example
     * bonzo(elements).css('color', function (el) {
     *   return el.getAttribute('data-original-color')
     * })
     *
     * @param {Element} el
     * @param {function (Element)|string}
     * @return {string}
     */
    function setter(el, v) {
      return typeof v == 'function' ? v(el) : v
    }

    function scroll(x, y, type) {
      var el = this[0]
      if (!el) return this
      if (x == null && y == null) {
        return (isBody(el) ? getWindowScroll() : { x: el.scrollLeft, y: el.scrollTop })[type]
      }
      if (isBody(el)) {
        win.scrollTo(x, y)
      } else {
        x != null && (el.scrollLeft = x)
        y != null && (el.scrollTop = y)
      }
      return this
    }

    /**
     * @constructor
     * @param {Array.<Element>|Element|Node|string} elements
     */
    function Bonzo(elements) {
      this.length = 0
      if (elements) {
        elements = typeof elements !== 'string' &&
          !elements.nodeType &&
          typeof elements.length !== 'undefined' ?
            elements :
            [elements]
        this.length = elements.length
        for (var i = 0; i < elements.length; i++) this[i] = elements[i]
      }
    }

    Bonzo.prototype = {

        /**
         * @param {number} index
         * @return {Element|Node}
         */
        get: function (index) {
          return this[index] || null
        }

        // itetators
        /**
         * @param {function(Element|Node)} fn
         * @param {Object=} opt_scope
         * @return {Bonzo}
         */
      , each: function (fn, opt_scope) {
          return each(this, fn, opt_scope)
        }

        /**
         * @param {Function} fn
         * @param {Object=} opt_scope
         * @return {Bonzo}
         */
      , deepEach: function (fn, opt_scope) {
          return deepEach(this, fn, opt_scope)
        }


        /**
         * @param {Function} fn
         * @param {Function=} opt_reject
         * @return {Array}
         */
      , map: function (fn, opt_reject) {
          var m = [], n, i
          for (i = 0; i < this.length; i++) {
            n = fn.call(this, this[i], i)
            opt_reject ? (opt_reject(n) && m.push(n)) : m.push(n)
          }
          return m
        }

      // text and html inserters!

      /**
       * @param {string} h the HTML to insert
       * @param {boolean=} opt_text whether to set or get text content
       * @return {Bonzo|string}
       */
      , html: function (h, opt_text) {
          var method = opt_text
                ? html.textContent === undefined ? 'innerText' : 'textContent'
                : 'innerHTML'
            , that = this
            , append = function (el, i) {
                each(normalize(h, that, i), function (node) {
                  el.appendChild(node)
                })
              }
            , updateElement = function (el, i) {
                try {
                  if (opt_text || (typeof h == 'string' && !specialTags.test(el.tagName))) {
                    return el[method] = h
                  }
                } catch (e) {}
                append(el, i)
              }
          return typeof h != 'undefined'
            ? this.empty().each(updateElement)
            : this[0] ? this[0][method] : ''
        }

        /**
         * @param {string=} opt_text the text to set, otherwise this is a getter
         * @return {Bonzo|string}
         */
      , text: function (opt_text) {
          return this.html(opt_text, true)
        }

        // more related insertion methods

        /**
         * @param {Bonzo|string|Element|Array} node
         * @return {Bonzo}
         */
      , append: function (node) {
          var that = this
          return this.each(function (el, i) {
            each(normalize(node, that, i), function (i) {
              el.appendChild(i)
            })
          })
        }


        /**
         * @param {Bonzo|string|Element|Array} node
         * @return {Bonzo}
         */
      , prepend: function (node) {
          var that = this
          return this.each(function (el, i) {
            var first = el.firstChild
            each(normalize(node, that, i), function (i) {
              el.insertBefore(i, first)
            })
          })
        }


        /**
         * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
         * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
         * @return {Bonzo}
         */
      , appendTo: function (target, opt_host) {
          return insert.call(this, target, opt_host, function (t, el) {
            t.appendChild(el)
          })
        }


        /**
         * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
         * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
         * @return {Bonzo}
         */
      , prependTo: function (target, opt_host) {
          return insert.call(this, target, opt_host, function (t, el) {
            t.insertBefore(el, t.firstChild)
          }, 1)
        }


        /**
         * @param {Bonzo|string|Element|Array} node
         * @return {Bonzo}
         */
      , before: function (node) {
          var that = this
          return this.each(function (el, i) {
            each(normalize(node, that, i), function (i) {
              el[parentNode].insertBefore(i, el)
            })
          })
        }


        /**
         * @param {Bonzo|string|Element|Array} node
         * @return {Bonzo}
         */
      , after: function (node) {
          var that = this
          return this.each(function (el, i) {
            each(normalize(node, that, i), function (i) {
              el[parentNode].insertBefore(i, el.nextSibling)
            }, null, 1)
          })
        }


        /**
         * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
         * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
         * @return {Bonzo}
         */
      , insertBefore: function (target, opt_host) {
          return insert.call(this, target, opt_host, function (t, el) {
            t[parentNode].insertBefore(el, t)
          })
        }


        /**
         * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
         * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
         * @return {Bonzo}
         */
      , insertAfter: function (target, opt_host) {
          return insert.call(this, target, opt_host, function (t, el) {
            var sibling = t.nextSibling
            sibling ?
              t[parentNode].insertBefore(el, sibling) :
              t[parentNode].appendChild(el)
          }, 1)
        }


        /**
         * @param {Bonzo|string|Element|Array} node
         * @return {Bonzo}
         */
      , replaceWith: function (node) {
          bonzo(normalize(node)).insertAfter(this)
          return this.remove()
        }

        /**
         * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
         * @return {Bonzo}
         */
      , clone: function (opt_host) {
          var ret = [] // don't change original array
            , l, i
          for (i = 0, l = this.length; i < l; i++) ret[i] = cloneNode(opt_host || this, this[i])
          return bonzo(ret)
        }

        // class management

        /**
         * @param {string} c
         * @return {Bonzo}
         */
      , addClass: function (c) {
          c = toString.call(c).split(whitespaceRegex)
          return this.each(function (el) {
            // we `each` here so you can do $el.addClass('foo bar')
            each(c, function (c) {
              if (c && !hasClass(el, setter(el, c)))
                addClass(el, setter(el, c))
            })
          })
        }


        /**
         * @param {string} c
         * @return {Bonzo}
         */
      , removeClass: function (c) {
          c = toString.call(c).split(whitespaceRegex)
          return this.each(function (el) {
            each(c, function (c) {
              if (c && hasClass(el, setter(el, c)))
                removeClass(el, setter(el, c))
            })
          })
        }


        /**
         * @param {string} c
         * @return {boolean}
         */
      , hasClass: function (c) {
          c = toString.call(c).split(whitespaceRegex)
          return some(this, function (el) {
            return some(c, function (c) {
              return c && hasClass(el, c)
            })
          })
        }


        /**
         * @param {string} c classname to toggle
         * @param {boolean=} opt_condition whether to add or remove the class straight away
         * @return {Bonzo}
         */
      , toggleClass: function (c, opt_condition) {
          c = toString.call(c).split(whitespaceRegex)
          return this.each(function (el) {
            each(c, function (c) {
              if (c) {
                typeof opt_condition !== 'undefined' ?
                  opt_condition ? !hasClass(el, c) && addClass(el, c) : removeClass(el, c) :
                  hasClass(el, c) ? removeClass(el, c) : addClass(el, c)
              }
            })
          })
        }

        // display togglers

        /**
         * @param {string=} opt_type useful to set back to anything other than an empty string
         * @return {Bonzo}
         */
      , show: function (opt_type) {
          opt_type = typeof opt_type == 'string' ? opt_type : ''
          return this.each(function (el) {
            el.style.display = opt_type
          })
        }


        /**
         * @return {Bonzo}
         */
      , hide: function () {
          return this.each(function (el) {
            el.style.display = 'none'
          })
        }


        /**
         * @param {Function=} opt_callback
         * @param {string=} opt_type
         * @return {Bonzo}
         */
      , toggle: function (opt_callback, opt_type) {
          opt_type = typeof opt_type == 'string' ? opt_type : '';
          typeof opt_callback != 'function' && (opt_callback = null)
          return this.each(function (el) {
            el.style.display = (el.offsetWidth || el.offsetHeight) ? 'none' : opt_type;
            opt_callback && opt_callback.call(el)
          })
        }


        // DOM Walkers & getters

        /**
         * @return {Element|Node}
         */
      , first: function () {
          return bonzo(this.length ? this[0] : [])
        }


        /**
         * @return {Element|Node}
         */
      , last: function () {
          return bonzo(this.length ? this[this.length - 1] : [])
        }


        /**
         * @return {Element|Node}
         */
      , next: function () {
          return this.related('nextSibling')
        }


        /**
         * @return {Element|Node}
         */
      , previous: function () {
          return this.related('previousSibling')
        }


        /**
         * @return {Element|Node}
         */
      , parent: function() {
          return this.related(parentNode)
        }


        /**
         * @private
         * @param {string} method the directional DOM method
         * @return {Element|Node}
         */
      , related: function (method) {
          return bonzo(this.map(
            function (el) {
              el = el[method]
              while (el && el.nodeType !== 1) {
                el = el[method]
              }
              return el || 0
            },
            function (el) {
              return el
            }
          ))
        }


        /**
         * @return {Bonzo}
         */
      , focus: function () {
          this.length && this[0].focus()
          return this
        }


        /**
         * @return {Bonzo}
         */
      , blur: function () {
          this.length && this[0].blur()
          return this
        }

        // style getter setter & related methods

        /**
         * @param {Object|string} o
         * @param {string=} opt_v
         * @return {Bonzo|string}
         */
      , css: function (o, opt_v) {
          var p, iter = o
          // is this a request for just getting a style?
          if (opt_v === undefined && typeof o == 'string') {
            // repurpose 'v'
            opt_v = this[0]
            if (!opt_v) return null
            if (opt_v === doc || opt_v === win) {
              p = (opt_v === doc) ? bonzo.doc() : bonzo.viewport()
              return o == 'width' ? p.width : o == 'height' ? p.height : ''
            }
            return (o = styleProperty(o)) ? getStyle(opt_v, o) : null
          }

          if (typeof o == 'string') {
            iter = {}
            iter[o] = opt_v
          }

          if (ie && iter.opacity) {
            // oh this 'ol gamut
            iter.filter = 'alpha(opacity=' + (iter.opacity * 100) + ')'
            // give it layout
            iter.zoom = o.zoom || 1;
            delete iter.opacity;
          }

          function fn(el, p, v) {
            for (var k in iter) {
              if (iter.hasOwnProperty(k)) {
                v = iter[k];
                // change "5" to "5px" - unless you're line-height, which is allowed
                (p = styleProperty(k)) && digit.test(v) && !(p in unitless) && (v += px)
                try { el.style[p] = setter(el, v) } catch(e) {}
              }
            }
          }
          return this.each(fn)
        }


        /**
         * @param {number=} opt_x
         * @param {number=} opt_y
         * @return {Bonzo|number}
         */
      , offset: function (opt_x, opt_y) {
          if (opt_x && typeof opt_x == 'object' && (typeof opt_x.top == 'number' || typeof opt_x.left == 'number')) {
            return this.each(function (el) {
              xy(el, opt_x.left, opt_x.top)
            })
          } else if (typeof opt_x == 'number' || typeof opt_y == 'number') {
            return this.each(function (el) {
              xy(el, opt_x, opt_y)
            })
          }
          if (!this[0]) return {
              top: 0
            , left: 0
            , height: 0
            , width: 0
          }
          var el = this[0]
            , de = el.ownerDocument.documentElement
            , bcr = el.getBoundingClientRect()
            , scroll = getWindowScroll()
            , width = el.offsetWidth
            , height = el.offsetHeight
            , top = bcr.top + scroll.y - Math.max(0, de && de.clientTop, doc.body.clientTop)
            , left = bcr.left + scroll.x - Math.max(0, de && de.clientLeft, doc.body.clientLeft)

          return {
              top: top
            , left: left
            , height: height
            , width: width
          }
        }


        /**
         * @return {number}
         */
      , dim: function () {
          if (!this.length) return { height: 0, width: 0 }
          var el = this[0]
            , de = el.nodeType == 9 && el.documentElement // document
            , orig = !de && !!el.style && !el.offsetWidth && !el.offsetHeight ?
               // el isn't visible, can't be measured properly, so fix that
               function (t) {
                 var s = {
                     position: el.style.position || ''
                   , visibility: el.style.visibility || ''
                   , display: el.style.display || ''
                 }
                 t.first().css({
                     position: 'absolute'
                   , visibility: 'hidden'
                   , display: 'block'
                 })
                 return s
              }(this) : null
            , width = de
                ? Math.max(el.body.scrollWidth, el.body.offsetWidth, de.scrollWidth, de.offsetWidth, de.clientWidth)
                : el.offsetWidth
            , height = de
                ? Math.max(el.body.scrollHeight, el.body.offsetHeight, de.scrollHeight, de.offsetHeight, de.clientHeight)
                : el.offsetHeight

          orig && this.first().css(orig)
          return {
              height: height
            , width: width
          }
        }

        // attributes are hard. go shopping

        /**
         * @param {string} k an attribute to get or set
         * @param {string=} opt_v the value to set
         * @return {Bonzo|string}
         */
      , attr: function (k, opt_v) {
          var el = this[0]
            , n

          if (typeof k != 'string' && !(k instanceof String)) {
            for (n in k) {
              k.hasOwnProperty(n) && this.attr(n, k[n])
            }
            return this
          }

          return typeof opt_v == 'undefined' ?
            !el ? null : specialAttributes.test(k) ?
              stateAttributes.test(k) && typeof el[k] == 'string' ?
                true : el[k] : (k == 'href' || k =='src') && features.hrefExtended ?
                  el[getAttribute](k, 2) : el[getAttribute](k) :
            this.each(function (el) {
              specialAttributes.test(k) ? (el[k] = setter(el, opt_v)) : el[setAttribute](k, setter(el, opt_v))
            })
        }


        /**
         * @param {string} k
         * @return {Bonzo}
         */
      , removeAttr: function (k) {
          return this.each(function (el) {
            stateAttributes.test(k) ? (el[k] = false) : el.removeAttribute(k)
          })
        }


        /**
         * @param {string=} opt_s
         * @return {Bonzo|string}
         */
      , val: function (s) {
          return (typeof s == 'string') ?
            this.attr('value', s) :
            this.length ? this[0].value : null
        }

        // use with care and knowledge. this data() method uses data attributes on the DOM nodes
        // to do this differently costs a lot more code. c'est la vie
        /**
         * @param {string|Object=} opt_k the key for which to get or set data
         * @param {Object=} opt_v
         * @return {Bonzo|Object}
         */
      , data: function (opt_k, opt_v) {
          var el = this[0], o, m
          if (typeof opt_v === 'undefined') {
            if (!el) return null
            o = data(el)
            if (typeof opt_k === 'undefined') {
              each(el.attributes, function (a) {
                (m = ('' + a.name).match(dattr)) && (o[camelize(m[1])] = dataValue(a.value))
              })
              return o
            } else {
              if (typeof o[opt_k] === 'undefined')
                o[opt_k] = dataValue(this.attr('data-' + decamelize(opt_k)))
              return o[opt_k]
            }
          } else {
            return this.each(function (el) { data(el)[opt_k] = opt_v })
          }
        }

        // DOM detachment & related

        /**
         * @return {Bonzo}
         */
      , remove: function () {
          this.deepEach(clearData)
          return this.detach()
        }


        /**
         * @return {Bonzo}
         */
      , empty: function () {
          return this.each(function (el) {
            deepEach(el.childNodes, clearData)

            while (el.firstChild) {
              el.removeChild(el.firstChild)
            }
          })
        }


        /**
         * @return {Bonzo}
         */
      , detach: function () {
          return this.each(function (el) {
            el[parentNode] && el[parentNode].removeChild(el)
          })
        }

        // who uses a mouse anyway? oh right.

        /**
         * @param {number} y
         */
      , scrollTop: function (y) {
          return scroll.call(this, null, y, 'y')
        }


        /**
         * @param {number} x
         */
      , scrollLeft: function (x) {
          return scroll.call(this, x, null, 'x')
        }

    }


    function cloneNode(host, el) {
      var c = el.cloneNode(true)
        , cloneElems
        , elElems
        , i

      // check for existence of an event cloner
      // preferably https://github.com/fat/bean
      // otherwise Bonzo won't do this for you
      if (host.$ && typeof host.cloneEvents == 'function') {
        host.$(c).cloneEvents(el)

        // clone events from every child node
        cloneElems = host.$(c).find('*')
        elElems = host.$(el).find('*')

        for (i = 0; i < elElems.length; i++)
          host.$(cloneElems[i]).cloneEvents(elElems[i])
      }
      return c
    }

    function isBody(element) {
      return element === win || (/^(?:body|html)$/i).test(element.tagName)
    }

    function getWindowScroll() {
      return { x: win.pageXOffset || html.scrollLeft, y: win.pageYOffset || html.scrollTop }
    }

    function createScriptFromHtml(html) {
      var scriptEl = document.createElement('script')
        , matches = html.match(simpleScriptTagRe)
      scriptEl.src = matches[1]
      return scriptEl
    }

    /**
     * @param {Array.<Element>|Element|Node|string} els
     * @return {Bonzo}
     */
    function bonzo(els) {
      return new Bonzo(els)
    }

    bonzo.setQueryEngine = function (q) {
      query = q;
      delete bonzo.setQueryEngine
    }

    bonzo.aug = function (o, target) {
      // for those standalone bonzo users. this love is for you.
      for (var k in o) {
        o.hasOwnProperty(k) && ((target || Bonzo.prototype)[k] = o[k])
      }
    }

    bonzo.create = function (node) {
      // hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
      return typeof node == 'string' && node !== '' ?
        function () {
          if (simpleScriptTagRe.test(node)) return [createScriptFromHtml(node)]
          var tag = node.match(/^\s*<([^\s>]+)/)
            , el = doc.createElement('div')
            , els = []
            , p = tag ? tagMap[tag[1].toLowerCase()] : null
            , dep = p ? p[2] + 1 : 1
            , ns = p && p[3]
            , pn = parentNode
            , tb = features.autoTbody && p && p[0] == '<table>' && !(/<tbody/i).test(node)

          el.innerHTML = p ? (p[0] + node + p[1]) : node
          while (dep--) el = el.firstChild
          // for IE NoScope, we may insert cruft at the begining just to get it to work
          if (ns && el && el.nodeType !== 1) el = el.nextSibling
          do {
            // tbody special case for IE<8, creates tbody on any empty table
            // we don't want it if we're just after a <thead>, <caption>, etc.
            if ((!tag || el.nodeType == 1) && (!tb || (el.tagName && el.tagName != 'TBODY'))) {
              els.push(el)
            }
          } while (el = el.nextSibling)
          // IE < 9 gives us a parentNode which messes up insert() check for cloning
          // `dep` > 1 can also cause problems with the insert() check (must do this last)
          each(els, function(el) { el[pn] && el[pn].removeChild(el) })
          return els
        }() : isNode(node) ? [node.cloneNode(true)] : []
    }

    bonzo.doc = function () {
      var vp = bonzo.viewport()
      return {
          width: Math.max(doc.body.scrollWidth, html.scrollWidth, vp.width)
        , height: Math.max(doc.body.scrollHeight, html.scrollHeight, vp.height)
      }
    }

    bonzo.firstChild = function (el) {
      for (var c = el.childNodes, i = 0, j = (c && c.length) || 0, e; i < j; i++) {
        if (c[i].nodeType === 1) e = c[j = i]
      }
      return e
    }

    bonzo.viewport = function () {
      return {
          width: ie ? html.clientWidth : self.innerWidth
        , height: ie ? html.clientHeight : self.innerHeight
      }
    }

    bonzo.isAncestor = 'compareDocumentPosition' in html ?
      function (container, element) {
        return (container.compareDocumentPosition(element) & 16) == 16
      } : 'contains' in html ?
      function (container, element) {
        return container !== element && container.contains(element);
      } :
      function (container, element) {
        while (element = element[parentNode]) {
          if (element === container) {
            return true
          }
        }
        return false
      }

    return bonzo
  }); // the only line we care about using a semi-colon. placed here for concatenation tools

  if (typeof provide == "function") provide("bonzo", module.exports);

  (function ($) {

    var b = require('bonzo')
    b.setQueryEngine($)
    $.ender(b)
    $.ender(b(), true)
    $.ender({
      create: function (node) {
        return $(b.create(node))
      }
    })

    $.id = function (id) {
      return $([document.getElementById(id)])
    }

    function indexOf(ar, val) {
      for (var i = 0; i < ar.length; i++) if (ar[i] === val) return i
      return -1
    }

    function uniq(ar) {
      var r = [], i = 0, j = 0, k, item, inIt
      for (; item = ar[i]; ++i) {
        inIt = false
        for (k = 0; k < r.length; ++k) {
          if (r[k] === item) {
            inIt = true; break
          }
        }
        if (!inIt) r[j++] = item
      }
      return r
    }

    $.ender({
      parents: function (selector, closest) {
        if (!this.length) return this
        if (!selector) selector = '*'
        var collection = $(selector), j, k, p, r = []
        for (j = 0, k = this.length; j < k; j++) {
          p = this[j]
          while (p = p.parentNode) {
            if (~indexOf(collection, p)) {
              r.push(p)
              if (closest) break;
            }
          }
        }
        return $(uniq(r))
      }

    , parent: function() {
        return $(uniq(b(this).parent()))
      }

    , closest: function (selector) {
        return this.parents(selector, true)
      }

    , first: function () {
        return $(this.length ? this[0] : this)
      }

    , last: function () {
        return $(this.length ? this[this.length - 1] : [])
      }

    , next: function () {
        return $(b(this).next())
      }

    , previous: function () {
        return $(b(this).previous())
      }

    , related: function (t) {
        return $(b(this).related(t))
      }

    , appendTo: function (t) {
        return b(this.selector).appendTo(t, this)
      }

    , prependTo: function (t) {
        return b(this.selector).prependTo(t, this)
      }

    , insertAfter: function (t) {
        return b(this.selector).insertAfter(t, this)
      }

    , insertBefore: function (t) {
        return b(this.selector).insertBefore(t, this)
      }

    , clone: function () {
        return $(b(this).clone(this))
      }

    , siblings: function () {
        var i, l, p, r = []
        for (i = 0, l = this.length; i < l; i++) {
          p = this[i]
          while (p = p.previousSibling) p.nodeType == 1 && r.push(p)
          p = this[i]
          while (p = p.nextSibling) p.nodeType == 1 && r.push(p)
        }
        return $(r)
      }

    , children: function () {
        var i, l, el, r = []
        for (i = 0, l = this.length; i < l; i++) {
          if (!(el = b.firstChild(this[i]))) continue;
          r.push(el)
          while (el = el.nextSibling) el.nodeType == 1 && r.push(el)
        }
        return $(uniq(r))
      }

    , height: function (v) {
        return dimension.call(this, 'height', v)
      }

    , width: function (v) {
        return dimension.call(this, 'width', v)
      }
    }, true)

    /**
     * @param {string} type either width or height
     * @param {number=} opt_v becomes a setter instead of a getter
     * @return {number}
     */
    function dimension(type, opt_v) {
      return typeof opt_v == 'undefined'
        ? b(this).dim()[type]
        : this.css(type, opt_v)
    }
  }(ender));
}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
   * blood 0.6.0+201309031919
   * https://github.com/ryanve/blood
   * MIT License 2013 Ryan Van Etten
   */

  (function(root, name, make) {
      typeof module != 'undefined' && module['exports'] ? module['exports'] = make() : root[name] = make();
  }(this, 'blood', function() {

      var AP = Array.prototype
        , OP = Object.prototype
        , hasOwn = OP['hasOwnProperty']
        , loops = OP['propertyIsEnumerable']
        , push = AP['push']
        , slice = AP['slice']
        , concat = AP['concat']
        , indexOf = AP['indexOf'] || function(needle, i) {
              var l = this.length;
              for (i = 0 > (i >>= 0) ? l + i : i; i < l; i++)
                  if (i in this && this[i] === needle) return i;
              return -1;
          }
        
          // stackoverflow.com/a/3705407/770127
          // developer.mozilla.org/en-US/docs/ECMAScript_DontEnum_attribute
        , hasEnumBug = !loops.call({'valueOf':1}, 'valueOf') // IE8-
        , dontEnums = [
              'constructor'
            , 'propertyIsEnumerable'
            , 'valueOf'
            , 'toString'
            , 'toLocaleString'
            , 'isProtoypeOf'
            , 'hasOwnProperty'
          ]
      
        , proto = '__proto__'
        , supportsProto = proto in OP
        , owns = supportsProto ? hasOwn : function(key) {
              return proto === key ? this === OP : hasOwn.call(this, key);
          }
        
          /**
           * @param  {*}             ob
           * @param  {string|number} key
           * @return {boolean}
           */
        , has = function(ob, key) {
              return owns.call(ob, key);
          }

        , keys = !hasEnumBug && Object.keys || function(ob) {
              var k, i = 0, list = [], others = dontEnums;
              for (k in ob)
                  has(ob, k) && (list[i++] = k);
              if (ob !== OP)
                  for (i = others.length; i--;)
                      has(ob, k = others[i]) && admit(list, k);
              return list;
          }

        , props = !hasEnumBug && Object.getOwnPropertyNames || function(ob) {
              // getOwnPropertyNames cannot be emulated exactly. Get as close as possible.
              // Include 'length' if owned and non-enumerable, such as for native arrays.
              var props = keys(ob);
              has(ob, 'length') && !loops.call(ob, 'length') && props.push('length');
              return props;
          }
        
        , nativeCreate = (function(oCreate) {
              try {
                  // Object.create(null) should inherit NO properties.
                  // Object.create(func) should inherit from Function.
                  if (!oCreate(null)['valueOf'] && oCreate.call === oCreate(oCreate).call)
                      return oCreate; // Return reference if implementation seems proper.
              } catch (e) {}
          }(Object.create))

        , create = nativeCreate || (function(emptyProto) {
              /**
               * @link   github.com/kriskowal/es5-shim/pull/132
               * @link   github.com/kriskowal/es5-shim/issues/150
               * @link   github.com/kriskowal/es5-shim/pull/118
               * @param  {Object|Array|Function|null}  parent
               * @return {Object}
               */
              return function(parent) {
                  function F() {}
                  F.prototype = null === parent ? emptyProto : parent;
                  var instance = new F; // inherits F.prototype
                  null === parent || (instance[proto] = parent); // hack getPrototypeOf in IE8-
                  return instance;
              };
          }(combine([proto].concat(dontEnums), [null])))

        , getPro = Object.getPrototypeOf || function(ob) {
              return void 0 !== ob[proto] ? ob[proto] : (ob.constructor || Object).prototype; 
          }

        , setPro = function(ob, pro) {
              ob[proto] = pro; // experimental
              return ob;
          };

      /**
       * @param  {Object|Array|Function}          receiver
       * @param  {(Object|Array|Function)=}       supplier
       * @param  {(Array|string|number|boolean)=} list
       */
      function adopt(receiver, supplier, list) {
          var i = arguments.length, force = null != (false === list ? list = null : list);
          1 === i && (supplier = receiver, receiver = this);
          list = force && true !== list ? (typeof list != 'object' ? [list] : list) : keys(supplier);
          i = list.length;
          for (i = 0 < i && i; i--;) {
              if (force || !has(receiver, list[i]))
                  receiver[list[i]] = supplier[list[i]];
          }
          return receiver;
      }

      /**
       * @param  {Object|Array|Function} receiver
       * @param  {Object|Array|Function} supplier
       */
      function assign(receiver, supplier) {
          // Functionally like the ES6 Object.assign expectation, plus single-param syntax
          1 === arguments.length && (supplier = receiver, receiver = this);
          return adopt(receiver, supplier, keys(supplier));
      }
    
      /**
       * @param  {Object|Array|Function} ob
       * @param  {Object|null}           pro
       */
      function line(ob, pro) {
          return 2 == arguments.length ? setPro(ob, pro) : getPro(ob);
      }

      /**
       * @param  {Object}  source
       * @return {Object}
       */
      function orphan(source) {
          return source ? assign(create(null), source) : create(null);
      }

      /**
       * @param  {Object|Array|Function|null} source
       * @param  {(Object|null)=}             parent
       */
      function twin(source, parent) {
          var n = arguments.length;
          source = n ? source : this;
          parent = 2 == n ? parent : getPro(source);
          return adopt(create(parent), source, props(source));
      }
    
      // Use .every/.some/.reduce/.map for array-likes.
      // Use .all/.any/.inject/.collect for NON-array-likes.

      /**
       * @param  {Object|Function} ob
       * @param  {Function=}       fn
       * @param  {*=}              scope
       */
      function all(ob, fn, scope) {
          var list = keys(ob), l = list.length, i = 0;
          while (i < l) if (!fn.call(scope, ob[list[i]], list[i++], ob)) return false;
          return true;
      }
    
      /**
       * @param  {Object|Function} ob
       * @param  {Function=}       fn
       * @param  {*=}              scope
       */
      function any(ob, fn, scope) {
          var list = keys(ob), l = list.length, i = 0;
          while (i < l) if (fn.call(scope, ob[list[i]], list[i++], ob)) return true;
          return false;
      }
    
      /**
       * @param  {Object|Array} ob
       * @param  {Function=}    fn
       * @param  {*=}           scope
       */
      function every(ob, fn, scope) {
          var l = ob.length, i = 0;
          while (i < l) if (!fn.call(scope, ob[i], i++, ob)) return false;
          return true;
      }
    
      /**
       * @param  {Object|Array} ob
       * @param  {Function=}    fn
       * @param  {*=}           scope
       */
      function some(ob, fn, scope) {
          var l = ob.length, i = 0;
          while (i < l) if (fn.call(scope, ob[i], i++, ob)) return true;
          return false;
      }
    
      /**
       * @param  {Object|Array|Arguments} ob
       * @param  {Function}               accum
       * @param  {*=}                     value
       * @param  {*=}                     scope
       */
      function reduce(ob, accum, value, scope) {
          var i = 0, l = ob.length;
          value = 3 > arguments.length ? ob[i++] : value;
          while (i < l) value = accum.call(scope, value, ob[i], i++, ob);
          return value;
      }
    
      /**
       * @param  {Object|Function}        ob
       * @param  {Function}               accum
       * @param  {*=}                     value
       * @param  {*=}                     scope
       */
      function inject(ob, accum, value, scope) {
          var list = keys(ob), i = 0, l = list.length;
          value = 3 > arguments.length ? ob[list[i++]] : value;
          while (i < l) value = accum.call(scope, value, ob[list[i]], list[i++], ob);
          return value;
      }
    
      /**
       * @param  {Object|Function|Array} ob
       * @return {Array}
       */
      function tree(ob) {
          var chain = [ob];
          while (null != (ob = getPro(ob))) chain.push(ob);
          return chain;
      }
    
      /**
       * @param  {Object|Function|Array} ob
       * @return {Array}
       */
      function roots(ob) {
          return tree(ob).slice(1);
      }

      /**
       * @param  {Array|Object} list
       * @param  {*=}           value
       * @return {Array|Object}
       */
      function admit(list, value) {
          ~indexOf.call(list, value) || push.call(list, value);
          return list;
      }
    
      /**
       * @param  {Array|Object} list
       * @return {Array}
       */
      function uniq(list) {
          return reduce(list, admit, []);
      }

      /**
       * @param  {*}  ob
       * @return {number}
       */
      function size(ob) {
          return null == ob ? 0 : (ob.length === +ob.length ? ob : keys(ob)).length; 
      }

      /**
       * @param  {Object|Array|Function} ob
       * @return {Array}
       */
      function values(ob) {
          var list = keys(ob), i = list.length;
          while (i--) list[i] = ob[list[i]];
          return list;
      }
    
      /**
       * @param  {Object|Array|Function} ob
       * @return {Array}
       */
      function pairs(ob) {
          var list = keys(ob), i = list.length;
          while (i--) list[i] = [list[i], ob[list[i]]];
          return list;
      }
    
      /**
       * @param  {Object|Array|Arguments} keys
       * @param  {Object|Array|Arguments} values
       * @param  {*=}                     target
       * @return {Object|*}
       */
      function combine(keys, values, target) {
          return some(keys, values ? function(n, i) {
              this[n] = values[i];
          } : function(pair) {
              this[pair[0]] = pair[1];
          }, target = target || {}), target;
      }
    
      /**
       * @param  {Object|Array|Arguments} ob
       * @return {Object}
       */
      function invert(ob) {
          return combine(values(ob), keys(ob));
      }

      /**
       * @param  {number}       max
       * @param  {Array|Object} o
       * @return {number}
       */
      function longer(max, o) {
          return (o = o.length >> 0) > max ? o : max;
      }
    
      /**
       * like underscorejs.org/#zip
       * @return {Array}
       */
      function zip() {
          var r = [], i = reduce(arguments, longer, 0);
          while (i--) r[i] = pluck(arguments, i);
          return r;
      }

      /**
       * @param  {Object|Array|Function} ob
       * @param  {string|Array}          type
       * @return {Array}
       */
      function types(ob, type) {
          var names = keys(ob), i = names.length;
          type = typeof type != 'object' ? [type] : type;
          while (i--) ~indexOf.call(type, typeof ob[names[i]]) || names.splice(i, 1);
          return names.sort();
      }
    
      /**
       * @param  {Object|Array|Function} ob
       * @return {Array}
       */
      function methods(ob) {
          return types(ob, 'function');
      }

      /**
       * @param  {Object|Array|Function} source
       * @return {Object}
       */
      function pick(source) {
          for (var r = {}, list = concat.apply(AP, slice.call(arguments, 1)), l = list.length, i = 0; i < l; i++)
              if (list[i] in source) r[list[i]] = source[list[i]];
          return r;
      }

      /**
       * @param  {Object|Array|Function} source
       * @return {Object}
       */
      function omit(source) {
          var k, r = {}, list = concat.apply(AP, slice.call(arguments, 1));
          for (k in source) ~indexOf.call(list, k) || (r[k] = source[k]);
          return r;
      }
    
      /**
       * @param  {*}        ob
       * @param  {Function} fn
       * @param  {*=}       scope
       * @return {Array}
       */
      function map(ob, fn, scope) {
          var r = [];
          return some(ob, function(v, k, ob) {
              r[k] = fn.call(scope, v, k, ob);
          }), r;
      }
    
      /**
       * @param  {*}        ob
       * @param  {Function} fn
       * @param  {*=}       scope
       * @return {Array}
       */
      function collect(ob, fn, scope) {
          var r = [];
          return any(ob, function(v, k, ob) {
              r[k] = fn.call(scope, v, k, ob);
          }), r;
      }

      /**
       * @param  {*}             ob
       * @param  {string|number} key
       * @return {Array}
       */
      function pluck(ob, key) {
          var r = [];
          return some(ob, function(v, k) {
              r[k] = v[key];
          }), r;
      }

      /**
       * @param  {Object|Array} ob
       * @param  {*}            needle
       * @return {boolean}
       */
      function include(ob, needle) {
          // Emulate _.include (underscorejs.org/#contains)
          return !!~indexOf.call(ob.length === +ob.length ? ob : values(ob), needle);
      }
    
      /**
       * @param  {*}  a
       * @param  {*=} b
       * @return {boolean}
       */
      function same(a, b) {
          // Emulate ES6 Object.is
          return a === b ? (
              0 !== a || 1/a === 1/b  // Discern -0 from 0
          ) : a !== a && b !== b;     // NaN is non-reflexive
      }

      return {
          'adopt': adopt
        , 'all': all
        , 'any': any
        , 'assign': assign
        , 'create': create
        , 'collect': collect
        , 'every': every
        , 'has': has
        , 'include': include
        , 'inject': inject
        , 'invert': invert
        , 'keys': keys
        , 'line': line
        , 'loops': loops
        , 'map': map
        , 'methods': methods
        , 'object': combine
        , 'orphan': orphan
        , 'omit': omit
        , 'owns': owns
        , 'pairs': pairs
        , 'pick': pick
        , 'pluck': pluck
        , 'props': props
        , 'reduce': reduce
        , 'roots': roots
        , 'tree': tree
        , 'twin': twin
        , 'types': types
        , 'same': same
        , 'some': some
        , 'size': size
        , 'uniq': uniq
        , 'values': values
        , 'zip': zip
      };
  }));
  if (typeof provide == "function") provide("blood", module.exports);
  $.ender(module.exports);
}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
   * scan 0.5.4+201310010425
   * https://github.com/ryanve/scan
   * MIT License 2013 Ryan Van Etten
   */

  (function(root, name, make) {
      typeof module != 'undefined' && module['exports'] ? module['exports'] = make() : root[name] = make();
  }(this, 'scan', function() {

      var effin = {}
        , doc = document
        , docElem = doc.documentElement
        , chain = 'pushStack'
        , byAll = 'querySelectorAll'
        , byTag = 'getElementsByTagName'
        , query = doc[byAll] ? byAll : byTag
        , compare = 'compareDocumentPosition'

          /**
           * @param {Node|*} a element or document to search in
           * @param {Element|*} b element to search for
           * @return {boolean} true if A contains B
           */
        , wraps = docElem.contains || docElem[compare] ? function(a, b) {
              var adown = 9 === a.nodeType ? a.documentElement : a, bup = b && b.parentNode;
              return bup && 1 === bup.nodeType ? a === bup || !!(
                  adown.contains ? adown.contains(bup) : a[compare] && a[compare](bup) & 16
              ) : false;
          } : function(a, b) {
              while (b = b && b.parentNode)
                  if (b === a) return true;
              return false;
          };

      /**
       * @param {string=} selector
       * @param {(string|Node|NodeList|Array|Object)=} root
       * @return {Array}
       */
      function qsa(selector, root) {
          if (!selector) return [];
          root = null == root ? doc : typeof root == 'string' ? qsa(root) : root;
          return typeof root != 'object' ? [] : root.nodeType ? (
              root[query] ? ary(root[query](selector)) : []
          ) : amass(selector, root); // root was collection
      }

      /**
       * @param {Array|Object|NodeList|string|*} list
       * @return {Array}
       */
      function ary(list) {
          var pure = [], l = list.length, i = 0;
          while (i < l) pure[i] = list[i++];
          return pure;
      }
    
      /**
       * @param {(string|Node|NodeList|Array|*)=} item
       * @param {(string|Node|NodeList|Array|Object)=} root
       * @return {Array}
       */
      function scan(item, root) {
          if (!item) return [];
          if (typeof item == 'string') return qsa(item, root);
          return item.nodeType || item.window == item ? [item] : ary(item);
      }

      /**
       * @param {string} selector
       * @param {Array|Object|NodeList} roots nodes from which to base queries
       * @return {Array} unique matches that descend from any `roots` item
       */
      function amass(selector, roots) {
          for (var u, j, group, els = [], e = 0, l = roots.length, i = 0; i < l;) {
              group = qsa(selector, roots[i++]);
              label:for (u = 0; group[u]; u++) {
                  for (j = e; j--;) if (els[j] === group[u]) continue label;
                  els[e++] = group[u];
              }
          }
          return els;
      }
    
      /**
       * @param {Array|Object} stack
       * @param {*} needle
       * @param {number=} start
       * @return {boolean}
       */
      function include(stack, needle, start) {
          var l = stack.length, i = start >> 0;
          for (0 > i && (i += l); i < l; i++)
              if (stack[i] === needle && i in stack) return true;
          return false;
      }

      /**
       * combines jQuery.contains, _.contains, string.contains
       * @param {string|Array|Object|Node} ob
       * @param {*} needle
       * @param {number=} start
       * @return {boolean}
       */
      function contains(ob, needle, start) {
          if (typeof ob == 'string') return !!~ob.indexOf(needle, start >> 0);
          return ob.nodeType ? wraps(ob, needle) : include(ob, needle, start);
      }
    
      /**
       * @param {Object|Array|NodeList} nodes
       * @param {Object|Array|NodeList|Element} needles
       * @return {Array} descendant needles
       */
      function contained(nodes, needles) {
          var j, l, ret = [], i = 0, h = nodes.length;
          needles = needles.nodeType ? [needles] : needles;
          for (l = needles.length; i < l; i++) {
              for (j = 0; j < h;) {
                  if (wraps(nodes[j++], needles[i])) {
                      ret.push(needles[i]);
                      break;
                  }
              }
          }
          return ret;
      }

      /**
       * @param {string} str
       * @return {Element|boolean}
       */
      function id(str) {
          return doc.getElementById(str) || false;
      }

      /**
       * @param {Object|Array|NodeList} ob
       * @param {Function} fn
       * @param {*=} scope
       */    
      function detect(ob, fn, scope) {
          for (var v, i = 0, l = ob.length; i < l;)
              if (fn.call(scope, v = ob[i], i++, ob)) return v;
      }
    
      /**
       * @this {Object|Array|NodeList}
       * @param {Object|Array|NodeList|Element|Function|string|*}  needle
       * @param {*=} scope
       */
      effin['find'] = function(needle, scope) {
          var found;
          if (typeof needle == 'string') found = amass(needle, this);
          else if (typeof needle == 'object') found = contained(this, needle);
          else return detect(this, needle, scope);
          return this[chain] ? this[chain](found) : found;
      };
    
      // Comply w/ api.jquery.com/filter + api.jquery.com/not
      detect(['not', 'filter'], function(key, keep) {
          effin[key] = function(q) {
              var kept = [], isF = typeof q == 'function';
              if (q) detect(this, function(v, j) {
                  var fail = isF ? !q.call(v, j) : !include(this, v);
                  fail == keep || kept.push(v);
              }, typeof q == 'string' ? qsa(q) : q.nodeType ? [q] : q);
              else kept = keep ? kept : ary(this);
              return this[chain] ? this[chain](kept) : kept;
          };
      });

      scan['scan'] = scan;
      scan['qsa'] = qsa;
      scan['id'] = id;
      scan['inNode'] = wraps;
      scan['contains'] = contains;
      scan['find'] = detect;
      scan['fn'] = effin;
      return scan;
  }));
  if (typeof provide == "function") provide("scan", module.exports);

  (function(root, name) {
      // ender.jit.su bridge
      var $ = root['ender']
        , x = require(name);
      if ($) {
          $['_select'] = x;
          $['pushStack'] = $['pushStack'] || $;
          if ($['submix']) {
              $['submix'](x);
          } else {
              $['ender'](x['fn'], true);
              $['contains'] = x['contains'];
          }
      }
      // github.com/ryanve/dj
      if ($ = root['dj']) {
          $['hook']('select', x['qsa']);
          $['bridge'].call(x, $);
      }
  }(this, 'scan'));
}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
   * elo      cross-browser JavaScript events and data module
   * @version 1.5.4
   * @link    elo.airve.com
   * @license MIT
   * @author  Ryan Van Etten
   */

  /*jshint expr:true, sub:true, supernew:true, debug:true, node:true, boss:true, devel:true, evil:true, 
    laxcomma:true, eqnull:true, undef:true, unused:true, browser:true, jquery:true, maxerr:100 */

  (function(root, name, make) {
      if (typeof module != 'undefined' && module['exports']) module['exports'] = make();
      else root[name] = make();
  }(this, 'elo', function() {

      // elo takes much inspiration from:
      // jQuery (jquery.com)
      // Bean   (github.com/fat/bean)
      // Bonzo  (github.com/ded/bonzo)

      // Array notation is used on property names that we don't want the
      // Google Closure Compiler to rename in advanced optimization mode. 
      // developers.google.com/closure/compiler/docs/api-tutorial3
      // developers.google.com/closure/compiler/docs/js-for-compiler

      var domReady, eloReady
        , root = this
        , name = 'elo'
        , win = window
        , doc = document
        , docElem = doc.documentElement
        , slice = [].slice
        , push = [].push

          // Data objects are organized by unique identifier:
          // Use null objects so we don't need to do hasOwnProperty checks
        , eventMap = {} // event data cache
        , dataMap = {} // other data cache
        , uidProp = 'uidElo' // property name
        , uidAttr = 'data-uid-elo' // elements are identified via data attribute
        , uid = 4 // unique identifier
        , queryEngine = function(s, root) {
              return s ? (root || doc).querySelectorAll(s) : [];
          }

          // Feature detection:
        , W3C = !!doc.addEventListener
        , FIX = !('onblur' in docElem) // Detect whether to fix event detection in hasEvent()

          // Normalize the native add/remove-event methods:
        , add = W3C ? function(node, type, fn) { node.addEventListener(type, fn, false); }
                    : function(node, type, fn) { node.attachEvent('on' + type, fn); }
        , rem = W3C ? function(node, type, fn) { node.removeEventListener(type, fn, false); }
                    : function(node, type, fn) { node.detachEvent('on' + type, fn); }

          // Local vars specific to domReady:
        , readyStack = [] // stack of functions to fire when the DOM is ready
        , isReady = /^loade|c/.test(doc.readyState) // test initial state
        , needsHack = !!docElem.doScroll
        , readyType = needsHack ? 'onreadystatechange' : 'DOMContentLoaded';

      // Temporary local version of hook allows for the actual
      // $.hook to be added after the api has been created. If $.hook 
      // is added, then this local version becomes a ref to $.hook
      // See the source of @link github.com/ryanve/dj
      // It's the best kind of magic.
      function hook(k) {
          var realHook = api['hook'];
          if (!realHook || !realHook['remix'])
              return 'select' === k ? queryEngine : 'api' === k ? eloReady : void 0;
          // send the default hooks
          realHook('select', queryEngine);
          realHook('api', eloReady);
          realHook(name, api) && realHook(name, false);
          hook = realHook; // redefine self
          return realHook.apply(this, arguments);
      }

      /**
       * api is the export (all public methods are added to it)
       * @param  {*}        item
       * @param  {Object=}  root 
       */
      function api(item, root) {
          return new Api(item, root);
      }

     /**
      * @constructor
      * @param  {*=}       item 
      * @param  {Object=}  root 
      * adapted from jQuery and ender
      */
      function Api(item, root) {
          var i = 0;
          this['length'] = 0;
          if (typeof item == 'function') {
              // The default 'api' closure is a ready shortcut that passes the `api` as the
              // first arg and the `document` as `this`:
              hook('api')(item); // < designed to be closure or ready shortcut
          } else if (item && (item.nodeType || typeof (i = item.length) != 'number' || item === win)) {
              // Handle DOM elems/nodes and anything w/o a length *number* ( jsperf.com/isnumber-ab )
              // The window has length in it and must be checked too. ( jsperf.com/iswindow-prop )
              this[0] = item; 
              this['length'] = 1;
          } else {// Array-like:
              if (typeof item == 'string') {
                  this['selector'] = item;
                  item = hook('select')(item, root);
                  i = item.length;
              }
              // Ensure length is 0 or a positive finite "number" and not NaN:
              this['length'] = i = i > 0 ? i >> 0 : 0;
              while (i--) {// make array-like:
                  this[i] = item[i]; 
              }
          }
      }
    
      // jQuery-inspired magic to make `api() instanceof api` be `true` and to make
      // it so that methods added to api.fn map back to the prototype and vice versa.
      api.prototype = api['fn'] = Api.prototype;

      // Create top-level reference to self:
      // This makes it possible to bridge into a host, destroy the global w/ noConflict, 
      // and still access the entire api from the host (not just the bridged methods.)
      // It is also useful for other modules that may want to detect this module, it can be
      // used to check if an method on the host is from the api, e.g. `($.each === $.elo.each)`
      // and similarly it can be used for assigning methods even after the global is gone.
      api[name] = api;

      // Create reference to self in the chain:
      api['fn'][name] = api;

      /** 
       * Function that returns false for compat w/ jQuery's false shorthand.
       */
      function returnFalse() {
          return false;
      }

      /**
       * A hella' ballistic iterator: jQuery had sex with Underscore. This was the offspring.
       * @param  {*}        ob       is the array|object|string|function to iterate over.
       * @param  {Function} fn       is the callback - it receives (value, key, ob)
       * @param  {*=}       scope    thisArg (defaults to current item)
       * @param  {*=}       breaker  value for which if fn returns it, the loop stops (default: false)
       */
      function each(ob, fn, scope, breaker) {
          // Opt out of the native forEach here b/c we want to:
          // - Default the scope to the current item.
          // - Return the object for chaining.
          // - Be able to break out of the loop if the fn returns the breaker.
          // - Be able to iterate strings. (Avoid `in` tests.)
          if (null == ob) return ob;
          var i = 0, l = ob.length;
          breaker = void 0 !== breaker && breaker; // default: false
          if (typeof ob != 'function' && l === +l) {
              while (i < l) if (fn.call(scope || ob[i], ob[i], i++, ob) === breaker) break;
          } else {
              for (i in ob) if (fn.call(scope || ob[i], ob[i], i, ob) === breaker) break;
          }
          return ob;
      }

      /**
       * Convert SSV string to array (if not already) and iterate thru its values.
       * We want this local to be fast and furious. It gets called each time on, 
       * off, one, is called, among other internal usages.
       * @link   jsperf.com/eachssv
       * @param  {Array|string|*}  list   is a space-separated string or array to iterate over
       * @param  {Function}        fn     is the callback - it receives (value, key, ob)
       */
      function eachSSV(list, fn) {
          var l, i = 0;
          list instanceof Array || (list = list.split(' '));
          for (l = list.length; i < l; i++) {
              // Only iterate truthy values.
              // Omit thisArg support (no .call) as a minor optimization
              list[i] && fn(list[i], i, list);
          }
      }

      /**
       * Augment an object with the properties of another object.
       * @param  {Object|Array|Function}  r   receiver
       * @param  {Object|Array|Function}  s   supplier
       */
       function aug(r, s) {
          for (var k in s)
              r[k] = s[k]; 
          return r;
      }

      /**
       * Fire every function in an array (or arr-like object) using the 
       * specified scope and args.
       * @param  {Array|Object}  fns      array of functions to fire
       * @param  {Object|*}      scope    the value of `this` in each fn
       * @param  {Array=}        args     optional args to pass to each fn
       * @param  {*=}            breaker  optional value for which if any of the fns return
       *                                  that value, the loop will stop
       */
      function applyAll(fns, scope, args, breaker) {
          if (!fns) return true; // ensures the only way to return falsey is via the breaker
          var i = 0, l = fns.length, stop = void 0 !== breaker;
          stop || (breaker = 0); // breaker is disregarded w/o stop - do this to simplify the loop
          for (args = args || []; i < l; i++) {
              if (typeof fns[i] == 'function' && fns[i].apply(scope, args) === breaker && stop) {
                  // Break by returning `false` so that `applyAll` can be used to break out of `each`
                  return false;
              }
          }
          return fns;
      }

      /**
       * Get the unique id associated with the specified item. If an id has not
       * yet been created, then create it. Return `undefined` for invalid types.
       * To have an id, the item must be truthy and either an object or function.
       * @param  {*}                 item
       * @return {number|undefined}
       */
      function getId(item) {
          var id;
          if (!item) return;
          if (typeof item != 'object' && typeof item != 'function') return;
          if (item.nodeType && item.getAttribute && item.setAttribute) {
              id = item.getAttribute(uidAttr);
              id || item.setAttribute(uidAttr, (id = uid++));
              return id;
          }
          if (item === doc) return 3;
          if (item === win) return 2;
          if (item === root) return 1;
          return item[uidProp] = item[uidProp] || uid++; // other objects/funcs
      }

      /**
       * Get or set arbitrary data associated with an object.
       * @param  {Object|Array|Function}  obj
       * @param  {(string|Object)=}       key
       * @param  {*=}                     val
       */    
      function data(obj, key, val) {
          var id = getId(obj), hasVal = arguments.length > 2;
          if (!id || (hasVal && key == null))
              throw new TypeError('@data'); 
          dataMap[id] = dataMap[id] || {};
          if (key == null)
              return key === null ? void 0 : aug({}, dataMap[id]); // GET invalid OR all
          if (hasVal)
              return dataMap[id][key] = val; // SET (single)
          if (typeof key != 'object')
              return dataMap[id][key]; // GET (single)
          aug(dataMap[id], key); // SET (multi)
      }

      /**
       * Remove data associated with an object that was added via data()
       * Remove data by key, or if no key is provided, remove all.
       * @param {*=}               ob
       * @param {(string|number)=} keys
       */
      function removeData(ob, keys) {
          var id = ob && getId(ob);
          if (id && dataMap[id]) {
              if (2 > arguments.length) delete dataMap[id]; // Remove all data.
              else if (typeof keys == 'number') delete dataMap[id][keys]; 
              else keys && eachSSV(keys, function(k) {
                  delete dataMap[id][k]; 
              });
          }
          return ob;
      }

      /**
       * Remove event handlers from the internal eventMap. If `fn` is not specified,
       * then remove all the event handlers for the specified `type`. If `type` is 
       * not specified, then remove all the event handlers for the specified `node`.
       * @param  {Object|*}         node
       * @param  {(string|null)=}   type
       * @param  {Function=}        fn
       */
      function cleanEvents(node, type, fn) {
          if (!node) return;
          var fid, typ, key, updated = [], id = getId(node);
          if (id && eventMap[id]) {
              if (!type) {
                  // Remove all handlers for all event types
                  delete eventMap[id];
              } else if (eventMap[id][key = 'on' + type]) {
                  if (!fn) {
                      // Remove all handlers for a specified type
                      delete eventMap[id][key]; 
                  } else if (fid = fn[uidProp]) {
                      // Remove a specified handler
                      eachSSV(eventMap[id][key], function(handler) {
                          fid !== handler[uidProp] && updated.push(handler);
                      });
                      if (updated.length) eventMap[id][key] = updated;
                      else delete eventMap[id][key];
                      // If an `fn` was specified and the event name is namespaced, then we
                      // also need to remove the `fn` from the non-namespaced handler array:
                      typ = type.split('.')[0]; // type w/o namespace
                      typ === type || cleanEvents(node, 'on' + typ, fn);
                  }
              }
          }
      }

      /**
       * Delete **all** the elo data associated with the specified item(s).
       * @param {*}  item  is the item or collection of items whose data you want to purge.
       */
      function cleanData(item) {
          var l, i = 0;
          if (!item) return;
          removeData(item);
          if (typeof item == 'object') {
              cleanEvents(item);
              if (item.nodeType) item.removeAttribute && item.removeAttribute(uidAttr);
              else for (l = item.length; i < l;) cleanData(item[i++]); // Deep.
          }
          if (uidProp in item)
              (delete item[uidProp]) || (item[uidProp] = void 0);
      }

      /**
       * Test if the specified node supports the specified event type.
       * This function uses the same signature as Modernizr.hasEvent, 
       * @link   bit.ly/event-detection
       * @link   github.com/Modernizr/Modernizr/pull/636
       * @param  {string|*}            eventName  the event name, e.g. 'blur'
       * @param  {(Object|string|*)=}  node       a node, window, or tagName (defaults to div)
       * @return {boolean}
       */
      function hasEvent(eventName, node) {
          var isSupported;
          if (!eventName) return false;
          eventName = 'on' + eventName;

          if (!node || typeof node == 'string') node = doc.createElement(node || 'div');
          else if (typeof node != 'object') return false; // `node` was invalid type

           // Technique for modern browsers and IE:
          isSupported = eventName in node;

          // We're done unless we need the fix:              
          if (!isSupported && FIX) {
              // Hack for old Firefox - bit.ly/event-detection
              node.setAttribute || (node = doc.createElement('div'));
              if (node.setAttribute && node.removeAttribute) {
                  // Test via hack
                  node.setAttribute(eventName, '');
                  isSupported = typeof node[eventName] == 'function';
                  // Cleanup
                  null == node[eventName] || (node[eventName] = void 0);
                  node.removeAttribute(eventName);
              }
          }
          // Nullify node references to prevent memory leaks
          node = null; 
          return isSupported;
      }

      /**
       * Adapter for handling 'event maps' passed to on|off|one
       * @param {Object|*}    list  events map (event names as keys and handlers as values)
       * @param {Function}    fn    the fn (on|off|one) to call on each pair
       * @param {(Object|*)=} node  the element or object to attach the events to
       */
      function eachEvent(list, fn, node) {
          for (var name in list)
              fn(node, name, list[name]);
      }
    
      /**
       * Get a new function that calls the specified `fn` with the specified `scope`.
       * We use this to normalize the scope passed to event handlers in non-standard browsers.
       * In modern browsers the value of `this` in the listener is the node.
       * In old IE, it's the window. We normalize it here to be the `node`.
       * @param  {Function}   fn      function to normalize
       * @param  {*=}         scope   thisArg (defaults to `window`)
       * @return {Function}
       */
      function normalizeScope(fn, scope) {
          function normalized() {
              return fn.apply(scope, arguments); 
          }
          // Technically we should give `normalized` its own uid (maybe negative or
          // underscored). But, for our internal usage, cloning the original is fine, 
          // and it simplifies removing event handlers via off() (see cleanEvents()).
          if (fn[uidProp])
              normalized[uidProp] = fn[uidProp]; 
          return normalized;
      }

      /**
       * on()    Attach an event handler function for one or more event types to the specified node.
       * @param  {Object}          node    is the element|document|window|object to attach events to
       * @param  {string|Object}   types   one or more space-separated event names, or an events map
       * @param  {Function=}       fn      the callback to fire when the event occurs
       */    
      function on(node, types, fn) {
          // Don't deal w/ text/comment nodes for jQuery-compatibility.
          // jQuery's `false` "shorthand" has no effect here.            
          var id, isMap = !fn && typeof types == 'object';
          if (!node || 3 === node.nodeType || 8 === node.nodeType) return;
          if (null == types || typeof node != 'object')
              throw new TypeError('@on'); 
          if (isMap) {
              eachEvent(types, on, node); 
          } else if (fn = false === fn ? returnFalse : fn) {
              if (id = getId(node)) {
                  fn[uidProp] = fn[uidProp] || uid++; // add identifier
                  eventMap[id] = eventMap[id] || []; // initialize if needed
                  fn = W3C ? fn : normalizeScope(fn, node);
                  eachSSV(types, function(type) {
                      var typ = type.split('.')[0] // w/o namespace
                        , key = 'on' + type // w/ namespace if any
                        , prp = 'on' + typ  // w/o namespace
                        , hasNamespace = typ !== type;
                      // Add native events via the native method.
                      hasEvent(typ, node) && add(node, typ, fn);
                      // Update our internal eventMap's handlers array.
                      eventMap[id][key] ? eventMap[id][key].push(fn) : eventMap[id][key] = [fn];
                      // Update the non-namespaced array for firing when non-namespaced events trigger.
                      hasNamespace && (eventMap[id][prp] ? eventMap[id][prp].push(fn) : eventMap[id][prp] = [fn]);
                  });
              }
          }
      }

      /**
       * off()   Remove an event handlers added via on() from the specified node. If `fn` is
       *         not specified, then remove all the handlers for the specified types. If `types`
       *         is not specfied, then remove *all* the handlers from the specified node.
       * @param  {Object}           node    is the element|document|window|object to remove events from
       * @param  {(string|Object)=} types   one or more space-separated event names, or an events map
       * @param  {Function=}        fn      the event handler to remove
       */
      function off(node, types, fn) {
          if (!node || 3 === node.nodeType || 8 === node.nodeType) return;
          if (typeof node != 'object')
              throw new TypeError('@off');
          fn = false === fn ? returnFalse : fn;
          if (types == null) cleanEvents(node, types, fn); // Remove all.
          else if (!fn && typeof types == 'object') eachEvent(types, off, node); // Map.
          else eachSSV(types, function(type) {
              var typ = type.split('.')[0];
              typeof fn == 'function' && hasEvent(typ, node) && rem(node, typ, fn);
              cleanEvents(node, type, fn);
          }); 
      }

      /**
       * one()   Add an event handler that only runs once and is then removed.
       * @param  {Object}         node   is the element|document|window|object to add events to
       * @param  {string|Object}  types  one or more space-separated event names, or an events map
       * @param  {Function=}      fn     the event handler to add (runs only once)
       */
      function one(node, types, fn) {
          if (null == fn && typeof types == 'object') {
              eachEvent(types, one, node);
          } else {
              var actualHandler;
              on(node, types, (actualHandler = function() {
                  off(node, types, actualHandler);
                  return fn !== false && fn.apply(node, arguments);
              }));
          }
      }

      /**
       * Trigger handlers registered via .on() for the specifed event type. This works for
       * native and custom events, but unlike jQuery.fn.trigger it does *not* fire the
       * browser's native actions for the event. To do so would take a lot more code. 
       * In that respect it works like jQuery.fn.triggerHandler, but elo.fn.trigger
       * works like jQuery.fn.trigger otherwise (e.g. it operates on the whole set). 
       * @param  {Object}  node   is the element or object to trigger the event for
       * @param  {string}  type   is an event name to trigger (namespaces are supported)
       * @param  {Array=}  extras is an array of extra parameters to provide to the handler.
       *                          The handlers receive (eventData, extras[0], extras[1], ...)
       */
      function trigger(node, type, extras) {
          if (!type || !node || 3 === node.nodeType || 8 === node.nodeType) return;
          if (typeof node != 'object') throw new TypeError('@trigger');
          var eventData = {}, id = getId(node), args;
          if (!id || !eventMap[id]) return;
          // Emulate the native and jQuery arg signature for event listeners,
          // supplying an object as first arg, but only supply a few props.
          // The `node` becomes the `this` value inside the handler.
          eventData['type'] = type.split('.')[0]; // w/o namespace
          eventData['isTrigger'] = true;
          args = [eventData];
          extras && push.apply(args, extras);
          applyAll(eventMap[id]['on' + type], node, args);
      }

      // START domReady
      // Make the standalone domReady function 
      // Adapated from github.com/ded/domready

      /** 
       * Push the readyStack or, if the DOM is already ready, fire the `fn`
       * @param  {Function}  fn         the function to fire when the DOM is ready
       * @param  {Array=}    argsArray  is an array of args to supply to `fn` (defaults to [api])
       */
      function pushOrFire(fn, argsArray) {
          if (isReady) fn.apply(doc, argsArray || [api]);
          else readyStack.push({f: fn, a: argsArray});
      }

      // Fire all funcs in the readyStack and clear each from the readyStack as it's fired
      function flush(ob) {// voided arg
          // When the hack is needed, we prevent the flush from
          // running until the readyState regex passes:
          if (needsHack && !(/^c/).test(doc.readyState)) return;
        
          // Remove the listener.
          rem(doc, readyType, flush);

          // The flush itself only runs once.
          isReady = 1; // Record that the DOM is ready (needed in pushOrFire)
          while (ob = readyStack.shift())
              ob.f && ob.f.apply(doc, ob.a || [api]);

          // Fire handlers added via .on() too. These get an eventData object as
          // the arg and are fired after the ones above. (jQuery works the same.)
          trigger(doc, 'ready');
      }

      // Add the ready listener:
      add(doc, readyType, flush);

      /** 
       * Define our local `domReady` method:
       * The `argsArray` parameter is for internal use (but extendable via domReady.remix())
       * The public methods are created via remixReady()
       * @param {Function}  fn         the function to fire when the DOM is ready
       * @param {Array=}    argsArray  is an array of args to supply to `fn` (defaults to [api])
       */
      domReady = !needsHack ? pushOrFire : function(fn, argsArray) {
          if (self != top) {
              pushOrFire(fn, argsArray);
          } else {
              try {
                  docElem.doScroll('left'); 
              } catch (e) {
                  return setTimeout(function() { 
                      domReady(fn, argsArray); 
                  }, 50); 
              }
              fn.apply(doc, argsArray || [api]);
          }
      };
    
      /** 
       * Utility for making the public version(s) of the ready function. This gets
       * exposed as a prop on the outputted ready method itself so that devs have a
       * way to bind the ready function to a host lib and/or customize (curry) the
       * args supplied to the ready function.
       * @param  {...}   args   are zero or more args that fns passed to ready will receive
       * @return {Function}
       */    
      function remixReady(args) {
          // The `args` are supplied to the remixed ready function:
          args = slice.call(arguments);
          function ready(fn) {
              domReady(fn, args); // call the local (private) domReady method, which takes args
              if (this !== win) return this; // chain instance or parent but never window
          }
          // Put the remix function itself as method on the method.
          ready['remix'] = remixReady; 
          ready['relay'] = function($) { 
              return remixReady($ || void 0); 
          };
          return ready; // the actual domReady/.ready method that elo exposes
      }

      // Build the public domReady/.ready methods. (We include a top-level .ready alias.
      // Keep that in mind when integrating w/ libs that aim to be jQuery-compatible b/c
      // jQuery uses jQuery.ready privately for something else and here all 3 are aliased.)
      //api['ready'] = api['domReady'] = api['fn']['ready'] = remixReady(api);
      api['domReady'] = api['fn']['ready'] = eloReady = remixReady(api);

      // END domReady
    
      // Top-level only
      api['applyAll'] = applyAll;
      api['hasEvent'] = hasEvent;
      api['qsa'] = queryEngine;   

      // Top-level + chainable
      // The top-level version are the simple (singular) versions defined above. (They 
      // operate directly on a node or object). The effin versions of these are 'built'
      // below via wrapperize() and they operate on each object in a matched set.
      api['removeData'] = removeData;
      api['cleanData'] = cleanData;
      api['addEvent'] = add;
      api['removeEvent'] = rem;
      api['on'] = on;
      api['off'] = off;
      api['one'] = one; 
      api['trigger'] = trigger;

      // Top-level + chainable (more)
      // The effin versions of these are made manually below
      api['each'] = each;
      api['data'] = data;

      /** 
       * Utility for converting simple static methods into their chainable effin versions.
       * @link   jsperf.com/wrapperized-methods/3
       * @param  {Function}  fn
       * @return {Function}
       */
      function wrapperize(fn) {
          return function() {
              var i = 0, args = [0], l = this.length;
              for (push.apply(args, arguments); i < l;)
                  null != (args[0] = this[i++]) && fn.apply(this, args);
              return this;
          };
      }

      // Build effin versions of these static methods.
      eachSSV('addEvent removeEvent on off one trigger removeData', function(methodName) {
          api['fn'][methodName] = wrapperize(api[methodName]);
      });

      /**
       * @param  {Function} fn       is the callback - it receives (value, key, ob)
       * @param  {*=}       scope    thisArg (defaults to current item)
       * @param  {*=}       breaker  defaults to `false`
       */
      api['fn']['each'] = function(fn, scope, breaker) {
          return each(this, fn, scope, breaker); 
      };

      // In elo 1.4+ the cleanData method is only directly avail on the top-level.
      // api['fn']['cleanData'] = function (inclInstance) {
      //    return true === inclInstance ? cleanData(this) : each(this, cleanData);
      // };

      /**
       * Fire every function in `this` **OR** fire one or more 
       * functions for each item in `this` -- using the supplied args.
       * Syntax 1: $(fnsArray).applyAll(scope [, args, breaker])
       * Syntax 2: $(els).applyAll(fnsArray [, args, breaker, outerContinue])
       * In syntax 2, the scope in the apply'd fn will be the current elem.
       * Syntax 1 used *unless* the first arg is an *array*.
       * $(els).applyAll(fnsArray, args, false) //< able to break firing on current el and move onto the next el
       * $(els).applyAll(fnsArray, args, false, false) //< able to break "hard" (break out of both loops)
       */
      api['fn']['applyAll'] = function(scope, args, breaker, outerContinue) {
          if (scope instanceof Array) {// Syntax 2:
              // HANDLE: $(els).applyAll([function(a, b, c) {   }], [a, b, c]);
              outerContinue = outerContinue !== false; // convert to `each` breaker
              return each(this, function(el) {// `el` goes to the scope of the apply'd fn:
                  return applyAll(this, el, args, breaker) ? true : outerContinue;
              }, scope); // < pass `scope` (array of fns) as `this` in iterator
          }
          // Syntax 1:
          // HANDLE: $(fns).applyAll(thisArg, [a, b, c]); 
          // (thisArg can be anything but an array in this syntax)
          return applyAll(this, scope, args, breaker); 
      };
    
      // Handle data separately so that we can return the value on gets
      // but return the instance on sets. This sets the val on each elem
      // in the set vs. the lower-level method that only sets one object.
      api['fn']['data'] = function(key, val) {
          var i, n, count = arguments.length, hasVal = 1 < count;
          if (!count) return this[0] ? data(this[0]) : void 0; // GET-all

          // We have to make sure `key` is not an object (in which case it'd be set, not get)
          // Strings created by (new String()) are treated as objects. ( bit.ly/NPuVIr )
          // Also remember that `key` can be a `number` too.
          if (!hasVal && typeof key != 'object')
              // Expedite simple gets by directly grabbing from the dataMap.
              // Return the value (if it exists) or else undefined:
              return (i = getId(this[0])) && dataMap[i] ? dataMap[i][key] : void 0; // GET
        
          for (i = 0, n = this.length; i < n; i++)
              // Iterate thru the truthy items, setting data on each of them.
              this[i] && (hasVal ? data(this[i], key, val) : data(this[i], key)); // SET
          return this;
      };
    
      // Include this b/c of it relates to internal data.
      // adapted from jQuery.fn.empty
      api['fn']['empty'] = function() {
          for (var node, i = 0; null != (node = this[i]); i++) {
              1 === node.nodeType && cleanData(node.getElementsByTagName('*'));
              while (node.firstChild) node.removeChild(node.firstChild);
          }
          return this;
      };

      /**
       * Add event shortcut methods to the chain specified via an SSV list or array.
       * @since      1.4 (formerly mixinEvent())
       * @param      {Array|string}  list   array or SSV string of shortcut names
       * @param      {boolean=}      force  whether to overwrite existing methods (default: false)
       * @link       developer.mozilla.org/en/DOM_Events
       * @example    $.dubEvent('resize scroll focus')  // creates $.fn.resize, ...
       */
      function dubEvent(list, force) {
          if (this === win) return;
          var receiver = this;
          force = true === force;
          list && eachSSV(list, function(n) {
              (force || void 0 === receiver[n]) && (receiver[n] = function (fn) {
                  return arguments.length ? this['on'](n, fn) : this['trigger'](n);
              });
          });
          return receiver;
      }
      api['fn']['dubEvent'] = dubEvent;

      /**
       * Integrate applicable methods|objects into a host.
       * @link  github.com/ryanve/submix
       * @this  {Object|Function}                supplier
       * @param {Object|Function}         r      receiver
       * @param {boolean=}                force  whether to overwrite existing props (default: false)
       * @param {(Object|Function|null)=} $      the top-level of the host api (default: `r`)
       *                                         For default behavior `$` should be omitted or set to 
       *                                         `undefined`. This param allows you to bridge to a receiver, 
       *                                         but relay methods based on a another host, for example 
       *                                         `someModule.bridge({}, false, jQuery)`. Set `$` explicity
       *                                         to `null` *only* if you want to communicate to relays that
       *                                         there should be *no* main api.                                   
       */
      function bridge(r, force, $) {
          var v, k, relay, custom, s = this; // s is the supplier
          if (!r || !s || s === win) return;
          custom = s['bridge']; // supplier may have custom bridge
          if (typeof custom == 'function' && custom['relay'] === false) {
              custom.apply(this, arguments);
              return r;
          }
        
          force = true === force; // require explicit true to force
          $ = typeof $ == 'function' || typeof $ == 'object' ? $ : r; // allow null
          for (k in s) {
              v = s[k];
              if (typeof v == 'function' || typeof v == 'object' && v) {
                  if ('fn' === k && v !== s) {
                      // 2nd check above prevents infinite loop 
                      // from `.fn` having ref to self on it.
                      bridge.call(v, r[k], force, $);
                  } else if (force ? r[k] !== r && r[k] !== $ : r[k] == null) {
                      // The check above prevents overwriting receiver's refs to
                      // self (even if forced). Now handle relays and the transfer:
                      relay = v['relay'];
                      if (typeof relay == 'function') {
                          // Fire relay functions. I haven't fully solidified the
                          // relay call sig. Considering: .call(v, $, r[k], k, r)
                          // This passes the essentials:
                          relay = relay.call(v, $, r[k]);
                      }
                      if (relay !== false) {// Provides a way to bypass non-agnostic props.
                          // Transfer the value. Default to the orig supplier value:
                          r[k] = relay || v;
                      }
                  }
              }
          }
          return r;
      }
    
      // signify that this bridge() is module agnostic
      bridge['relay'] = true;
      api['bridge'] = bridge;

      /**
       * @param  {Object|Function}  api
       * @param  {Object|Function}  root
       * @param  {string}           name
       * @param  {string=}          alias
       */
      function noConflictRemix(api, root, name, alias) {
          if (!root || !name || !api ) return;
          var old = root[name], viejo;
          alias = typeof alias == 'string' && alias;
          viejo = alias && root[alias];

          function noConflict(fn) {
              alias && api === root[alias] && (root[alias] = viejo);
              (fn || !alias) && api === root[name] && (root[name] = old);
              typeof fn == 'function' && fn.call(root, api, name, alias); 
              return api;
          }

          noConflict['relay'] = false;
          noConflict['remix'] = noConflictRemix;
          return noConflict;
      }
      api['noConflict'] = noConflictRemix(api, root, name, '$');

      // api.eventMap = eventMap; // only for testing
      // api.dataMap = dataMap;   // only for testing
      return api;
  }));
  if (typeof provide == "function") provide("elo", module.exports);

  // bridge file for ender.jit.su
  require('elo')['bridge'](ender);
}());