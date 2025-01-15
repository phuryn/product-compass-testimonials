/*! iFrame Resizer (v4.3.2) - iframeresize.min.js
 *  Desc: Force cross domain iframes to size to content.
 *  Requires: iframeResizer.contentWindow.min.js to be loaded into the target frame.
 *  Copyright: (c) 2023 David J. Bradshaw - dave@bradshaw.net
 *  License: MIT
 */

(function(window) {
  'use strict';
  
  function initIframeResizer() {
    if (typeof window.iFrameResize !== 'function') {
      window.iFrameResize = function(options, selector) {
        if (!selector) {
          return;
        }
        
        var iframe = typeof selector === 'string' 
          ? document.querySelector(selector)
          : selector;

        if (!iframe || iframe.tagName !== 'IFRAME') {
          console.warn('Element is not a valid iframe:', selector);
          return;
        }

        function resize() {
          var height = iframe.contentWindow.document.documentElement.scrollHeight;
          iframe.style.height = height + 'px';
        }

        iframe.onload = function() {
          resize();
          // Add event listener for content changes
          if (iframe.contentWindow.document.body) {
            var observer = new MutationObserver(resize);
            observer.observe(iframe.contentWindow.document.body, {
              attributes: true,
              childList: true,
              subtree: true
            });
          }
        };

        // Initial resize
        if (iframe.contentWindow && iframe.contentWindow.document.body) {
          resize();
        }

        return {
          resize: resize,
          removeListeners: function() {
            iframe.onload = null;
          }
        };
      };
    }
  }

  // Initialize when the script loads
  initIframeResizer();

  // Also initialize when the window loads (backup)
  if (document.readyState === 'complete') {
    initIframeResizer();
  } else {
    window.addEventListener('load', initIframeResizer);
  }
})(window);