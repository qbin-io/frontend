if (sessionStorage.getItem("key")) {
    window.location.hash = sessionStorage.getItem("key");
    sessionStorage.removeItem("key");
}
var key = window.location.hash.substr(1);
document.getElementById("encryption-hash").textContent = "#" + key;
console.log(base91.decode(document.getElementById("content").textContent));
triplesec.decrypt({
    key: triplesec.Buffer(key),
    data: triplesec.Buffer(base91.decode(document.getElementById("content").textContent))
}, function(err, res) {
    var e = document.getElementById("content");
    while (e.firstElementChild != null) e = e.firstElementChild;
    e.textContent = res.toString();
    document.getElementById("encrypting").style.display = "none";
});
