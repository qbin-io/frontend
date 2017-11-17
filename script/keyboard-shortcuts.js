// Shortcut Tooltips
function setShortcutsVisible(value) {
    if (value === true) {
        window.showShortcuts = setTimeout(() => {
            if (window.showShortcuts != null) document.body.classList.add("shortcuts-visible");
        }, 400);
    } else {
        window.showShortcuts = null;
        clearTimeout(window.showShortcuts);
        document.body.classList.remove("shortcuts-visible");
    }
}
window.addEventListener("blur", setShortcutsVisible);
window.addEventListener("keyup", (event) => { if (!event.ctrlKey) setShortcutsVisible(false) });
window.addEventListener("keydown", event => setShortcutsVisible(event.keyCode == 17));

// Keyboard Shortcuts
window.addEventListener("keydown", (event) => {
    const ctrl = event.ctrlKey && !event.shiftKey && !event.altKey;
    if (ctrl && event.keyCode == 83) { // Ctrl+S
        $("S").focus();
        event.preventDefault();
    } else if (ctrl && event.keyCode == 69) { // Ctrl+E
        switch ($("E").value) {
            case "14d": $("E").value = "0"; break;
            case "0": $("E").value = "30m"; break;
            case "30m": $("E").value = "24h"; break;
            case "24h": $("E").value = "14d"; break;
        }
        event.preventDefault();
    } else if (ctrl && event.keyCode == 32) { // Ctrl+Space
        $("S").setAttribute("style", "display: none"); // Hack for firefox: Ctrl+Space opens dropdown
        document.getElementById("Q").focus();
        setTimeout(() => $("S").removeAttribute("style"));
        event.preventDefault();
    } else if (ctrl && event.keyCode == 112) { // Ctrl+F1
        window.open("/about");
        event.preventDefault();
    } else if (ctrl && event.keyCode == 13) { // Ctrl+Enter
        submitForm();
        event.preventDefault();
    }
}, true);
