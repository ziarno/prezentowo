/**
 * Extend jquery with a scrollspy plugin.
 * This watches the window scroll and fires events when elements are scrolled into viewport.
 *
 * throttle() and getTime() taken from Underscore.js
 * https://github.com/jashkenas/underscore
 *
 * @author Copyright 2013 John Smart
 * @license https://raw.github.com/thesmart/jquery-scrollspy/master/LICENSE
 * @see https://github.com/thesmart
 * @version 0.1.2
 */
(function($) {

  var jWindow = $(window);
  var elements = [];
  var elementsInView = [];
  var isSpying = false;
  var ticks = 0;
  var offset = {
    top : 0,
    right : 0,
    bottom : 0,
    left : 0
  }

  /**
   * Find elements that are within the boundary
   * @param {number} top
   * @param {number} right
   * @param {number} bottom
   * @param {number} left
   * @return {jQuery}		A collection of elements
   */
  function findElements(top, right, bottom, left) {
    var hits = $();
    $.each(elements, function(i, element) {
      var elTop = element.offset().top,
        elLeft = element.offset().left,
        elRight = elLeft + element.width(),
        elBottom = elTop + element.height();

      var isIntersect = !(elLeft > right ||
      elRight < left ||
      elTop > bottom ||
      elBottom < top);

      if (isIntersect) {
        hits.push(element);
      }
    });

    return hits;
  }

  /**
   * Called when the user scrolls the window
   */
  function onScroll() {
    // unique tick id
    ++ticks;

    // viewport rectangle
    var top = jWindow.scrollTop(),
      left = jWindow.scrollLeft(),
      right = left + jWindow.width(),
      bottom = top + jWindow.height();

    // determine which elements are in view
    var intersections = findElements(top+offset.top, right+offset.right, bottom+offset.bottom, left+offset.left);
    $.each(intersections, function(i, element) {
      var lastTick = element.data('scrollSpy:ticks');
      if (typeof lastTick != 'number') {
        // entered into view
        element.triggerHandler('scrollSpy:enter', intersections);
      }

      // update tick id
      element.data('scrollSpy:ticks', ticks);
    });

    // determine which elements are no longer in view
    $.each(elementsInView, function(i, element) {
      var lastTick = element.data('scrollSpy:ticks');
      if (typeof lastTick == 'number' && lastTick !== ticks) {
        // exited from view
        element.triggerHandler('scrollSpy:exit', intersections);
        element.data('scrollSpy:ticks', null);
      }
    });

    // remember elements in view for next tick
    elementsInView = intersections;
  }

  /**
   * Called when window is resized
   */
  function onWinSize() {
    jWindow.trigger('scrollSpy:winSize');
  }

  /**
   * Get time in ms
   * @license https://raw.github.com/jashkenas/underscore/master/LICENSE
   * @type {function}
   * @return {number}
   */
  var getTime = (Date.now || function () {
    return new Date().getTime();
  });

  /**
   * Enables ScrollSpy using a selector
   * @param {jQuery|string} selector  The elements collection, or a selector
   * @param {Object=} options	Optional.
   throttle : number -> scrollspy throttling. Default: 100 ms
   offsetTop : number -> offset from top. Default: 0
   offsetRight : number -> offset from right. Default: 0
   offsetBottom : number -> offset from bottom. Default: 0
   offsetLeft : number -> offset from left. Default: 0
   * @returns {jQuery}
   */
  $.scrollSpy = function(selector, options) {
    var scrollFunc
    selector = $(selector);
    selector.each(function(i, element) {
      elements.push($(element));
    });
    options = _.defaults(options, {
      throttle: 100,
      offsetTop: 0,
      offsetRight: 0,
      offsetBottom: 0,
      offsetLeft: 0
    })

    offset.top = options.offsetTop
    offset.right = options.offsetRight
    offset.bottom = options.offsetBottom
    offset.left = options.offsetLeft


    if (options.debounce) {
      scrollFunc = _.debounce(onScroll, options.debounce);
    } else {
      scrollFunc = _.throttle(onScroll, options.throttle);
    }

    var readyScroll = $(document).ready.bind($, scrollFunc)

    if (!isSpying) {
      jWindow.on('scroll', readyScroll);
      jWindow.on('resize', readyScroll);
      isSpying = true;
    }

    // perform a scan once, after current execution context, and after dom is ready
    setTimeout(readyScroll, 0);

    return selector;
  };

  /**
   * Listen for window resize events
   * @param {Object=} options						Optional. Set { throttle: number } to change throttling. Default: 100 ms
   * @returns {jQuery}		$(window)
   */
  $.winSizeSpy = function(options) {
    $.winSizeSpy = function() { return jWindow; }; // lock from multiple calls
    options = options || {
        throttle: 100
      };
    return jWindow.on('resize', _.throttle(onWinSize, options.throttle || 100));
  };

  /**
   * Enables ScrollSpy on a collection of elements
   * e.g. $('.scrollSpy').scrollSpy()
   * @param {Object=} options	Optional.
   throttle : number -> scrollspy throttling. Default: 100 ms
   offsetTop : number -> offset from top. Default: 0
   offsetRight : number -> offset from right. Default: 0
   offsetBottom : number -> offset from bottom. Default: 0
   offsetLeft : number -> offset from left. Default: 0
   * @returns {jQuery}
   */
  $.fn.scrollSpy = function(options) {
    return $.scrollSpy($(this), options);
  };

})(jQuery);