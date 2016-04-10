"use strict";

chrome.storage.local.getBytesInUse(null, (bytes: number) => {
    if (bytes == 0) {
        let data = {};
        data[Thumbnail.watch] = true;
        data[Thumbnail.mylist] = true;
        data[Thumbnail.user] = true;
        data[Thumbnail.community] = true;
        data[Thumbnail.seiga] = true;
        data[Thumbnail.live] = true;
        data[Thumbnail.solid] = true;
        data[Thumbnail.removeClick] = false;
        chrome.storage.local.set(data);
    }
});