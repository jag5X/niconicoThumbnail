/// <reference path="jquery.d.ts"/>
class OptionsPage {

    public static initialize() {

        // Restores select box state to saved value from localStorage.
        OptionsPage.eachCheckbox((x: HTMLInputElement) => {
            x.checked = localStorage[x.id] == "true";
        });

        // Saves options to localStorage.
        $("#save").click(() => {
            OptionsPage.eachCheckbox((x: HTMLInputElement) => {
                localStorage[x.id] = x.checked;
            });

            // Update status to let user know options were saved.
            $("#status").text("保存しました。");
            setTimeout(() => {
                $("#status").text("");
            }, 1000);
        });

    }

    private static eachCheckbox(func: (checkbox: HTMLInputElement) => void) {
        $(":checkbox").each((i: number, x: HTMLInputElement) => {
            func(x);
        });
    }

}

$(() => {
    OptionsPage.initialize();
});