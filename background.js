/* -*- Mode: Java; tab-width: 2; indent-tabs-mode:nil; c-basic-offset: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

let gOptions = null, gDefaultOptions = {
  useBrowserContext: true,
  disableMathJaxZoom: true,
  disableMathJaxMML2jax: true,
  fixMathJaxNativeMML: true,
  exclusionList: "*.nbcnews.com"
};

function initializeOptions() {
  // Nothing to do if it's already initialized.
  if (gOptions !== null)
    return Promise.resolve();

  return browser.storage.local.get().then((aOptions) => {
    // Initialize the options using default values for missing keys.
    gOptions = aOptions;
    for (let key in gDefaultOptions) {
      if (!gOptions.hasOwnProperty(key))
        gOptions[key] = gDefaultOptions[key];
    }

    // Register listeners for option changes.
    browser.storage.onChanged.addListener((aChanges, aArea) => {
      if (aArea === "local") {
        for (key in aChanges)
          gOptions[key] = aChanges[key].newValue;
      }
    });
  });
}

// When an addon or content script connects to us, provide the current options.
// FIXME: Consider exclusionList for js scripts?
browser.runtime.onConnect.addListener((aPort) => {
  initializeOptions().then(function() {
    aPort.postMessage(gOptions);
  });
});
