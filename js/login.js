const auth_buttons = document.querySelectorAll(".auth-btn");
for (let i = 0; i < auth_buttons.length; i++) {
    const button = auth_buttons[i];
    button.addEventListener("click", () => {
        window.location = `/login/${button.value}`;
    });
}

const register = document.querySelector(".register");
register.addEventListener("click", () => {
    window.location = "/register";
});

let data = {};
const submit = document.getElementById("submit");
submit.disabled = true;

const username = document.getElementById("username");
username.addEventListener("change", () => {
    let value = username.value;
    data["username"] = value;
});

const password = document.getElementById("password");
password.addEventListener("change", () => {
    let value = password.value;
    data["password"] = value;
});

setInterval(() => {
    if(!data["username"] || data["username"].length < 1) return submit.disabled = true;
    if(!data["password"] || data["password"].length < 1) return submit.disabled = true;

    submit.disabled = false;
}, 500);