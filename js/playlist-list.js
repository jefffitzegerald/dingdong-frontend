const add = document.getElementById("add");
add.addEventListener("click", popup);

const create = document.getElementById("quick-create");
if(create) create.addEventListener("click", popup);

function popup() {
    add.disabled = true;
    if(create) create.disabled = true;

    let div_container = document.getElementById("popup");
    div_container.setAttribute("class", "popup");

    tl.fromTo(".popup", { opacity: 0}, { opacity: 1 });

    let form = document.createElement("form");
    form.setAttribute("class", "popup-box")
    form.action = "/me/playlist";
    form.method = "post";

    let h1 = document.createElement("h1");
    h1.textContent = "Create Playlist";
    form.appendChild(h1);

    let input_title = document.createElement("input");
    input_title.type = "text";
    input_title.name = "title";
    input_title.placeholder = "Input Name";
    input_title.maxLength = 20;
    input_title.required = true;
    form.appendChild(input_title);

    let button1 = document.createElement("button");
    button1.setAttribute("class", "green");
    button1.textContent = "Yes";
    button1.type = "submit";
    form.appendChild(button1);

    let button2 = document.createElement("button");
    button2.setAttribute("onclick", "unpopup();");
    button2.setAttribute("class", "red");
    button2.textContent = "No";
    button2.type = "button";
    
    form.appendChild(button2);

    div_container.appendChild(form);
    tl.fromTo(".popup-box", { scale: 0 }, { scale: 1 });
}

function unpopup() {
    add.disabled = false;
    if(create) create.disabled = false;

    let no_button = document.querySelector(".red");
    let yes_button = document.querySelector(".green");
    
    no_button.disabled = true;
    yes_button.disabled = true;

    tl.fromTo(".popup-box", { scale: 1 }, { scale: 0 });

    let div_container = document.getElementById("popup");
    setTimeout(() => {

        for (let i = 0; i < div_container.children.length; i++) {
            const child = div_container.children[i];
            child.remove();
        }

        tl.fromTo(".popup", { opacity: 1 }, { opacity: 0 });
        setTimeout(() => {
            div_container.removeAttribute("class");
        }, 750);

    }, 750);
}

const list = document.querySelectorAll(".list");
for (let i = 0; i < list.length; i++) {
    const item = list[i];
    item.addEventListener("click", () => {
        window.location = `/me/playlist/${item.id}`;
    });
}