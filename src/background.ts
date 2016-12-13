"use strict";

var api = 'browser' in this ? browser : chrome;

api.storage.local.getBytesInUse(null, (bytes: number) => {
    if (bytes == 0) {
        api.storage.local.set(new Settings().get());
    }
});