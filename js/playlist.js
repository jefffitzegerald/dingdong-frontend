let tracks = [];
let shuffle_array = [];

const search = document.getElementById("search");
if(search) {
    search.addEventListener("click", () => {
        window.location = "/search";
    });
}

const backButton = document.querySelector(".back-to-main");
backButton.addEventListener("click", () => {
    window.location = "/me/playlist";
});

const delete_button = document.getElementById("delete");
delete_button.addEventListener("click", popup);

function popup() {
    delete_button.disabled = true;
    if(search) search.disabled = true;

    const popup = document.getElementById("popup");
    popup.setAttribute("class", "popup");
    tl.fromTo(".popup", { opacity: 0}, { opacity: 1 });

    let id = window.location.pathname.split("/")[3];
    let form = document.createElement("form");
    form.setAttribute("class", "popup-box")
    form.action = `/me/playlist/${id}/delete`;
    form.method = "post";

    let h1 = document.createElement("h1");
    h1.textContent = "Are You Sure ?";
    form.appendChild(h1);

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
    popup.appendChild(form);

    tl.fromTo(".popup-box", { scale: 0 }, { scale: 1 });
}

function unpopup() {
    delete_button.disabled = false;
    if(search) search.disabled = false;

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

let container = document.getElementById("list");
let items = document.querySelectorAll(".playlist-container");
let id = window.location.pathname.split("/")[3];

if(items) {
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        let button = item.children[5].children[0];
        button.addEventListener("click", () => {

            fetch(`/me/playlist/${id}/remove`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: item.id })
            })
            .then(() => {
                
                let index = tracks.map(i => { return i.request_id }).indexOf(item.id);
                let index2 = shuffle_array.map(i => { return i.request_id }).indexOf(item.id);

                if(tracks[index]) {

                    tracks.splice(index, 1);
                    for (let i = 0; i < tracks.length; i++) {
                        const track = tracks[i];
                        track.index = i;
                    }

                }
                if(shuffle_array[index2]) {
                    
                    shuffle_array.splice(index2, 1);
                    for (let i = 0; i < shuffle_array.sort((a, b) => a.index - b.index).length; i++) {
                        const track = shuffle_array[i];
                        track.index = i;
                    }

                    let songs = shuffle_array;
                    for (let i = songs.length - 1; i > 1; i--) {
                        let j = 1 + Math.floor(Math.random() * i);
                        [songs[i], songs[j]] = [songs[j], songs[i]];
                    }
                    shuffle_array = songs;

                }
                
                item.remove();
                if(document.querySelectorAll(".item").length < 1) {

                    const items_container = document.getElementById("items");
                    if(items_container) items_container.remove();
    
                    const empty_container = document.createElement("div");
                    empty_container.setAttribute("class", "empty");
    
                    const header = document.createElement("h2");
                    header.textContent = "YOUR PLAYLIST ITS EMPTY";
                    empty_container.appendChild(header);

                    const search_button = document.createElement("button");
                    search_button.setAttribute("id", "search");
                    search_button.setAttribute("class", "search-btn");
                    search_button.setAttribute("type", "button");
                    search_button.innerHTML = '<i class="bi bi-search"></i> SEARCH FOR A TRACK / VIDEO';
                    
                    empty_container.appendChild(search_button);
                    container.appendChild(empty_container);

                }

            });

        });

    }
}