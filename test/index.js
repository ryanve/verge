(function(root, window, document) {
  var a, b, c
    , $ = root.$
    , verge = root.verge
    , _ = require('blood')
    , aok = require('aok')
    , log = aok.log
    , id = aok.id
    , readyTests = {}
    , resizeTests = {}
    , scrollTests = {}
    , dynamicTests = {}
    , dims = ['top', 'bottom', 'left', 'right', 'width', 'height']
    , slice = dims.slice
    , push = dims.push;
    
  _.assign($, verge);
  log(verge);

  function bind(fn, scope) {
    var partial = slice.call(arguments, 2);
    return function() {
      var args = partial.slice(0);
      push.apply(args, arguments);
      return fn.apply(scope, args);
    };
  }

  function update(tests) {
    for (var n in tests) $(id(n) || []).text(aok.explain(aok.result(tests[n])) || '');
    return tests;
  }

  readyTests['ua'] = navigator.userAgent || '';  
  resizeTests['viewport-w'] = $.viewportW;
  resizeTests['viewport-h'] = $.viewportH;
  scrollTests['scroll-x'] = $.scrollX;
  scrollTests['scroll-y'] = $.scrollY;

  $(document).ready(function() {
    if (_.some([a = id('a'), b = id('b'), c = id('c')], aok.fail))
      throw Error('Required DOM elements did not exist.');
    log($.rectangle(a));
    _.some(dims, function(key) {
      var bound = this;
      dynamicTests['rectangle-' + key] = function() {
        return bound.call()[key];
      };
    }, bind($.rectangle, $, a));
    dynamicTests['in-viewport-a'] = bind($.inViewport, $, a);
    dynamicTests['in-viewport-a-pos'] = bind($.inViewport, $, a, 100);
    dynamicTests['in-viewport-a-neg'] = bind($.inViewport, $, a, -100);
    dynamicTests['in-viewport-b'] = bind($.inViewport, $, b);
    dynamicTests['in-viewport-b-pos'] = bind($.inViewport, $, b, 100);
    dynamicTests['in-viewport-b-neg'] = bind($.inViewport, $, b, -100);  
    _.assign(resizeTests, dynamicTests);
    _.assign(scrollTests, dynamicTests);
    _.every([readyTests, resizeTests, scrollTests], update);
    $(window).on('resize', bind(update, null, resizeTests)).on('scroll', bind(update, null, scrollTests));
  });
}(this, window, document));