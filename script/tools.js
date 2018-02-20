// Remove duplicate scrollbar while still letting the placeholder scroll.
$("Q").addEventListener("input", (event) => {
    if ($("Q").value != "") setTimeout(() => $("content").setAttribute("style", "overflow: hidden"));
    else setTimeout(() => $("content").removeAttribute("style"));
});

// Warn when leaving with unsubmitted changes.
window.addEventListener("beforeunload", (event) => {
    if (!window.isSubmitted && $("Q").value.trim().length) return event.returnValue = "You have unsaved data.";
});

// Fix Ctrl+A to always select textarea.
window.addEventListener("keydown", (event) => {
    if (event.ctrlKey && !event.shiftKey && !event.altKey && event.keyCode == 65) $("Q").focus();
})

// Keep track of submitting.
function submitForm() {
    $("Q").readonly = window.isSubmitted = true;
    localStorage.justSubmitted = Date.now();
    $("submit").click();
}
$("F").addEventListener("submit", (event) => {
    $("Q").readonly = window.isSubmitted = true;
    localStorage.justSubmitted = Date.now();
});
window.addEventListener("unload", () => {
    $("Q").readonly = window.isSubmitted = false;
})

// Insert text at the current cursor position.
// https://stackoverflow.com/a/11077016
function insertAtCursor(el, text) {
    if (document.activeElement != el) el.focus();
    if (document.selection) { // IE
        document.selection.createRange().text = text;
    } else if (window.hasOwnProperty("mozPaintCount")) { // Firefox
        const startPos = el.selectionStart;
        const endPos = el.selectionEnd;
        el.value = el.value.substring(0, startPos) + text + el.value.substring(endPos, el.value.length);
        el.selectionStart = el.selectionEnd = startPos + text.length;
    } else { // Fallback
        document.execCommand("insertText", false, text);
    }
    
    updateEditor();
}
