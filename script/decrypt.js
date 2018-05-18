var e = document.getElementById("content");
while (e.firstElementChild != null) e = e.firstElementChild;

var classes = e.className;
e.className = null;


if (sessionStorage.getItem("key")) {
    window.location.hash = sessionStorage.getItem("key");
    sessionStorage.removeItem("key");
}
var key = window.location.hash.substr(1);
document.getElementById("encryption-hash").textContent = "#" + key;
triplesec.decrypt({
    key: triplesec.Buffer(key),
    data: triplesec.Buffer(base91.decode(document.getElementById("content").textContent))
}, function(err, res) {
    e.textContent = res.toString();
    e.className = classes;
    setTimeout(function() {
        Prism.highlightAll();
    });
    document.getElementById("encrypting").style.display = "none";
});
