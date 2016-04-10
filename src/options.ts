"use strict";

$(() => {
    function eachCheckbox(func: (checkbox: HTMLInputElement) => void) {
        $(":checkbox").each((i: number, x: HTMLInputElement) => {
            func(x);
        });
    }

    eachCheckbox((x: HTMLInputElement) => {
        chrome.storage.local.get(x.id, (s) => {
            x.checked = s[x.id];
        });
    });

    $("#save").click(() => {
        eachCheckbox((x: HTMLInputElement) => {
            let data = {};
            data[x.id] = x.checked;
            chrome.storage.local.set(data);
        });

        $("#status").text("保存しました。");
        setTimeout(() => {
            $("#status").text("");
        }, 1000);
    });
});