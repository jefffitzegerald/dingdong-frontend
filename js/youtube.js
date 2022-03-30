let split = window.location.pathname.split("/");
let id = split[2];
let data = {
    id: id,
    type: "video"
}

fetch("/api/v1/youtube", {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
.then(res => res.json())
.then(async(res) => {
    const description = document.getElementById("description");
    let text = res.description.replaceAll('\n', " <br> ");

    for (let word of text.split(" ")) {
        let expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        let regex = new RegExp(expression);

        let url = "";
        if(regex.test(word)) {
            url += `<a href="${window.location.origin}/redirect?url_site=${encodeURIComponent(word)}" target="_blank">${word}</a>`;
            text = text.replace(word, url);
        }
    
        if(word.startsWith("#")) {
            
            let hastag_url = "";
            let tag = word.slice(1, word.length);

            hastag_url += `<a href="${window.location.origin}/redirect?url_site=${encodeURIComponent(`https://www.youtube.com/hashtag/${tag}`)}" target="_blank">${word}</a>`;
            text = text.replace(word, hastag_url);

        }
    }

    description.innerHTML = text;
})
.catch(console.error);

const downloadBtn = document.querySelector(".btn-2");
downloadBtn.addEventListener("click", () => {
    window.location.href = `/download?type=youtube&format=mp4&id=${id}`;
});

const watch_youtube = document.querySelector(".btn-3");
watch_youtube.addEventListener("click", () => {
    window.open(`https://youtube.com/watch?v=${id}`, "_blank");
});

const popup_container = document.getElementById("popup");
const playlist = document.querySelector(".btn-1");
playlist.addEventListener("click", popup);

function popup() {
    playlist.disabled = true;
    popup_container.setAttribute("class", "popup");
    tl.fromTo(".popup", { opacity: 0 }, { opacity: 1 });
    
    let box = document.createElement("div");
    box.setAttribute("class", "popup-content popup-box");

    let h1 = document.createElement("h1");
    h1.setAttribute("class", "popup-content");
    h1.textContent = "Add to...";
    box.appendChild(h1);

    let hr = document.createElement("hr");
    hr.setAttribute("class", "popup-content")
    box.appendChild(hr);

    fetch("/me/playlist/check")
    .then(res => res.json())
    .then(res => {

        if(res.playlist.length > 0) {
            
            for (let i = 0; i < res.playlist.length; i++) {
                const playlist = res.playlist[i];
                const playlist_container = document.createElement("div");
                playlist_container.setAttribute("class", "popup-content playlist");
                playlist_container.id = playlist.id;

                const title = document.createElement("span");
                title.setAttribute("class", "popup-content")
                title.textContent = playlist.title.length > 15 ? `${playlist.title.substr(0, 15)}...` : playlist.title;
                playlist_container.appendChild(title);

                const button_add_container = document.createElement("div");
                button_add_container.setAttribute("class", "popup-content add");
                button_add_container.setAttribute("onclick", `add_track('${playlist.id}');`)

                const button_add = document.createElement("button");
                button_add.setAttribute("class", "popup-content add-btn");
                
                button_add_container.appendChild(button_add);
                playlist_container.appendChild(button_add_container);
                box.appendChild(playlist_container);
            }

        }

        popup_container.appendChild(box);
        tl.fromTo(".popup-box", { scale: 0 }, { scale: 1 });

    });
}

function add_track(playlist_id) {
    const button_add = document.querySelectorAll(".add-btn");
    for (let i = 0; i < button_add.length; i++) {
        const element = button_add[i];
        element.disabled = true;
    }

    let data = {
        type: "youtube",
        url: `https://youtube.com/watch?v=${id}`
    }

    fetch(`/me/playlist/${playlist_id}/add`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {

        const box = document.querySelector(".popup-box");
        const popup_container = document.getElementById("popup");

        playlist.disabled = false;
        tl.fromTo(".popup-box", { scale: 1 }, { scale: 0 });

        setTimeout(() => {

            box.remove();
            tl.fromTo(".popup", { opacity: 1 }, { opacity: 0 });

            setTimeout(() => {

                alert(`Successfully add track to ${res.playlist.title} playlist!`);
                popup_container.removeAttribute("class");

            }, 750);

        }, 750);

    });

}

document.body.addEventListener("click", (e) => {
    const box = document.querySelector(".popup-box");
    const popup_container = document.querySelector(".popup");

    if(box && popup_container) {
    
        let classTag = e.target.classList[0];

        if(classTag !== "popup-content") {
            playlist.disabled = false;
            
            tl.fromTo(".popup-box", { scale: 1 }, { scale: 0 });
    
            setTimeout(() => {
    
                box.remove();
                tl.fromTo(".popup", { opacity: 1 }, { opacity: 0 });
    
                setTimeout(() => {
    
                    popup_container.removeAttribute("class");
    
                }, 750);
    
            }, 750);
        }

    }
});