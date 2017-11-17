// Import programming languages from classical select box to reduce redundancy.
[...document.querySelectorAll("syntax-options")].forEach((e) => {
    [...document.getElementById(e.getAttribute("for")).querySelectorAll("option")].forEach((o) => {
        let c = document.createElement("a");
        c.setAttribute("tabindex", "0");
        c.setAttribute("data-value", o.value);
        c.innerHTML = o.innerHTML;
        e.parentElement.insertBefore(c, e);
    });
});

window.syntaxSelection = function syntaxSelection() {

    // Cursor direction mapping.
    // This could be done using a function, but that function would be a lot
    // longer than this and not produce results as user-friendly as this.
    const cursorMap = {};
    const fnNext = e => e.nextElementSibling;
    const fnNextNext = e => e.nextElementSibling.nextElementSibling;
    const fnPrev = e => e.previousElementSibling;
    const fnPrevPrev = e => e.previousElementSibling.previousElementSibling;

    cursorMap["cpp"] = ["search", fnNext, fnNextNext, "batch"];
    cursorMap["csharp"] = ["search", "batch", fnNextNext, fnPrev];
    cursorMap["go"] = [fnPrevPrev, fnNext, fnNextNext, "powershell"];
    cursorMap["java"] = [fnPrevPrev, "powershell", fnNextNext, fnPrev];
    cursorMap["lua"] = [fnPrevPrev, fnNext, fnNextNext, "bash"];
    cursorMap["php-extras"] = [fnPrevPrev, "bash", "markup", fnPrev];
    cursorMap["sql"] = [fnPrevPrev, "apacheconf", "markup", "bash"];

    cursorMap["markup"] = ["sql", "nginx", fnNext, "nginx"];
    cursorMap["javascript"] = [fnPrev, "docker", fnNext, "docker"];
    cursorMap["css-extras"] = [fnPrev, "makefile", "none", "makefile"];

    cursorMap["batch"] = ["search", "cpp", fnNext, "csharp"];
    cursorMap["powershell"] = [fnPrev, "go", fnNext, "java"];
    cursorMap["bash"] = [fnPrev, "lua", "apacheconf", "php-extras"];

    cursorMap["apacheconf"] = ["bash", "markup", fnNext, "sql"];
    cursorMap["nginx"] = [fnPrev, "markup", fnNext, "markup"];
    cursorMap["docker"] = [fnPrev, "javascript", fnNext, "javascript"];
    cursorMap["makefile"] = [fnPrev, "css-extras", fnNext, "css-extras"];
    cursorMap["yaml"] = [fnPrev, "css-extras", "markdown!", "css-extras"];

    cursorMap["search"] = ["none", null, "cpp", null];
    cursorMap["none"] = ["css-extras", "markdown!", "search", "markdown!"];
    cursorMap["markdown!"] = ["yaml", "none", "search", "none"];

    [...document.querySelectorAll(".syntax-selection [data-value], #syntax-search")].forEach((e) => {
        e.addEventListener("keydown", (event) => {
            // TODO: Enter
            // TODO: Escape
            // TODO: Handle search
            // Directions
            if (event.keyCode == 38) { event.preventDefault(); syntaxSelection.moveCursor(e, "up"); }
            if (event.keyCode == 40) { event.preventDefault(); syntaxSelection.moveCursor(e, "down"); }
            if (event.keyCode == 37 && e.id != "syntax-search") { event.preventDefault(); syntaxSelection.moveCursor(e, "left"); }
            if (event.keyCode == 39 && e.id != "syntax-search") { event.preventDefault(); syntaxSelection.moveCursor(e, "right"); }
        });
    });

}

window.syntaxSelection.moveCursor = function moveCursor(e, direction) {
    const directions = { up: 0, right: 1, down: 2, left: 3 };
    const focus = current => {
        target = (x => typeof x == "function" ? x(e) : x)(cursorMap[current][directions[direction]]);
        if (target == "search") target = document.querySelector("#syntax-search");
        if (typeof target == "object") target.focus();
        else document.querySelector("[data-value='" + target + "']").focus();
    }

    
    if (e.id == "syntax-search") return focus("search");
    return focus(e.getAttribute("data-value"));
}

// @TODO: Implementation
window.syntaxSelection.open = function open() {

}

window.syntaxSelection.close = function close() {

}

window.syntaxSelection.search = function search() {

}

window.syntaxSelection.select = function select() {

}

// @TODO: Replace <select> dropdown

window.syntaxSelection();
