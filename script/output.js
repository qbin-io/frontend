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
        if (range && window.getSelection().containsNode(document.querySelector("h4"), true)) {
            range.setStartBefore(document.querySelector("#content"));
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

}));

// Only copy plain test
document.addEventListener("copy", function(e) {
    text = window.getSelection().toString();
    e.clipboardData.setData("text/plain", text);
    e.clipboardData.setData("text/html", text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
    e.preventDefault();
});

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
