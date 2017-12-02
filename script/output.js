//TODO: Last line number is cut off when scrolling
//TODO: One line too much is copied.

// Selectable lines
document.body.classList.add("selectable-lines");
let selectableLines = [...document.getElementsByClassName("line-number")];
let lastClick = -1;
let lastAction = false;
function parseHash() {
    const hash = location.hash.substr(1).split(",").filter(x => x.trim().length).map(x => x.split("-"));
    for (let i = 0; i < hash.length; i++) {
        if (hash[i].length > 2 || !hash[i][0].match(/^\d+$/) || (hash[i].length > 1 && !hash[i][1].match(/^\d+$/))) {
            console.warn("Invalid hash segment:", hash[i].join("-"));
            hash.splice(i, 1); i--;
            continue;
        }
        if (hash[i].length < 2) hash[i][1] = hash[i][0];
        hash[i] = hash[i].map(x => parseInt(x));
    }
    return hash;
}
function generateHash(hash) {
    hash.sort((a,b) => a[0] - b[0]);
    for (let i = 0; i < hash.length - 1; i++) { // Merge
        if (hash[i][1] + 1 >= hash[i+1][0]) {
            hash[i][1] = Math.max(hash[i][1], hash[i+1][1]);
            hash.splice(i+1, 1);
            i--;
        }
    }
    return hash.map(x => x.filter((e, i, a) => i == 0 || e != a[0]).join("-")).join(",");
}
window.addEventListener("click", event => {
    if (event.target.classList && event.target.classList.contains("line-number")) {
        const n = selectableLines.indexOf(event.target) + 1;
        if (event.ctrlKey && event.shiftKey && lastClick > -1) {
            for (let i = Math.min(n, lastClick); i <= Math.max(n, lastClick); i++) {
                toggleHighlight(i, lastAction);
            }
            lastClick = n;
        } else if (event.shiftKey && lastClick > -1) {
            location.hash = lastClick;
            for (let i = Math.min(n, lastClick); i <= Math.max(n, lastClick); i++) {
                toggleHighlight(i, true);
            }
            lastClick = n;
        } else if (event.ctrlKey) {
            lastAction = toggleHighlight(n);
            lastClick = n;
        } else {
            lastAction = true;
            lastClick = n;
            const hash = parseHash();
            if (hash.length == 1 && hash[0][0] == n && hash[0][1] == n) {
                location.hash = "";
            } else {
                location.hash = n;
            }
        }
    }
})

function toggleHighlight(n, only) {
    const hash = parseHash();
    let isHighlighted = false;
    let action = null;
    for (let i = 0; i < hash.length; i++) {
        if (n >= hash[i][0] && n <= hash[i][1]) isHighlighted = true;
    }
    for (let i = 0; i < hash.length && action === null; i++) {
        console.log(n, hash[i], isHighlighted);
        if (n+1 == hash[i][0] && !isHighlighted && only !== false) { // Add above
            hash[i][0]--;
            action = true;
        } else if (n-1 == hash[i][1] && !isHighlighted && only !== false) { // Add below
            hash[i][1]++;
            action = true;
        } else if (n == hash[i][0] && only !== true) { // Remove first
            if (hash[i][0] == hash[i][1]) hash.splice(i, 1);
            else hash[i][0]++;
            action = false;
        } else if (n == hash[i][1] && only !== true) { // Remove last
            if (hash[i][0] == hash[i][1]) hash.splice(i, 1);
            else hash[i][1]--;
            action = false;
        } else if (n > hash[i][0] && n < hash[i][1] && only !== true) { // Remove in between
            hash.splice(i+1, 0, [n+1, hash[i][1].toString()]);
            hash[i][1] = n-1;
            action = false;
        }
    }
    if (action === null && only !== false) { // Add new
        let pos = 0;
        for (let i = 0; i < hash.length - 1; i++) {
            if (hash[i][1] < n && hash[i+1][0] > n) pos = i+1;
        }
        hash.splice(pos, 0, [n, n]);
        action = true;
    }
    location.hash = generateHash(hash);
    return action;
}

// Highlight lines from hash
function highlightLines(scroll) {
    const hash = parseHash();
    let code = document.querySelector("#content > pre > code").innerHTML;
    for (let i = 0; i < hash.length; i++) {
        let n = 0;
        code = code.replace(/^/gm, (a) => {
            n++;
            if (n >= hash[i][0] && n <= hash[i][1]) {
                return a + '<span class="line-highlight' + (n == hash[i][0] ? " lh-top" : "") + (n == hash[i][1] ? " lh-bot" : "") + '"></span>'
            }
            return a
        })
    }
    document.querySelector("#content > pre > code").innerHTML = code;
    let first;
    if (scroll && (first = document.querySelector("#content > pre > code .line-highlight"))) setTimeout(() => {
        let n = first.offsetTop;
        n = n - 24;
        document.getElementById("content").scrollTo(0, n)
    })
    selectableLines = [...document.getElementsByClassName("line-number")];
}
highlightLines(true);
window.addEventListener("hashchange", () => {
    [...document.getElementsByClassName("line-highlight")].forEach(e => e.parentNode.removeChild(e));
    highlightLines(false);
})

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
