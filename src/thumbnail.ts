"use strict";

var api = 'browser' in this ? browser : chrome;

class ThumbnailManager {
    private thumbnailUrl: Map<ThumbnailKind, string>;
    private regExps: Map<ThumbnailKind, RegExp>;
    private locationPath: Map<LocationKind, string>;
    private thumbnail: HTMLIFrameElement;
    private settings: Settings;
    private isShowed: boolean;
    private isCancel: boolean;

    private watchHostName = "www.nicovideo.jp";
    private videoLinkPattern: RegExp = /^\/watch\/((?:sm|nm|so)?[0-9]+)/;
    
    constructor() {
        // URLの文字列定義
        this.thumbnailUrl = new Map<ThumbnailKind, string>();
        this.thumbnailUrl[ThumbnailKind.Watch] = 'http://ext.nicovideo.jp/thumb/';
        this.thumbnailUrl[ThumbnailKind.Mylist] = 'http://ext.nicovideo.jp/thumb_';
        this.thumbnailUrl[ThumbnailKind.User] = 'http://ext.nicovideo.jp/thumb_';
        this.thumbnailUrl[ThumbnailKind.Community] = 'http://ext.nicovideo.jp/thumb_community/';
        this.thumbnailUrl[ThumbnailKind.Seiga] = 'http://ext.seiga.nicovideo.jp/thumb/';
        this.thumbnailUrl[ThumbnailKind.Live] = 'http://live.nicovideo.jp/embed/';
        this.thumbnailUrl[ThumbnailKind.Solid] = 'http://3d.nicovideo.jp/externals/widget?id=';

        // 各リンク先種類の正規表現定義
        this.regExps = new Map<ThumbnailKind, RegExp>();
        this.regExps[ThumbnailKind.Watch] = /((?:sm|nm|so)[0-9]+)|watch\/([0-9]+)/;
        this.regExps[ThumbnailKind.Mylist] = /(mylist\/[0-9]+)/;
        this.regExps[ThumbnailKind.User] = /(user\/[0-9]+)/;
        this.regExps[ThumbnailKind.Community] = /(co[0-9]+)/;
        this.regExps[ThumbnailKind.Seiga] = /(im[0-9]+)/;
        this.regExps[ThumbnailKind.Live] = /(lv[0-9]+)/;
        this.regExps[ThumbnailKind.Solid] = /(td[0-9]+)/;

        // ページの種類を識別するパス
        this.locationPath = new Map<LocationKind, string>();
        this.locationPath[LocationKind.Ranking] = "/" + LocationSettings.ranking;
        this.locationPath[LocationKind.Search] = "/" + LocationSettings.search;
        this.locationPath[LocationKind.Tag] = "/" + LocationSettings.tag;
        this.locationPath[LocationKind.VideoExplorer] = "/" + LocationSettings.videoExplorer;
        
        this.isShowed = false;

        // 設定読込
        this.settings = new Settings();
        api.storage.local.get(null, (data: Map<string, boolean>) => {
            this.settings.set(data);
        });
        
        // マウスオーバー時サムネイル作成
        $(document).on("mouseover", "a", (e: JQueryEventObject) => {
            this.isCancel = true;
            this.createThumbnail((<HTMLAnchorElement>e.currentTarget), e.pageX + 5, e.pageY + 5);
        });

        // マウスアウト時サムネイル消去（設定による）
        $(document).on("mouseout", "a", () => {
            this.isCancel = true;
            if (!this.settings.isKeepUntilClick()) {
                this.removeThumbnail();
            }
        });

        // マウスダウン時サムネイル消去
        $(document).mousedown((e: JQueryMouseEventObject) => {
            this.isCancel = true;
            this.removeThumbnail();
        });
    }

    // サムネイル消去
    private removeThumbnail(): void {
        if (this.isShowed) {
            document.body.removeChild(this.thumbnail);
            this.isShowed = false;
        }
    }

    private createUrl(id: string): string {
        if (!id) {
            return null;
        }
        for (let i = 0; i < ThumbnailKind.Count; i++) {
            if (!this.settings.isShow(i)) {
                continue;
            }
            let result = id.match(this.regExps[i]);
            if (!result) {
                continue;
            }
            for (let j = 1; j < result.length; j++) {
                if (result[j]) {
                    if (result[j].startsWith("so")) {
                        return result[j];
                    }
                    return this.thumbnailUrl[i] + result[j];
                }
            }
        }
        return null;
    }

    private createUserThumbnail(anchor: HTMLAnchorElement, x: number, y: number): void {
        if (location.hostname != this.watchHostName) {
            return;
        }
        for (let i = 0; i < LocationKind.Count; i++) {
            if (!this.settings.isShowUserForVieoLink(i)) {
                continue;
            }
            switch (i) {
                case LocationKind.VideoExplorer:
                    if (!location.pathname.endsWith(this.locationPath[i])) {
                        continue;
                    }
                    break;
                default:
                    if (!location.pathname.startsWith(this.locationPath[i])) {
                        continue;
                    }
                    break;
            }
            let path = anchor.pathname;
            if (!path) {
                break;
            }
            let result = anchor.pathname.match(this.videoLinkPattern);
            if (!result) {
                break;
            }
            let id: string = result[1];
            $.ajax({
                url: "http://ext.nicovideo.jp/api/getthumbinfo/" + id,
                type: 'GET',
                dataType: 'xml',
                timeout: 1000,
                success: (xml: XMLDocument) => {
                    if (this.isCancel) {
                        return;
                    }
                    let user = $(xml).find("user_id");
                    if (user.length > 0) {
                        let userId = user.first().text();
                        if (!userId) {
                            return;
                        }
                        this.createThumbnailDirect(this.thumbnailUrl[ThumbnailKind.User] + "user/" + userId, x, y);
                        return;
                    }
                    let ch = $(xml).find("ch_id");
                    if (ch.length > 0) {
                        let chId = ch.first().text();
                        if (!chId) {
                            return;
                        }
                        this.createThumbnailDirect("http://ch.nicovideo.jp/ch" + chId + "/thumb_channel", x, y);
                    }
                }
            });
        }
    }

    // サムネイルの作成
    private createThumbnail(anchor: HTMLAnchorElement, x: number, y: number): void {
        if (!anchor) return;
        console.log("mouse over to : " + anchor.innerText);
        this.isCancel = false;
        if (anchor.classList.contains("itemContent")) {
            // ランキング画面の動画リンクではユーザーサムネイル処理だけ行う
            this.createUserThumbnail(anchor, x, y);
            return;
        }

        let url = this.createUrl(anchor.innerText);
        if (url) {
            if (url.startsWith("s")) {
                let xhrObj: XMLHttpRequest;
                $.ajax("http://www.nicovideo.jp/watch/" + url,
                {
                    type: "GET",
                    dataType: "html",
                    xhr: () => xhrObj = new XMLHttpRequest(),
                    complete: _ => {
                        if (this.isCancel) {
                            return;
                        }
                        this.createThumbnailDirect(this.createUrl(xhrObj.responseURL), x, y);
                    }
                });
            }
            else {
                this.createThumbnailDirect(url, x, y);
            }
        }
        else {
            this.createUserThumbnail(anchor, x, y);
        }
    }
    private createThumbnailDirect(url: string, x: number, y: number): void {
        this.removeThumbnail();
        console.log("created thumbnail url : " + url);

        // サムネイルのスタイル設定
        this.thumbnail = <HTMLIFrameElement>$(document.createElement("iframe")).context;
        $(this.thumbnail).attr({
            src: url,
            scrolling: 'no',
            frameborder: 0,
        });
        $(this.thumbnail).css({
            width: 350,
            height: 200,
            left: x,
            top: y,
            position: 'absolute',
            zIndex: 2147483647,
        });
        document.body.appendChild(this.thumbnail);
        this.isShowed = true;
    }
}

$(() => {
    const manager = new ThumbnailManager();
});