let data = {};

const loginButton = document.querySelector(".login-direct");
loginButton.addEventListener("click", () => {
    window.location = "/login";
});

const alert_message = document.getElementById("alert_email");
const submit = document.getElementById("submit");
const email = document.getElementById("email");

email.addEventListener("change", () => {
    let value = email.value;
    data["email"] = value;
    fetch("/register/check", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(res => {
        if(res.length > 0) {
            let index = res.map(i => {
                return i.email;
            }).indexOf(value);
            if(res[index]) {
                alert_message.innerHTML = "Email account has been registered!";
                submit.disabled = true;
            } else {
                alert_message.innerHTML = "";
            }
        }
    });
});

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

const alert_password = document.getElementById("alert_password");
const confirm_password = document.getElementById("confirm_password");
confirm_password.addEventListener("change", () => {
    let value = confirm_password.value;
    if(value.length > 0) {
        data["confirm_password"] = value;
        if(value !== data["password"]) {
            alert_password.innerHTML = "Confirm password must match with password!";
        } else {
            alert_password.innerHTML = "";
        }
    } else {
        alert_password.innerHTML = "";
    }
});

setInterval(() => {
    if(!data["email"] || data["email"].length < 1) return submit.disabled = true;
    if(!data["username"] || data["username"].length < 1) return submit.disabled = true;
    if(!data["password"] || (data["password"].length < 1)) return submit.disabled = true;
    if(!data["confirm_password"] || data["confirm_password"].length < 1) return submit.disabled = true;
    if(data["password"] !== data["confirm_password"]) {
        alert_password.innerHTML = "Confirm password must match with password!";
        return submit.disabled = true;
    }

    submit.disabled = false;
}, 500);