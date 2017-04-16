/* -*- Mode: Java; tab-width: 2; indent-tabs-mode:nil; c-basic-offset: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function configureMathJaxMenu(aOptions) {
  let menuConfig = "renderer:NativeMML"; // Force the native MathML output.
  menuConfig += "&;semantics:true";      // Preserve semantics annotations.
  if (aOptions.useBrowserContext) {
    menuConfig += "&;context:Browser";   // Force the browser context menu.
  }
  if (aOptions.disableMathJaxZoom) {
    menuConfig += "&;zoom:None";         // Disable MathJax's zoom.
  }

  // Create a mjx.menu cookie for this document to modify the menu option.
  document.cookie = "mjx.menu=" + escape(menuConfig) + "; path=/";

  // Delete the cookie once the page is loaded. We do not want to keep a cookie
  // for each domain visited and most pages using MathJax will already have
  // read it during MathJax's startup sequence.
  window.addEventListener("load", function() {
    document.cookie =
      "mjx.menu=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  });
}

// Configure MathJax Menu at startup.
let port = browser.runtime.connect();
port.onMessage.addListener((aOptions) => {
  port.disconnect();
  configureMathJaxMenu(aOptions);
});
port.postMessage(document.location.href);
