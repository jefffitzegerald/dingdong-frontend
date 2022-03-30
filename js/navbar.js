const logo = document.querySelector(".logo");
logo.addEventListener("click", () => {
    window.location = "/";
});

const about = document.getElementById("about");
const nav_item = document.querySelectorAll(".nav-item");

for (let i = 0; i < nav_item.length; i++) {
    let item = nav_item[i];
    item.addEventListener("click", () => {
        let page = "";
        if(item.textContent.toLowerCase() === "profile") page += "me";
        else page += item.textContent.toLowerCase();
        window.location = `/${page}`;
    });
}

const loginBtn = document.getElementById("loginBtn");
if(loginBtn) {
    loginBtn.addEventListener("click", () => {
        window.location = "/login";
    });
}

const logoutBtn = document.getElementById("logoutBtn");
if(logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        window.location = "/logout";
    });
}

const tl = gsap.timeline({ defaults: { duration: 0.75 } });
tl.fromTo(".dropdown-content", { x: 0 }, { x: -400 });

const dropdown = document.getElementById("dropdown");
dropdown.addEventListener("click", () => {
    tl.fromTo(".dropdown-content", { x: -400, opacity: 0 }, { x: 0, opacity: 1 });
});

const arrow_close = document.getElementById("close");
arrow_close.addEventListener("click", () => {
    tl.fromTo(".dropdown-content", { x: 0, opacity: 1 }, { x: -400, opacity: 0 });
});

function direct(page) {
    window.location = `/${page}`;
}