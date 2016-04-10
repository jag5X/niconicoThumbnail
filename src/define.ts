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
}

class Options {
    isShow: { [key: string]: boolean; };
    removeClick: boolean;

    constructor() {
        this.isShow = {};
    }
}