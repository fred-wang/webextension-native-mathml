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

function el(aId) {
  return document.getElementById(aId);
}

function saveOptions(aEvent) {
  browser.storage.local.set({
    useBrowserContext: el("useBrowserContext").checked,
    disableMathJaxZoom: el("disableMathJaxZoom").checked,
    disableMathJaxMML2jax: el("disableMathJaxMML2jax").checked,
    fixMathJaxNativeMML: el("fixMathJaxNativeMML").checked,
    exclusionList: el("exclusionList").value
  });
  aEvent.preventDefault();
}

function loadOptions() {
  browser.storage.local.get().then((aOptions) => {
    var options = gDefaultOptions;
    for (var option in aOptions) {
      options[option] = aOptions[option];
    }
    el("useBrowserContext").checked = options.useBrowserContext;
    el("disableMathJaxZoom").checked = options.disableMathJaxZoom;
    el("disableMathJaxMML2jax").checked = options.disableMathJaxMML2jax;
    el("fixMathJaxNativeMML").checked = options.fixMathJaxNativeMML;
    el("exclusionList").value = options.exclusionList;
  });
}

function localizeUI() {
  let elements = document.getElementsByClassName("localizedString");
  for (var i = 0; i < elements.length; i++) {
    elements[i].innerText = browser.i18n.getMessage(elements[i].innerText);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  localizeUI();
  loadOptions();
  el("options").addEventListener("submit", saveOptions);
});
