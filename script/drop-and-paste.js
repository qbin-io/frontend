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
    // Hold paste to submit instantly (TODO: check compatibility with pasting from the right-click menu)
    if (window.isPasting) { event.preventDefault(); return submitForm(); }
    window.isPasting = $("Q").value == "";
})
window.addEventListener("keyup", (event) => {
    if (event.keyCode == 86 /* V */ || !event.ctrlKey) window.isPasting = false;
 });
