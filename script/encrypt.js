function generateKey() {
    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_+";
    var values = new Uint8Array(48);
    var secret = "";
    crypto.getRandomValues(values);
    for (var i = 0; i < 48; i++) {
        secret += chars[values[i] % chars.length];
    }
    return secret;
}
var encryptionState = 0;
var lastEncryptionState = -1;
window.addEventListener("submit", function(event) {
    if (encryptionState === lastEncryptionState) return;
    lastEncryptionState = encryptionState;
    if (encryptionState === 1) return;
    if ($("C").checked) {
        $("encrypting").style.display = "flex";
        var key = generateKey();
        triplesec.encrypt({
            key: triplesec.Buffer(key),
            data: triplesec.Buffer($("Q").value)
        }, function(err,res) {
            $("Q").value = base91.encode(res);
            sessionStorage.setItem("key", key);
            encryptionState = 1;
            submitForm();
        });
        event.preventDefault();
    }
})
