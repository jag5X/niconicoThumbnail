"use strict";

var api = 'browser' in this ? browser : chrome;

$(() => {
    function eachCheckbox(func: (checkbox: HTMLInputElement) => void) {
        $(":checkbox").each((i: number, x: HTMLInputElement) => {
            func(x);
        });
    }

    eachCheckbox((x: HTMLInputElement) => {
        api.storage.local.get(x.id, (s) => {
            x.checked = s[x.id];
        });
    });

    $("#save").click(() => {
        eachCheckbox((x: HTMLInputElement) => {
            let data = {};
            data[x.id] = x.checked;
            api.storage.local.set(data);
        });

        $("#status").text("保存しました。");
        setTimeout(() => {
            $("#status").text("");
        }, 1000);
    });
});