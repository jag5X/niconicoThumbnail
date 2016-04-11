"use strict";

chrome.storage.local.getBytesInUse(null, (bytes: number) => {
    if (bytes == 0) {
        chrome.storage.local.set(new Settings().getMap());
    }
});