/* -*- Mode: Java; tab-width: 2; indent-tabs-mode:nil; c-basic-offset: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

browser.runtime.onMessage.addListener(function(aMessage) {
  if (aMessage.name !== "set-menu-cookie")
    return;

  // Create a mjx.menu cookie for this document to modify the menu option.
  document.cookie = "mjx.menu=" + escape(aMessage.menuConfig) + "; path=/";
});

// Delete the cookie once the page is loaded. We do not want to keep a cookie
// for each domain visited and most pages using MathJax will already have
// read it during MathJax's startup sequence.
var listener = function() {
  document.cookie = "mjx.menu=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}
window.addEventListener("load", listener, false);
