function selectText(el) {
    if (!el) return window.getSelection().removeAllRanges();
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.setStartBefore(el.firstChild);
        range.setEndAfter(el.lastChild);
    } else {
        const range = document.createRange();
        range.selectNodeContents(el);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
