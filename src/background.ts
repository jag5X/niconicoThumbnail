/// <reference path="define.ts"/>

class Background {

    public static initialize(): void {

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
                    info.isShow[Thumbnail.watch] = Background.getFlag(Thumbnail.watch);
                    info.isShow[Thumbnail.mylist] = Background.getFlag(Thumbnail.mylist);
                    info.isShow[Thumbnail.user] = Background.getFlag(Thumbnail.user);
                    info.isShow[Thumbnail.community] = Background.getFlag(Thumbnail.community);
                    info.isShow[Thumbnail.seiga] = Background.getFlag(Thumbnail.seiga);
                    info.isShow[Thumbnail.live] = Background.getFlag(Thumbnail.live);
                    info.isShow[Thumbnail.solid] = Background.getFlag(Thumbnail.solid);
                    info.removeClick = Background.getFlag("removeClick");
                    responseFunction(info);
                }
            }
        );
    }

    private static getFlag(name: string): boolean {
        return localStorage[name] == "true";
    }

}

Background.initialize();