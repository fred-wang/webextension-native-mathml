/* -*- Mode: Java; tab-width: 2; indent-tabs-mode:nil; c-basic-offset: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

let menuConfig = "renderer:NativeMML"; // Force the native MathML output.
menuConfig += "&;semantics:true";      // Preserve semantics annotations.
menuConfig += "&;context:Browser";     // Force the browser context menu.
menuConfig += "&;zoom:None";           // Disable MathJax's zoom.

// Create a mjx.menu cookie for this document to modify the menu option.
document.cookie = `mjx.menu=${escape(menuConfig)}; path=/; SameSite=Strict`;

// Delete the cookie before leaving the page.
window.addEventListener("unload", () => {
  document.cookie = "mjx.menu=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
});
