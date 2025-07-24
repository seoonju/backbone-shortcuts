;(function(){
  // ... other code ...

  process.nextTick = (function(){
    // postMessage behaves badly on IE8
    if (window.ActiveXObject || !window.postMessage) {
      return function(fn){ fn() };
    }

    // based on setZeroTimeout by David Baron
    // - http://dbaron.org/log/20100309-faster-timeouts
    var timeouts = []
      , name = 'mocha-zero-timeout'

    return function(fn){
      timeouts.push(fn);
      window.postMessage(name, window.location.origin); // Use window.location.origin as targetOrigin
      window.addEventListener('message', function(e){
        if (e.source == window && e.data == name && e.origin === window.location.origin) { // Validate the origin
          if (e.stopPropagation) e.stopPropagation();
          if (timeouts.length) timeouts.shift()();
        }
      }, true);
    }
  })();

  // ... other code ...
})();