// Initialize highlighting.
Prism.plugins.autoloader.languages_path = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.6.0/components/";

// Line numbers in use → use normal padding.
document.querySelector(".no-linenumber-padding").classList.remove("no-linenumber-padding");

// If the current document was only recently submitted, highlight the link.
if (Date.now() - localStorage.justSubmitted < 30 * 1000) {
    localStorage.removeItem("justSubmitted");
    selectLink();
}

// Make sure the link is only highlighted if it should be highlighted (which is, not together with any other text)
document.addEventListener("selectionchange", (event) => setTimeout(() => {
    
    // Show tooltip
    if (window.getSelection().containsNode(document.querySelector("h4"), true)) {
        if (!document.querySelector("h4").classList.contains("selected")) document.querySelector("h4").classList.add("selected");
    } else {
        if (document.querySelector("h4").classList.contains("selected")) document.querySelector("h4").classList.remove("selected");
    }

    if (window.getSelection().containsNode(document.querySelector("#content>*"), true)) {
        const range = window.getSelection().rangeCount && window.getSelection().getRangeAt(0);
        if (range && window.getSelection().containsNode(document.querySelector("h4"), true)) {
            range.setStartAfter(document.querySelector("h4"));
        }
    }

}), 10);

// Make selectable because we can control the range using JavaScript
document.querySelector("h4").classList.add("selectable");

function selectText(el) {
    if (!el) return window.getSelection().removeAllRanges();
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(el);
    selection.removeAllRanges();
    selection.addRange(range);
}

function selectLink(instant) {
    if (instant) selectText(document.querySelector("h4"));
    setTimeout(() => selectText(document.querySelector("h4")));
}
