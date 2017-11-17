window.addEventListener("load", () => {
    // Initialize Prism
    Prism.plugins.autoloader.languages_path = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.6.0/components/";

    // Initialize CodeFlask
    window.flask = new CodeFlask();
    flask.run("#content", { language: "", lineNumbers: true });
    
    // Initialize syntax language
    updateSyntaxLanguage($("S").value);

    // Update syntax language
    $("S").addEventListener("change", event => updateSyntaxLanguage(event.target.value));
    
    // Autofocus textarea on load
    $("Q").focus();
});

function updateSyntaxLanguage(lang) {
    console.log("Language changed to: " + lang);
    if (lang == "markdown!") lang = "markdown";
    if (lang == "none") lang = "";
    document.getElementsByClassName("CodeFlask__code")[0].className = "CodeFlask__code language-" + lang;
    updateEditor();
}

function updateEditor() {
    // Send "input" event two times to be really sure
    const event = document.createEvent("HTMLEvents");
    event.initEvent("input", false, true);
    $("Q").dispatchEvent(event);
    setTimeout(() => $("Q").dispatchEvent(event), 50);
}
