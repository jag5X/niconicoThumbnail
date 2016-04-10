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
}