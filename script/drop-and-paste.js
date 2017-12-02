// Drop handler
window.addEventListener("dragover", event => event.preventDefault());
window.addEventListener("drop", (event) => {
    const file = event.dataTransfer.files[0];
    if (!file.type || file.type.indexOf("text/") == 0 || ["application/json", "application/javascript", "application/xhtml+xml", "application/xml", "application/x-httpd-php", "application/x-latex", "application/x-sh", "application/x-shellscript", "application/x-tex", "application/x-texinfo"].indexOf(file.type) != -1) {
        const reader = new FileReader();
        reader.addEventListener("load", event => insertAtCursor($("Q"), event.target.result));
        reader.readAsText(file);
        return;
    }

    insertAtCursor($("Q"), event.dataTransfer.getData("text/plain"));
    return event.preventDefault();
})

// Paste handler
window.addEventListener("paste", (event) => {
    $("Q").focus();
    setShortcutsVisible(false);
    // Hold paste to submit instantly
    if (window.isPasting === true) { event.preventDefault(); return submitForm(); }
    if (window.isPasting === false) window.isPasting = true; // null: can't paste right now
});
window.addEventListener("keydown", (event) => {
    console.log(event.keyCode, event.ctrlKey);
    if (event.keyCode == 86 /* V */ && event.ctrlKey && window.isPasting !== true) window.isPasting = false;
});
window.addEventListener("keyup", (event) => {
    if (event.keyCode == 86 /* V */ || !event.ctrlKey) window.isPasting = null;
});
