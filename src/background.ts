"use strict";

function getFlag(name: string): boolean {
    return localStorage[name] == "true";
}

if (localStorage.length == 0) {
    localStorage[Thumbnail.watch] = true;
    localStorage[Thumbnail.mylist] = true;
    localStorage[Thumbnail.user] = true;
    localStorage[Thumbnail.community] = true;
    localStorage[Thumbnail.seiga] = true;
    localStorage[Thumbnail.live] = true;
    localStorage[Thumbnail.solid] = true;
    localStorage["removeClick"] = false;
}

chrome.extension.onMessage.addListener(
    (request: string, sender: any, responseFunction: (response: Options) => void) => {
        // メッセージを受け取ったらオプションの情報を返す
        if (request == "getOptions") {
            var info = new Options();
            info.isShow[Thumbnail.watch] = getFlag(Thumbnail.watch);
            info.isShow[Thumbnail.mylist] = getFlag(Thumbnail.mylist);
            info.isShow[Thumbnail.user] = getFlag(Thumbnail.user);
            info.isShow[Thumbnail.community] = getFlag(Thumbnail.community);
            info.isShow[Thumbnail.seiga] = getFlag(Thumbnail.seiga);
            info.isShow[Thumbnail.live] = getFlag(Thumbnail.live);
            info.isShow[Thumbnail.solid] = getFlag(Thumbnail.solid);
            info.removeClick = getFlag("removeClick");
            responseFunction(info);
        }
    }
);
