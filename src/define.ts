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

class ThumbnailSettings {
    static watch = "watch";
    static mylist = "mylist";
    static user = "user";
    static community = "community";
    static seiga = "seiga";
    static live = "live";
    static solid = "solid";

    static getId(kind: ThumbnailKind): string {
        switch (kind) {
            case ThumbnailKind.Watch:
                return ThumbnailSettings.watch;
            case ThumbnailKind.Mylist:
                return ThumbnailSettings.mylist;
            case ThumbnailKind.User:
                return ThumbnailSettings.user;
            case ThumbnailKind.Community:
                return ThumbnailSettings.community;
            case ThumbnailKind.Seiga:
                return ThumbnailSettings.seiga;
            case ThumbnailKind.Live:
                return ThumbnailSettings.live;
            case ThumbnailKind.Solid:
                return ThumbnailSettings.solid;
            default:
                return null;
        }
    }
}

enum LocationKind {
    Ranking,
    Search,
    Tag,
    VideoExplorer,

    Count
}

class LocationSettings {
    static ranking = "ranking";
    static search = "search";
    static tag = "tag";
    static videoExplorer = "videoExplorer";

    static getId(kind: LocationKind): string {
        switch (kind) {
            case LocationKind.Ranking:
                return LocationSettings.ranking;
            case LocationKind.Search:
                return LocationSettings.search;
            case LocationKind.Tag:
                return LocationSettings.tag;
            case LocationKind.VideoExplorer:
                return LocationSettings.videoExplorer;
            default:
                return null;
        }
    }
    static getIdList(): string[] {
        let list: string[]
        for (let i = 0; i < LocationKind.Count; i++) {
            list[i] = LocationSettings.getId(i);
        }
        return list;
    }
}

class OtherSettings {
    static keepUntilClick = "removeClick";
}

class Settings {
    private applying = new Map<string, boolean>();

    private showUserForVieoLinkSettingsKey = "showUserForVideo-";

    constructor() {
        for (let i = 0; i < ThumbnailKind.Count; i++) {
            this.applying[ThumbnailSettings.getId(i)] = true;
        }
        for (let i = 0; i < LocationKind.Count; i++) {
            this.applying[this.showUserForVieoLinkSettingsKey + LocationSettings.getId(i)] = false;
        }
        this.applying[OtherSettings.keepUntilClick] = false;
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
        let id = ThumbnailSettings.getId(kind);
        if (id == null) {
            return false;
        }
        return this.applying[id];
    }

    public isShowUserForVieoLink(location: LocationKind): boolean {
        let id = LocationSettings.getId(location);
        if (id == null) {
            return false;
        }
        return this.applying[this.showUserForVieoLinkSettingsKey + id];
    }

    public isKeepUntilClick(): boolean {
        return this.applying[OtherSettings.keepUntilClick];
    }
}