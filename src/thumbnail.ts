"use strict";

var api = 'browser' in this ? browser : chrome;

class ThumbnailManager {
    private thumbnailUrl: Map<ThumbnailKind, string>;
    private regExps: Map<ThumbnailKind, RegExp>;
    private thumbnail: HTMLIFrameElement;
    private settings: Settings;
    private isShowed: boolean;

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
        this.regExps[ThumbnailKind.Watch] = /([sn]m[0-9]+)|watch\/([0-9]+)/;
        this.regExps[ThumbnailKind.Mylist] = /(mylist\/[0-9]+)/;
        this.regExps[ThumbnailKind.User] = /(user\/[0-9]+)/;
        this.regExps[ThumbnailKind.Community] = /(co[0-9]+)/;
        this.regExps[ThumbnailKind.Seiga] = /(im[0-9]+)/;
        this.regExps[ThumbnailKind.Live] = /(lv[0-9]+)/;
        this.regExps[ThumbnailKind.Solid] = /(td[0-9]+)/;
        
        this.isShowed = false;

        // 設定読込
        this.settings = new Settings();
        api.storage.local.get(null, (data: Map<string, boolean>) => {
            this.settings.set(data);
        });
        
        // マウスオーバー時サムネイル作成
        $(document).on("mouseover", "a", (e: JQueryEventObject) => {
            this.createThumbnail((<HTMLAnchorElement>e.target).innerText, e.pageX + 5, e.pageY + 5);
        });

        // マウスアウト時サムネイル消去（設定による）
        $(document).on("mouseout", "a", () => {
            if (!this.settings.isKeepUntilClick()) {
                this.removeThumbnail();
            }
        });

        // マウスダウン時サムネイル消去
        $(document).mousedown((e: JQueryMouseEventObject) => {
            if (this.settings.isKeepUntilClick() ||
                e.target.tagName == "A") {
                this.removeThumbnail();
            }
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
                    return this.thumbnailUrl[i] + result[j];
                }
            }
        }
        return null;
    }

    // サムネイルの作成
    private createThumbnail(id: string, x: number, y: number): void {

        if (!id) return;
        
        let kind: string;
        let matchResult: string[];

        console.log("mouse over to : " + id);

        let url = this.createUrl(id);
        if (!url) return;

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