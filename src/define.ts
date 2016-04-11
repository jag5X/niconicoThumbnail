"use strict";

declare const chrome;

class Thumbnail {
    static watch = "watch";
    static mylist = "mylist";
    static user = "user";
    static community = "community";
    static seiga = "seiga";
    static live = "live";
    static solid = "solid";
    static removeClick = "removeClick";
}

class Settings {
    public isShow = new Map<string, boolean>();
    public removeClick: boolean;

    constructor() {
        this.isShow[Thumbnail.watch] = true;
        this.isShow[Thumbnail.mylist] = true;
        this.isShow[Thumbnail.user] = true;
        this.isShow[Thumbnail.community] = true;
        this.isShow[Thumbnail.seiga] = true;
        this.isShow[Thumbnail.live] = true;
        this.isShow[Thumbnail.solid] = true;
        this.removeClick = false;
    }

    public set(data: Map<string, boolean>): void {
        this.isShow[Thumbnail.watch] = data[Thumbnail.watch];
        this.isShow[Thumbnail.mylist] = data[Thumbnail.mylist];
        this.isShow[Thumbnail.user] = data[Thumbnail.user];
        this.isShow[Thumbnail.community] = data[Thumbnail.community];
        this.isShow[Thumbnail.seiga] = data[Thumbnail.seiga];
        this.isShow[Thumbnail.live] = data[Thumbnail.live];
        this.isShow[Thumbnail.solid] = data[Thumbnail.solid];
        this.removeClick = data[Thumbnail.removeClick];
    }

    public getMap(): Map<string, boolean> {
        let m = this.isShow;
        m[Thumbnail.removeClick] = this.removeClick;
        return m;
    }
}