// Initialize highlighting.
Prism.plugins.autoloader.languages_path = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.6.0/components/";
window.addEventListener("keydown", (event) => {
    if (event.ctrlKey && !event.shiftKey && !event.altKey && event.keyCode == 65) {
        event.preventDefault();
        selectText(document.querySelector("#content>*"));
    }
});

// Line numbers in use → use normal padding.
document.querySelector(".no-linenumber-padding").classList.remove("no-linenumber-padding");

function selectText(el) {
    if (!el) return window.getSelection().removeAllRanges();
    let range, selection;
    if(document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(el);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(el);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

// If the current document was only recently submitted, highlight the link.
if (Date.now() - localStorage.justSubmitted < 30 * 1000) {
    localStorage.removeItem("justSubmitted");
    document.querySelector("h4").classList.add("select");
    selectText(document.querySelector("h4"));
    window.addEventListener("mousedown", () => { document.querySelector("h4").classList.remove("select"); selectText(null)});
}
