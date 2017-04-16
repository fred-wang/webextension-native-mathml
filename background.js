/* -*- Mode: Java; tab-width: 2; indent-tabs-mode:nil; c-basic-offset: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

let gDefaultOptions = {
  useBrowserContext: true,
  disableMathJaxZoom: true,
  disableMathJaxMML2jax: true,
  fixMathJaxNativeMML: true,
  exclusionList: "*.nbcnews.com"
};

let gOptions = {};

function tryAndInjectContentScripts(aTab) {
  // TODO: Handle aTab.url, gOptions.exclusionList

  // Modify KaTeX's default CSS to force native MathML to be displayed.
  browser.tabs.insertCSS(aTab.id, {
    allFrames: true,
    file: "/content-scripts/katex.css",
    runAt: "document_start"
  });

  // Modify MediaWiki's default CSS to force native MathML to be displayed.
  browser.tabs.insertCSS(aTab.id, {
    allFrames: true,
    file: "/content-scripts/mediawiki.css",
    runAt: "document_start"
  });

  // Modify MathJax's menu preference.
  browser.tabs.executeScript(aTab.id, {
    allFrames: true,
    file: "/content-scripts/mathjax-menu-cookie.js",
    runAt: "document_start"
  }).then(function() {
    let menuConfig = "renderer:NativeMML"; // Force the native MathML output.
    if (gOptions.useBrowserContext) {
      menuConfig += "&;context:Browser";   // Force the browser context menu.
    }
    if (gOptions.disableMathJaxZoom) {
      menuConfig += "&;zoom:None";         // Disable MathJax's zoom.
    }
    browser.tabs.sendMessage(aTab.id, {
      name: "set-menu-cookie",
      menuConfig: menuConfig
    });
  });

  // Modify MathJax's code to fix performance and rendering issues.
  browser.tabs.executeScript(aTab.id, {
    allFrames: true,
    file: "/content-scripts/mathjax-bug-fixes.js",
    runAt: "document_start"
  }).then(function() {
    browser.tabs.sendMessage(aTab.id, {
      name: "set-bug-fixes",
      disableMathJaxMML2jax: gOptions.disableMathJaxMML2jax,
      fixMathJaxNativeMML: gOptions.fixMathJaxNativeMML
    })
  });
}

function tryAndInjectContentScriptsInAllTabs() {
  browser.tabs.query({}).then((tabs) => {
    for (tab of tabs) {
      tryAndInjectContentScripts(tab);
    }
  });
  browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
    if (changeInfo.status === "loading") {
      tryAndInjectContentScripts(tab);
    }
  });
}

function initializeOptions(aOptions) {
  let saveOptions = false;
  gOptions = aOptions;
  for (var key in gDefaultOptions) {
    if (!gOptions.hasOwnProperty(key)) {
      gOptions[key] = aOptions[key];
      saveOptions = true;
    }
  }
  return saveOptions ? browser.storage.local.set(gOptions) : Promise.resolve();
}

function updateOptions(aChanges, aArea) {
  if (aArea === "local") {
    for (key in aChanges) {
      gOptions[key] = aChanges[key].newValue;
    }
  }
}

browser.storage.local.get().then((aOptions) => {
  initializeOptions(aOptions).then(function() {
    browser.storage.onChanged.addListener(updateOptions);
    tryAndInjectContentScriptsInAllTabs();
  });
});
