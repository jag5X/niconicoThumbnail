/// <reference path="jquery.d.ts"/>
/// <reference path="define.ts"/>

class ThumbnailManager {
    thumbnailUrl: { [key: string]: string; };
    thumbnail: HTMLIFrameElement;
    thumbnailBase: HTMLIFrameElement;
    options: Options;
    isShowed: boolean;

    constructor() {
        // URLの文字列定義
        this.thumbnailUrl = {};
        this.thumbnailUrl[Thumbnail.watch] = 'http://ext.nicovideo.jp/thumb/';
        this.thumbnailUrl[Thumbnail.mylist] = 'http://ext.nicovideo.jp/thumb_';
        this.thumbnailUrl[Thumbnail.user] = 'http://ext.nicovideo.jp/thumb_';
        this.thumbnailUrl[Thumbnail.community] = 'http://ext.nicovideo.jp/thumb_community/';
        this.thumbnailUrl[Thumbnail.seiga] = 'http://ext.seiga.nicovideo.jp/thumb/';
        this.thumbnailUrl[Thumbnail.live] = 'http://live.nicovideo.jp/embed/';
        this.thumbnailUrl[Thumbnail.solid] = 'http://3d.nicovideo.jp/externals/widget?id=';

        this.thumbnailBase = <HTMLIFrameElement>$(document.createElement("iframe")).context;
        this.thumbnailBase.width = "312";
        this.thumbnailBase.height = "176";
        this.thumbnailBase.scrolling = "no";
        this.thumbnailBase.frameBorder = "0";

        this.isShowed = false;
    }

    public initialize(): void {
        chrome.extension.sendMessage("getOptions", (info: Options) => {
            this.options = info;
        });

        // マウスオーバー時サムネイル作成
        $(document).on("mouseover", "a", (e: JQueryEventObject) => {
            this.createThumbnail(<HTMLAnchorElement>e.target, e.pageX + 5, e.pageY + 5);
        });

        // マウスアウト時サムネイル消去（設定による）
        $(document).on("mouseout", "a", () => {
            if (!this.options.removeClick) {
                this.removeThumbnail();
            }
        });

        // マウスダウン時サムネイル消去（設定による）
        $(document).mousedown(() => {
            if (this.options.removeClick) {
                this.removeThumbnail();
            }
        });
    }

    // サムネイル消去
    private removeThumbnail(): void {
        if (this.isShowed) {
            this.thumbnail.style.display = "none";
            this.isShowed = false;
        }
    }

    // サムネイルの作成
    private createThumbnail(link: HTMLAnchorElement, x: number, y: number): void {

        // リンクの文字列からURLを作成
        var kind: string;
        var id: string = link.innerText;
        var matchResult: string[];
        if (id == null) return;
        if (this.options.isShow[Thumbnail.watch] && (matchResult = id.match(/([sn]m[0-9]+)/))) {
            kind = Thumbnail.watch;
            id = matchResult[1];
        }
        else if (this.options.isShow[Thumbnail.watch] && (matchResult = id.match(/^watch\/([0-9]+)$/))) {
            kind = Thumbnail.watch;
            id = matchResult[1];
        }
        else if (this.options.isShow[Thumbnail.mylist] && id.match(/^mylist\/[0-9]+$/)) {
            kind = Thumbnail.mylist;
        }
        else if (this.options.isShow[Thumbnail.user] && id.match(/^user\/[0-9]+$/)) {
            kind = Thumbnail.user;
        }
        else if (this.options.isShow[Thumbnail.community] && id.match(/^co[0-9]+$/)) {
            kind = Thumbnail.community;
        }
        else if (this.options.isShow[Thumbnail.seiga] && id.match(/^im[0-9]+$/)) {
            kind = Thumbnail.seiga;
        }
        else if (this.options.isShow[Thumbnail.live] && id.match(/^lv[0-9]+$/)) {
            kind = Thumbnail.live;
        }
        else if (this.options.isShow[Thumbnail.solid] && id.match(/^td[0-9]+$/)) {
            kind = Thumbnail.solid;
        }
        else {
            return;
        }

        this.removeThumbnail();

        // サムネイルのスタイル設定
        this.thumbnail = <HTMLIFrameElement>this.thumbnailBase.cloneNode();
        this.thumbnail.src = this.thumbnailUrl[kind] + id;
        this.thumbnail.style = this.createStyle(this.thumbnail.style, x, y);
        document.body.appendChild(this.thumbnail);

        this.isShowed = true;
    }

    createStyle(style: MSStyleCSSProperties, x: number, y: number): MSStyleCSSProperties {
        style.position = "absolute";
        style.zIndex = "2147483647";
        style.left = x + "px";
        style.top = y + "px";
        return style;
    }
}

$(() => {
    var manager = new ThumbnailManager();
    manager.initialize();
});