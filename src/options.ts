"use strict";

$(() => {
    function eachCheckbox(func: (checkbox: HTMLInputElement) => void) {
        $(":checkbox").each((i: number, x: HTMLInputElement) => {
            func(x);
        });
    }

    eachCheckbox((x: HTMLInputElement) => {
        x.checked = localStorage[x.id] == "true";
    });

    $("#save").click(() => {
        eachCheckbox((x: HTMLInputElement) => {
            localStorage[x.id] = x.checked;
        });

        $("#status").text("保存しました。");
        setTimeout(() => {
            $("#status").text("");
        }, 1000);
    });
});