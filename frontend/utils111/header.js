window.addEventListener("contextmenu", e => e.preventDefault());

window.addEventListener("keyup", function(e) {
    if (e.keyCode === 44 || e.key === "PrintScreen") {
        navigator.clipboard.writeText("");
        alert("캡쳐 금지!");
    }
}, false);
