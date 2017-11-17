function selectText(el) {
    if (!el) return window.getSelection().removeAllRanges();
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(el);
    selection.removeAllRanges();
    selection.addRange(range);
}
