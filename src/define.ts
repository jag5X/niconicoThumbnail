"use strict";

declare const chrome;
declare const browser;

enum ThumbnailKind {
    Watch,
    Mylist,
    User,
    Community,
    Seiga,
    Live,
    Solid,

    Count
}

class SettingsId {
    static watch = "watch";
    static mylist = "mylist";
    static user = "user";
    static community = "community";
    static seiga = "seiga";
    static live = "live";
    static solid = "solid";
    static removeClick = "removeClick";

    static getId(kind: ThumbnailKind): string {
        switch (kind) {
            case ThumbnailKind.Watch:
                return SettingsId.watch;
            case ThumbnailKind.Mylist:
                return SettingsId.mylist;
            case ThumbnailKind.User:
                return SettingsId.user;
            case ThumbnailKind.Community:
                return SettingsId.community;
            case ThumbnailKind.Seiga:
                return SettingsId.seiga;
            case ThumbnailKind.Live:
                return SettingsId.live;
            case ThumbnailKind.Solid:
                return SettingsId.solid;
            default:
                return null;
        }
    }
}

class Settings {
    private applying = new Map<string, boolean>();

    constructor() {
        for (let i = 0; i < ThumbnailKind.Count; i++) {
            this.applying[SettingsId.getId(i)] = true;
        }
        this.applying[SettingsId.removeClick] = false;
    }

    public set(data: Map<string, boolean>): void {
        for (let s in data) {
            this.applying[s] = data[s];
        }
    }

    public get(): Map<string, boolean> {
        return this.applying;
    }

    public isShow(kind: ThumbnailKind): boolean {
        let id = SettingsId.getId(kind);
        if (id == null) {
            return false;
        }
        return this.applying[id];
    }

    public isShowUntilClick(): boolean {
        return this.applying[SettingsId.removeClick];
    }
}