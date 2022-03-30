const secret_button = document.querySelector(".logo-footer");
secret_button.addEventListener("click", () => {
    fetch("/api/session/promotions", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ number: 1 })
    })
    .then(res => res.json())
    .then(res => {
        if(res.number >= 10) {
            window.location = "/secret";
        }
    });
});