let isUser = false;

fetch("/api/session")
.then(res => res.json())
.then(res => {
    if(res.session.user) isUser = true;
});

const redirect = document.querySelector(".btn-3");
redirect.addEventListener("click", () => {
    let split = window.location.pathname.split("/");
    let author_permalink = split[2];
    let permalink = split[3];

    window.open(`https://soundcloud.com/${author_permalink}/${permalink}`, "_blank");
});

const download = document.querySelector(".btn-2");
download.addEventListener("click", async() => {
    let split = window.location.pathname.split("/");
    let author_permalink = split[2];
    let permalink = split[3];

    let data = {
        url: `https://soundcloud.com/${author_permalink}/${permalink}`,
        type: "track"
    }
    let track = await fetch("/api/v1/soundcloud", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json());

    let download_url = `/download?id=${track.id}&type=soundcloud&format=mp3&direct=${data.url}`;
    window.location.href = download_url;
});

const popup_container = document.getElementById("popup");
const playlist = document.querySelector(".btn-1");
playlist.addEventListener("click", popup);

function popup() {
    if(!isUser) return;

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
    let split = window.location.pathname.split("/");
    let author_permalink = split[2];
    let permalink = split[3];
    
    let data = {
        type: "soundcloud",
        url: `https://soundcloud.com/${author_permalink}/${permalink}`
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