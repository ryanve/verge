/*!
  * =============================================================
  * Ender: open module JavaScript framework (https://ender.no.de)
  * Build: ender build actual aok annex blood elo
  * Packages: ender-js@0.5.0 actual@0.2.0 aok@1.7.2 annex@0.1.6 blood@0.7.0 elo@1.6.0
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
   * actual 0.2.0+201402061122
   * https://github.com/ryanve/actual
   * MIT License 2014 Ryan Van Etten
   */

  (function(root, name, make) {
    if (typeof module != 'undefined' && module['exports']) module['exports'] = make();
    else root[name] = make();
  }(this, 'actual', function() {

    /**
     * @param {string} feature range feature name e.g. "width"
     * @param {string=} unit CSS unit for feature e.g. "em"
     * @param {number=} init initial guess
     * @param {number=} step size for iterations
     * @return {number} breakpoint (0 if invalid unit or feature)
     */
    function actual(feature, unit, init, step) {
      var up, gte, lte, curr, mq = actual['mq'];
      unit = typeof unit == 'string' ? unit : '';
      init = 0 < init ? (unit ? +init : init>>0) : 1;
      // Step starts positive. Minimize iterations, unless feat may be "integer" type.
      step = 0 < step ? +step : 0 > step ? -step : 'px' == unit ? 256 : unit ? 32 : 1;
      for (feature += ':', unit += ')', curr = init; step && 0 <= curr; curr+=step) {
        lte = mq('(min-' + feature + curr + unit);
        gte = mq('(max-' + feature + curr + unit);
        // Found: Use the floored value if it makes an exact match. Else return as is.
        if (lte && gte) return mq('(' + feature + (curr>>0) + unit) ? curr>>0 : curr;
        // 1st iteration: Save direction. Flip if down. Break if neither b/c unknown.
        if (null == up) step = (up = !gte) ? lte && step : -step;
        // Later iterations: If skipped, reverse direction and raise precision.
        else if (gte ? up : !up) up = !up, step = -step/2;
      }
      return 0;
    }
  
    /**
     * @param {string} unit
     * @return {Function}
     */
    function as(unit) {
      return function(feature) {
        return actual(feature, unit);
      };
    }
  
    /**
     * @param {string} feat
     * @return {Function}
     */
    function feature(feat) {
      return function(unit) {
        return actual(feat, unit);
      };
    }
  
    var media = 'matchMedia', win = typeof window != 'undefined' && window;
    actual['actual'] = actual;
    actual['feature'] = feature;
    actual['as'] = as;
    actual['mq'] = win[media] || win[media = 'msMatchMedia'] ? function(q) {
      return !!win[media](q).matches;
    } : function() {
      return false;
    };
  
    return actual;
  }));
  if (typeof provide == "function") provide("actual", module.exports);
  $.ender(module.exports);
}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
   * aok 1.7.2+201311230458
   * https://github.com/ryanve/aok
   * MIT License 2013 Ryan Van Etten
   */

  (function(root, name, make) {
      typeof module != 'undefined' && module['exports'] ? module['exports'] = make() : root[name] = make();
  }(this, 'aok', function() {

      // Sync the prototype and use local alias
      var model = aok.prototype = Aok.prototype
        , globe = this
        , plain = {}
        , owns = plain.hasOwnProperty
        , toString = plain.toString
        , win = typeof window != 'undefined' && window
        , nativeConsole = typeof console != 'undefined' && console
        , hasAlert = win && 'alert' in win
        , uid = 0
        , has = function(o, k) {
              return owns.call(o, k);
          }
        , assign = function(to, from) {
              for (var k in from) has(from, k) && (to[k] = from[k]);
              return to;
          }
        , clone = function(fn) {
              return assign(function() {
                  fn.apply(this, arguments);
              }, fn);
          };
      
      /**
       * @constructor 
       * @param {*=} data
       */
      function Aok(data) {
          // Own 'test' unless instantiated w/o args,
          // or unless `data` is 'object' w/o 'test'.
          // Running proceeds only if 'test' is owned.
          if (typeof data == 'object' && data) assign(this, data);
          else if (arguments.length) this['test'] = data;
          this['init']();
      }

      /**
       * @param {*=} data
       * @return {Aok}
       */
      function aok(data) {
          return arguments.length ? new Aok(data) : new Aok; 
      }
    
      // Console abstractions
      assign(aok, aok['console'] = (function(abstracted, console, hasAlert, win) {
          function abstracts(name, force, fallback) {
              var method = console && typeof console[name] == 'function' ? function() {
                  console[name].apply(console, arguments);
              } : fallback ? fallback : hasAlert ? function() {
                  method['force'] && win.alert(name + ': ' + [].join.call(arguments, ' '));
              } : function() {};
              method['force'] = !!force;
              abstracted[name] = method;
          }

          abstracts('log');
          abstracts('trace');
          abstracts('info', 1);
          abstracts('warn', 1);
          abstracts('error', 1);
          abstracts('clear', 0, function() {});
          abstracts('assert', 1, function(exp, msg) {
              exp || abstracted['warn'](msg);
          });
          return abstracted;
      }({}, nativeConsole, hasAlert, win)));
    
      // Alias the "express" method to the prototype for usage with tests.
      model['express'] = aok['express'] = clone(aok['log']);
    
      // Default messages
      model['pass'] = 'Pass';
      model['fail'] = 'Fail';

      /**
       * @this {Aok|Object}
       * @return {Aok|Object}
       */
      model['init'] = function() {
          if (this === globe) throw new Error('@this');
          has(this, 'id') || (this['id'] = ++uid);
          has(this, 'test') && this['run']();
          return this;
      };
    
      /**
       * Run test and trigger its handler.
       * @this {Aok|Object}
       * @return {Aok|Object}
       */
      model['run'] = function() {
          if (this === globe) throw new Error('@this');
          this['test'] = !!aok['result'](this, 'test');
          return this['handler']();
      };
    
      /**
       * @this {Aok|Object}
       * @param {(string|number)=} key
       */
      model['cull'] = function(key) {
          return this[this[null == key ? 'test' : key] ? 'pass' : 'fail'];
      };

      /**
       * default handler can be overridden
       * @return {Aok}
       */
      model['handler'] = function() {
          var msg = this['cull']();
          if (typeof msg == 'function') msg.call(this);
          else this['express']('#' + this['id'] + ': ' + this['explain'](msg));
          return this;
      };
    
      /**
       * @param {*=} item
       * @return {string}
       */
      model['explain'] = aok['explain'] = function(item) {
          item = arguments.length ? item : this;
          return item === Object(item) ? toString.call(item) : '' + item;
      };
    
      /**
       * @param {*} o
       * @param {(string|number|Function)=} k
       * @param {Object=} guard array methods
       * @example result([1], 0) // 1
       */
      aok['result'] = function(o, k, guard) {
          guard || k === guard ? (k = o, o = this) : (typeof k == 'function' ? k : k = o[k]);
          return typeof k == 'function' ? k.call(o) : k;
      };
    
      /**
       * @param {{length:number}} stack
       * @param {Function|number} fn
       * @param {*=} scope
       * @param {number=} limit
       * @return {number} passes
       */
      aok['pass'] = function(stack, fn, scope, limit) {
          if (typeof fn == 'number') return stack ? 1 : 0;
          var l = stack.length, i = 0, n = 0;
          while (i < l) if (fn.call(scope, stack[i], i++, stack) && ++n === limit) break;
          return n;
      };
    
      /**
       * @param {{length:number}} stack
       * @param {Function|number} fn
       * @param {*=} scope
       * @param {number=} limit
       * @return {number} fails
       */
      aok['fail'] = function(stack, fn, scope, limit) {
          if (typeof fn == 'number') return stack ? 0 : 1;
          var l = stack.length, i = 0, n = 0;
          while (i < l) if (!fn.call(scope, stack[i], i++, stack) && ++n === limit) break;
          return n;
      };
    
      /**
       * @this {*} scope to run in
       * @param {number} trials
       * @param {Function} fn
       * @return {number} millisecond time for `fn` to run `trials` times
       */
      aok['perform'] = function(trials, fn) {
          var i = 0, time = +new Date;
          while (i++ < trials) fn.call(this);
          return +new Date - time;
      };
    
      /**
       * @this {*} scope to run in
       * @param {number} trials
       * @param {Array|Function} rivals
       * @return {Array} millisecond map of each `rivals` item's time
       */
      aok['race'] = function(trials, rivals) {
          rivals = [].concat(rivals); // map
          for (var go = aok['perform'], l = rivals.length, i = 0; i < l;)
              rivals[i] = go.call(this, trials, rivals[i++]);
          return rivals; // scores
      };

      /**
       * @param {Function|string} fn callback or key
       * @return {Function} uses try/catch to test if `fn` can run
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
       * @param {string} n   
       * @return {Node|boolean}
       */
      aok['id'] = function(n) {
          return document.getElementById(n) || false;
      };

      return aok;
  }));
  if (typeof provide == "function") provide("aok", module.exports);
  $.ender(module.exports);
}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
   * annex 0.1.6+201311261130
   * https://github.com/ryanve/annex
   * MIT License 2013 Ryan Van Etten
   */

  (function(root, name, make) {
      if (typeof module != 'undefined' && module['exports']) module['exports'] = make();
      else root[name] = make();
  }(this, 'annex', function() {

      var inner = {}
        , effin = annex['fn'] = annex.prototype = Annex.prototype
        , chain = 'pushStack'
        , array = []
        , concat = array.concat
        , push = array.push
        , markup = /<|&#?\w+;/
        , resource = /<(?:script|style|link)/i
        , cleaners = ['removeData', 'off']
        , doc = document
        , docElem = doc.documentElement
        , textContent = 'textContent'
        , W3C = textContent in docElem
        , element = 'element'
        , find = 'find'
        , html = 'html'
        , text = 'text';
    
      inner[text] = W3C ? textContent : 'innerText';
      inner[html] = 'innerHTML';

      /**
       * @constructor
       * @param {(Node|{length:number}|string|null)=} item
       * @param {(Node|{length:number}|null)=} context
       */
      function Annex(item, context) {
          this.length = 0;
          push.apply(this, prepare.call(context, item));
      }

      /**
       * @param {(Node|{length:number}|string|null)=} item
       * @param {(Node|{length:number}|null)=} context
       * @return {Annex}
       */
      function annex(item, context) {
          return new Annex(item, context);
      }
    
      function output(result, context) {
          return (context[chain] || annex)(result);
      }
    
      function prepare(inserts) {
          return typeof inserts == 'string' ? build(inserts, this) : collect(inserts);
      }
    
      function collect(o) {
          return null == o ? [] : o.nodeType || o.window == o ? [o] : o;
      }
    
      function first(o) {
          return null == o || o.nodeType || o.window == o ? o : o[0];
      }
    
      function flatten(stack) {
          return concat.apply(array, stack);
      }
    
      /**
       * @param {{length:number}} stack
       * @param {Function} fn
       * @param {*=} scope
       * @return {Array}
       */
      function map(stack, fn, scope) {
          for (var r = [], i = 0, l = stack.length; i < l;) r[i] = fn.call(scope, stack[i++]);
          return r;
      }

      /**
       * @param {{length:number}} stack
       * @param {Function|Object} fn
       * @param {?*=} scope
       * @param {?string=} call method
       */
      function each(stack, fn, scope, call) {
          call = call || 'call';
          for (var i = 0, l = stack.length; i < l;) fn[call](scope, stack[i++]);
          return stack;
      }
    
      /**
       * @param {{length:number}} stack
       * @param {Function} fn
       * @param {*=} scope
       */
      function eachApply(stack, fn, scope) {
          return each(stack, fn, scope, 'apply');
      }
    
      /**
       * @description Bulk insertion adapter. Nodes must be cloned to insert into secondary targets.
       * @param {{length:number}} targets
       * @param {Function} fn
       * @param {{length:number}} inserts
       */
      function bulk(targets, fn, inserts) {
          for (var i = 0, l = targets.length; i < l;) fn.call(i ? clone(inserts) : inserts, targets[i++]);
          return targets;
      }
    
      /**
       * @param {{length:number}} stack
       * @param {string} key
       * @return {string}
       */
      function readAll(stack, key) {
          return map(stack, function(v) {
              return v && v[key] || '';
          }).join('');
      }
     
      /**
       * @param {*=} o context
       * @return {Document}
       */
      function owner(o) {
          o = first(o);
          return o && (9 == o.nodeType ? o : o[o.window == o ? 'document' : 'ownerDocument']) || doc;
      }
    
      function select(target, context) {
          return (typeof target == 'string' ? output(doc, context)[find] : collect)(target);
      }
    
      function filter(stack, selector) {
          return typeof selector == 'string' ? stack['filter'](selector) : stack;
      }

      function invoke(method) {
          this[method] && this[method]();
      }
    
    
      /**
       * @param {{length:number}} stack
       * @param {string=} selector
       */
      function cleanup(stack, selector) {
          selector && !stack[find] || each(cleaners, invoke, selector ? stack[find](selector) : stack);
          return stack;
      }

      /**
       * @return {number|boolean}
       */
      function isNode(o) {
          return o && o.nodeType || false;
      }
    
      /**
       * @param {Node} parent
       * @return {Array}
       */
      function contents(parent) {
          for (var r = [], n = parent.firstChild; n; n = n.nextSibling) r.push(n);
          return r;
      }

      /**
       * @param {string} str
       * @param {(Node|{length:number}|null)=} context
       * @return {Array}
       */
      function build(str, context) {
          var nodes, parent;
          if (resource.test(str)) return [];
          if (!markup.test(str)) return [create[text](str, context)];
          parent = create[element]('div', context);
          parent[inner[html]] = str;
          nodes = contents(parent);
          empty(parent);
          return nodes;
      }

      /**
       * @param {Node} n
       * @return {Node}
       */
      function cloneNode(n) {
          return n.cloneNode(true);
      }
    
      /**
       * @param {Node|{length:number}} node
       * @return {Array}
       */
      function clone(node) {
          return map(collect(node), cloneNode);
      }
    
      effin['clone'] = function() {
          return output(clone(this), this);
      };
    
      /**
       * @param {string|{length:number}|Node} what
       * @param {({length:number}|Node)=} context
       * @return {Array}
       */
      function create(what, context) {
          return typeof what == 'string' ? build(what, context) : clone(what);
      }
    
      eachApply([[text, 'TextNode'], [element, 'Element'], [html]], function(key, method) {
          create[key] = method ? (method = 'create' + method, function(str, reference) {
              return owner(reference)[method](str);
          }) : create;
      });
    
      /**
       * @param {{length:number}|Node} node or collection
       */
      annex[text] = function(node) {
          return readAll(collect(node), inner[text]);
      };
    
      /**
       * @param {{length:number}|Node} node
       * @return {string|undefined}
       */
      annex[html] = function(node) {
          return isNode(node = first(node)) ? node[inner[html]] : void 0;
      };
    
      each([text, html], function(key) {
          effin[key] = function(str) {
              if (void 0 === str) return annex[key](this);
              return this['empty']()['append'](create[key](str, this));
          };
      });
    
      /**
       * @this {{length:number}}
       * @param {Node} parent
       */
      function appendTo(parent) {
          each(this, parent.appendChild, parent);
      }
    
      /**
       * @this {{length:number}}
       * @param {Node} parent
       */
      function prependTo(parent) {
          each(this, insertBefore, [parent, parent.firstChild]);
      }
    
      /**
       * @this {Array} contains parent and reference nodes
       * @param {Node} insertion
       */
      function insertBefore(insertion) {
          this[0].insertBefore(insertion, this[1]);
      }

      eachApply([['prepend', prependTo], ['append', appendTo]], function(key, handler) {
          effin[key] = function() {
              return bulk(this, handler, flatten(map(arguments, prepare, this)));
          };
          effin[key + 'To'] = function(target) {
              bulk(select(target, this), handler, this);
              return this;
          };
      });
    
      eachApply([['after', 'nextSibling'], ['before']], function(key, next) {
          effin[key] = function() {
              return bulk(this, function(reference) {
                  var parent = reference && reference.parentNode;
                  parent && each(this, insertBefore, [parent, next ? reference[next] : reference]);
              }, flatten(map(arguments, prepare, this)));
          };
      });

      /**
       * @param {Node} node
       */
      function detach(node) {
          node.parentNode && node.parentNode.removeChild(node);
      }
      annex['detach'] = detach;
    
      /**
       * @param {string=} selector only works when filter exists
       */
      effin['detach'] = function(selector) {
          each(filter(this, selector), detach);
          return this;
      };
    
      /**
       * @param {string=} selector only works when filter exists
       */
      effin['remove'] = function(selector) {
          // Filter, clean descendants, clean self, detach.
          each(cleanup(cleanup(filter(this, selector), '*')), detach);
          return this;
      };

      /**
       * @param {Node} node
       */
      function empty(node) {
          while (node.firstChild) node.removeChild(node.firstChild);
      }
      annex['empty'] = empty;
      effin['empty'] = function() {
          return each(cleanup(this, '*'), empty);
      };

      return annex;
  }));
  if (typeof provide == "function") provide("annex", module.exports);

  (typeof ender == 'function' && ender['ender'](require('annex')['fn'], true));
}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
   * blood 0.7.0+201311120940
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
           * @param {*} o
           * @param {string|number} key
           * @return {boolean}
           */
        , has = function(o, key) {
              return owns.call(o, key);
          }

        , keys = !hasEnumBug && Object.keys || function(o) {
              var k, i = 0, r = [], others = dontEnums;
              for (k in o) has(o, k) && (r[i++] = k);
              if (o !== OP) for (i = others.length; i--;) has(o, k = others[i]) && admit(r, k);
              return r;
          }

        , names = !hasEnumBug && Object.getOwnPropertyNames || function(o) {
              // getOwnPropertyNames cannot be emulated exactly. Get as close as possible.
              // Include 'length' if owned and non-enumerable, such as for native arrays.
              var names = keys(o);
              has(o, 'length') && !loops.call(o, 'length') && names.push('length');
              return names;
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
               * @link http://github.com/kriskowal/es5-shim/pull/132
               * @link http://github.com/kriskowal/es5-shim/issues/150
               * @link http://github.com/kriskowal/es5-shim/pull/118
               * @param {Object|null}  parent
               * @return {Object}
               */
              return function(parent) {
                  /** @constructor */
                  function F() {}
                  F.prototype = null === parent ? emptyProto : parent;
                  var instance = new F; // inherits F.prototype
                  null === parent || (instance[proto] = parent); // hack getPrototypeOf in IE8-
                  return instance;
              };
          }(combine([proto].concat(dontEnums), [null])))

        , getPro = Object.getPrototypeOf || function(o) {
              return void 0 !== o[proto] ? o[proto] : (o.constructor || Object).prototype; 
          }

        , setPro = function(o, pro) {
              o[proto] = pro; // experimental
              return o;
          };

      /**
       * @param {Object} to
       * @param {Object=} from
       * @param {(Array|string|number|boolean)=} list
       */
      function adopt(to, from, list) {
          var i = arguments.length, force = null != (false === list ? list = null : list);
          if (1 === i) from = to, to = this;
          list = force && true !== list ? (typeof list != 'object' ? [list] : list) : keys(from);
          i = list.length;
          if (0 < i) while (i--) if (force || !has(to, list[i])) to[list[i]] = from[list[i]];
          return to;
      }

      /**
       * @param {Object} to
       * @param {Object} from
       */
      function assign(to, from) {
          // Functionally like the ES6 Object.assign expectation, plus single-param syntax
          1 === arguments.length && (from = to, to = this);
          return adopt(to, from, keys(from));
      }
    
      /**
       * @param {Object} o
       * @param {Object|null} pro
       */
      function line(o, pro) {
          return 2 == arguments.length ? setPro(o, pro) : getPro(o);
      }

      /**
       * @param {Object} source
       * @return {Object}
       */
      function orphan(source) {
          return source ? assign(create(null), source) : create(null);
      }

      /**
       * @param {(Object|null)=} source
       * @param {(Object|null)=} parent
       */
      function twin(source, parent) {
          var n = arguments.length;
          source = n ? source : this;
          parent = 2 == n ? parent : getPro(source);
          return adopt(create(parent), source, names(source));
      }
    
      /**
       * @param {Object} o
       * @return {Array}
       */
      function tree(o) {
          var chain = [o];
          while (null != (o = getPro(o))) chain.push(o);
          return chain;
      }
    
      /**
       * @param {Object} o
       * @return {Array}
       */
      function roots(o) {
          return tree(o).slice(1);
      }
    
      /**
       * @param {Object} o source to read from
       * @param {Function} cb callback
       * @param {boolean=} fold
       * @return {Function}
       */
      function swap(o, cb, fold) {
          return fold ? function(memo, k) {
              return cb.call(this, memo, o[k], k, o);
          } : function(k) {
              return cb.call(this, o[k], k, o);
          };
      }
    
      /**
       * @param {Function} fn stack iterator
       * @param {boolean=} fold
       * @return {Function}
       */
      function proxy(fn, fold) {
          return function(o) {
              return fn.apply(fn, map(arguments, function(v, i) {
                  return 0 === i ? keys(v) : 1 === i ? swap(o, v, fold) : v;
              }));
          };
      }
    
      /**
       * @param {{length:number}} stack
       * @param {Function=} fn
       * @param {*=} scope
       * @return {boolean}
       */
      function some(stack, fn, scope) {
          var l = stack.length, i = 0;
          while (i < l) if (fn.call(scope, stack[i], i++, stack)) return true;
          return false;
      }
    
      /**
       * @param {{length:number}} stack
       * @param {Function=} fn
       * @param {*=} scope
       * @return {boolean}
       */
      function every(stack, fn, scope) {
          var l = stack.length, i = 0;
          while (i < l) if (!fn.call(scope, stack[i], i++, stack)) return false;
          return true;
      }
    
      /**
       * @param {{length:number}} stack
       * @param {Function} accum
       * @param {*=} value
       * @param {*=} scope
       */
      function reduce(stack, accum, value, scope) {
          var i = 0, l = stack.length;
          value = 3 > arguments.length ? stack[i++] : value;
          while (i < l) value = accum.call(scope, value, stack[i], i++, stack);
          return value;
      }
    
      /**
       * @param {{length:number}} stack
       * @param {Function} fn
       * @param {*=} scope
       * @return {Array}
       */
      function map(stack, fn, scope) {
          var r = [], l = stack.length, i = 0;
          while (i < l) r[i] = fn.call(scope, stack[i], i++, stack);
          return r;
      }

      /**
       * @param {{length:number}} stack
       * @param {string|number} key
       * @return {Array}
       */
      function pluck(stack, key) {
          return map(stack, function(v) {
              return v[key];
          });
      }

      /**
       * @param {{length:number}} stack
       * @param {*=} value
       * @return {{length:number}}
       */
      function admit(stack, value) {
          ~indexOf.call(stack, value) || push.call(stack, value);
          return stack;
      }
    
      /**
       * @param {{length:number}} stack
       * @return {Array}
       */
      function uniq(stack) {
          return reduce(stack, admit, []);
      }

      /**
       * @param {*} o
       * @return {number}
       */
      function size(o) {
          return null == o ? 0 : (o.length === +o.length ? o : keys(o)).length; 
      }

      /**
       * @param {Object} o
       * @return {Array}
       */
      function values(o) {
          var list = keys(o), i = list.length;
          while (i--) list[i] = o[list[i]];
          return list;
      }
    
      /**
       * @param {Object} o
       * @return {Array}
       */
      function pairs(o) {
          var list = keys(o), i = list.length;
          while (i--) list[i] = [list[i], o[list[i]]];
          return list;
      }
    
      /**
       * @param {{length:number}} keys
       * @param {{length:number}} values
       * @return {Object}
       */
      function combine(keys, values) {
          var o = {};
          return some(keys, values ? function(n, i) {
              o[n] = values[i];
          } : function(pair) {
              o[pair[0]] = pair[1];
          }), o;
      }

      /**
       * @param {Object} o
       * @return {Object}
       */
      function invert(o) {
          return combine(values(o), keys(o));
      }

      /**
       * @param {number} max
       * @param {{length:number}} stack
       * @return {number}
       */
      function longer(max, stack) {
          var i = stack.length >> 0;
          return i > max ? i : max;
      }
    
      /**
       * like underscorejs.org/#zip
       * @param {...}
       * @return {Array}
       */
      function zip() {
          var r = [], i = reduce(arguments, longer, 0);
          while (i--) r[i] = pluck(arguments, i);
          return r;
      }

      /**
       * @param {Object} o
       * @param {string|Array} type
       * @return {Array}
       */
      function types(o, type) {
          var names = keys(o), i = names.length;
          type = typeof type != 'object' ? [type] : type;
          while (i--) ~indexOf.call(type, typeof o[names[i]]) || names.splice(i, 1);
          return names.sort();
      }
    
      /**
       * @param {Object} o
       * @return {Array}
       */
      function methods(o) {
          return types(o, 'function');
      }

      /**
       * @param {Object} from
       * @return {Object}
       */
      function pick(from) {
          for (var r = {}, list = concat.apply(AP, slice.call(arguments, 1)), l = list.length, i = 0; i < l; i++)
              if (list[i] in from) r[list[i]] = from[list[i]];
          return r;
      }

      /**
       * @param {Object} from
       * @return {Object}
       */
      function omit(from) {
          var k, r = {}, list = concat.apply(AP, slice.call(arguments, 1));
          for (k in from) ~indexOf.call(list, k) || (r[k] = from[k]);
          return r;
      }

      /**
       * @param {Object} o
       * @param {*} needle
       * @return {boolean}
       */
      function include(o, needle) {
          // Emulate _.include (underscorejs.org/#contains)
          return !!~indexOf.call(o.length === +o.length ? o : values(o), needle);
      }
    
      /**
       * @param {*} a
       * @param {*=} b
       * @return {boolean}
       */
      function same(a, b) {
          // Emulate ES6 Object.is - Fixes NaN and discerns -0 from 0
          return a === b ? (0 !== a || 1/a === 1/b) : a !== a && b !== b; 
      }

      return {
          'adopt': adopt
        , 'all': proxy(every)
        , 'any': proxy(some)
        , 'assign': assign
        , 'create': create
        , 'collect': proxy(map)
        , 'every': every
        , 'has': has
        , 'include': include
        , 'inject': proxy(reduce, true)
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
        , 'names': names
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
   * elo 1.6.0 cross-browser JavaScript events and data module
   * @link http://elo.airve.com
   * @license MIT
   * @author Ryan Van Etten
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
       * @param {*} item
       * @param {Object=} root 
       */
      function api(item, root) {
          return new Api(item, root);
      }

     /**
      * @constructor
      * @param {*=} item 
      * @param {Object=} root 
      * adapted from jQuery and ender
      */
      function Api(item, root) {
          var i;
          this.length = 0;
          item = typeof item == 'string' ? hook('select')(this['selector'] = item, root) : item;
          if (typeof item == 'function') {
              hook('api')(item); // designed to be closure or ready shortcut
          } else if (null != item) {        
              if (item.nodeType || typeof (i = item.length) != 'number' || item.window == item)
                  this[this.length++] = item;
              else for (this.length = i = i > 0 ? i >> 0 : 0; i--;) // ensure positive integer
                  this[i] = item[i]; 
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
       * @param {*} ob is the array|object|string|function to iterate over.
       * @param {Function} fn is the callback - it receives (value, key, ob)
       * @param {*=} scope thisArg (defaults to current item)
       * @param {*=} breaker value for which if fn returns it, the loop stops (default: false)
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
       * Iterate space-separated values. Optimized for internal use.
       * @link http://jsperf.com/eachssv
       * @param {Array|string|*} list to iterate over
       * @param {Function} fn callback
       */
      function eachSSV(list, fn) {
          var l, i = 0;
          list = list instanceof Array ? list : list.split(' ');
          for (l = list.length; i < l; i++) {
              list[i] && fn(list[i], i, list);
          }
      }

      /**
       * Augment an object with the properties of another object.
       * @param {Object|Array|Function} r receiver
       * @param {Object|Array|Function} s supplier
       */
       function aug(r, s) {
          for (var k in s) r[k] = s[k]; 
          return r;
      }

      /**
       * Apply every function in a stack using the specified scope and args.
       * @param {{length:number}} fns stack of functions to fire
       * @param {*=} scope thisArg
       * @param {(Array|Arguments)=} args
       * @param {*=} breaker unless undefined
       * @return {boolean} true if none return the breaker
       */
      function applyAll(fns, scope, args, breaker) {
          if (!fns) return true;
          var i = 0, l = fns.length;
          breaker = void 0 === breaker ? {} : breaker; // disregard if none
          for (args = args || []; i < l; i++)
              if (typeof fns[i] == 'function' && fns[i].apply(scope, args) === breaker) return false;
          return true;
      }

      /**
       * Get the unique id associated with the specified item. If an id has not
       * yet been created, then create it. Return `undefined` for invalid types.
       * To have an id, the item must be truthy and either an object or function.
       * @param {*} item
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
       * @param {Object|Array|Function} obj
       * @param {(string|Object)=} key
       * @param {*=} val
       */    
      function data(obj, key, val) {
          var id = getId(obj), hasVal = arguments.length > 2;
          if (!id || (hasVal && key == null)) throw new TypeError('@data'); 
          dataMap[id] = dataMap[id] || {};
          if (key == null) return key === null ? void 0 : dataMap[id]; // GET invalid OR all
          if (hasVal) return dataMap[id][key] = val; // SET (single)
          if (typeof key != 'object') return dataMap[id][key]; // GET (single)
          return aug(dataMap[id], key); // SET (multi)
      }

      /**
       * Remove data associated with an object that was added via data()
       * Remove data by key, or if no key is provided, remove all.
       * @param {*=} ob
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
       * @param {Object|*} node
       * @param {(string|null)=} type
       * @param {Function=} fn
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
       * Delete **all** the elo data associated with the specified item(s)
       * @param {Object|Node|Function} item or collection of items to purge
       */
      function cleanData(item) {
          var deleted, l, i = 0;
          if (!item) return;
          removeData(item);
          if (typeof item == 'object') {
              cleanEvents(item);
              if (item.nodeType) item.removeAttribute && item.removeAttribute(uidAttr);
              else for (l = item.length; i < l;) cleanData(item[i++]); // Deep.
          } else if (typeof item != 'function') { return; }
          if (uidProp in item) {
              try {
                  deleted = delete item[uidProp];
              } catch(e) {}
              if (!deleted) item[uidProp] = void 0;
          }
      }

      /**
       * Test if the specified node supports the specified event type.
       * This function uses the same signature as Modernizr.hasEvent, 
       * @link http://bit.ly/event-detection
       * @link http://github.com/Modernizr/Modernizr/pull/636
       * @param {string|*} eventName an event name, e.g. 'blur'
       * @param {(Object|string|*)=} node a node, window, or tagName (defaults to div)
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
       * @param {Object|*} list events map (event names as keys and handlers as values)
       * @param {Function} fn method (on|off|one) to call on each pair
       * @param {(Node|Object|*)=} node or object to attach the events to
       */
      function eachEvent(list, fn, node) {
          for (var name in list) fn(node, name, list[name]);
      }
    
      /**
       * Get a new function that calls the specified `fn` with the specified `scope`.
       * We use this to normalize the scope passed to event handlers in non-standard browsers.
       * In modern browsers the value of `this` in the listener is the node.
       * In old IE, it's the window. We normalize it here to be the `node`.
       * @param {Function} fn function to normalize
       * @param {*=} scope thisArg (defaults to `window`)
       * @return {Function}
       */
      function normalizeScope(fn, scope) {
          function normalized() {
              return fn.apply(scope, arguments); 
          }
          // Technically we should give `normalized` its own uid (maybe negative or
          // underscored). But, for our internal usage, cloning the original is fine, 
          // and it simplifies removing event handlers via off() (see cleanEvents()).
          if (fn[uidProp]) normalized[uidProp] = fn[uidProp]; 
          return normalized;
      }

      /**
       * on() Attach an event handler function for one or more event types to the specified node.
       * @param {Node|Object} node object to add events to
       * @param {string|Object} types space-separated event names, or an events map
       * @param {Function=} fn handler to add
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
       * off() Remove an event handlers added via on() from the specified node. If `fn` is
       * not specified, then remove all the handlers for the specified types. If `types`
       * is not specfied, then remove *all* the handlers from the specified node.
       * @param {Node|Object} node object to remove events from
       * @param {string|Object} types space-separated event names, or an events map
       * @param {Function=} fn handler to remove
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
       * one() Add an event handler that only runs once and is then removed.
       * @param {Node|Object} node object to add events to
       * @param {string|Object} types space-separated event names, or an events map
       * @param {Function=} fn handler to add
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
       * @param {Node|Object} node object to remove events from
       * @param {string} type is an event name to trigger
       * @param {(Array|*)=} extras extra parameters to pass to the handler
       * Handlers receive (eventData, extras[0], extras[1], ...)
       */
      function trigger(node, type, extras) {
          if (!type || !node || 3 === node.nodeType || 8 === node.nodeType) return;
          if (typeof node != 'object') throw new TypeError('@trigger');
          var eventData = {}, id = getId(node);
          if (!id || !eventMap[id]) return;
          // Emulate the native and jQuery arg signature for event listeners,
          // supplying an object as first arg, but only supply a few props.
          // The `node` becomes the `this` value inside the handler.
          eventData['type'] = type.split('.')[0]; // w/o namespace
          eventData['isTrigger'] = true;
          applyAll(eventMap[id]['on' + type], node, null == extras ? [eventData] : [eventData].concat(extras));
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
       * @param {Function} fn callback receives (value, key, ob)
       * @param {*=} scope thisArg (defaults to current item)
       * @param {*=} breaker defaults to `false`
       */
      api['fn']['each'] = function(fn, scope, breaker) {
          return each(this, fn, scope, breaker); 
      };

      // In elo 1.4+ the cleanData method is only directly avail on the top-level.
      // api['fn']['cleanData'] = function (inclInstance) {
      //    return true === inclInstance ? cleanData(this) : each(this, cleanData);
      // };

      /**
       * @this {{length:number}} stack of functions to fire
       * @param {*=} scope
       * @param {(Array|Arguments)=} args
       * @param {*=} breaker
       * @return {boolean}
       */
      api['fn']['applyAll'] = function(scope, args, breaker) {
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
       * @param {string} type event name
       * @return {Function}
       */
      function shorthand(type) {
          return function() {
              var use = [type], method = 1 < push.apply(use, arguments) ? 'on' : 'trigger';
              return this[method].apply(this, use);
          };
      }

      /**
       * Add event shorthands to the chain or a specified object.
       * @param {Array|string} list of shortcut names
       * @param {*=} dest destination defaults to `this`
       * @link http://developer.mozilla.org/en/DOM_Events
       * @example $.dubEvent('resize scroll focus')
       */
      function dubEvent(list, dest) {
          dest = dest === Object(dest) ? dest : this === win ? {} : this;
          return eachSSV(list, function(n) {
              dest[n] = shorthand(n);
          }), dest;
      }
      api['fn']['dubEvent'] = dubEvent;

      /**
       * Integrate applicable methods|objects into a host.
       * @link http://github.com/ryanve/submix
       * @this {Object|Function} supplier
       * @param {Object|Function} r receiver
       * @param {boolean=} force whether to overwrite existing props (default: false)
       * @param {(Object|Function|null)=} $ the top-level of the host api (default: `r`)
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
       * @param {Object|Function} api
       * @param {Object|Function} root
       * @param {string} name
       * @param {string=} alias
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