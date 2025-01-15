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

        // Set initial height
        iframe.style.width = '1px';
        iframe.style.minWidth = '100%';
        iframe.style.border = 'none';
        iframe.style.height = '500px'; // Set a default height
        
        // Listen for resize messages from the iframe
        window.addEventListener('message', function(e) {
          // Verify the message origin matches the iframe's src
          if (iframe.src.indexOf(e.origin) !== 0) {
            return;
          }

          // Handle height updates
          if (e.data && typeof e.data === 'object' && e.data.type === 'resize') {
            var height = parseInt(e.data.height);
            if (!isNaN(height) && height > 0) {
              iframe.style.height = height + 'px';
            }
          }
        });

        return {
          resize: function() {
            // Trigger a resize if needed
            if (iframe.contentWindow) {
              iframe.contentWindow.postMessage({ type: 'requestResize' }, '*');
            }
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