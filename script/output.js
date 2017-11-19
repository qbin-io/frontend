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

    // h4 selected but also content → deselect h4/.info
    if (window.getSelection().containsNode(document.querySelector("#content>*"), true)) {
        const range = window.getSelection().rangeCount && window.getSelection().getRangeAt(0);
        if (range && window.getSelection().containsNode(document.querySelector(".info"), true)) {
            range.setStartAfter(document.querySelector("h4"));
        }
    // h4 selected, but not completely → completely select h4
    } else if (window.getSelection().containsNode(document.querySelector("h4"), true)) {
        const range = window.getSelection().rangeCount && window.getSelection().getRangeAt(0);
        const el = document.querySelector("h4");
        if (!isFullySelected(el, range)) {
            range.setStartBefore(el.firstChild);
            range.setEndAfter(el.lastChild);
        }
    }

}), 10);

// Make selectable because we can control the range using JavaScript
document.querySelector("h4").classList.add("selectable");

function hasAsParent(e, p) {
    while (e != p && e) e = e.parentElement;
    return e == p;
}

function isFullySelected(el, range) {
    return (
        (hasAsParent(range.startContainer, el))
     && (range.startOffset == 0)
     && (hasAsParent(range.endContainer, el))
     && (range.endOffset >= el.lastChild.textContent.length));
}

function selectLink(instant) {
    if (instant) selectText(document.querySelector("h4"));
    setTimeout(() => selectText(document.querySelector("h4")));
}
