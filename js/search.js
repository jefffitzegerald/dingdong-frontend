const youtube = document.querySelectorAll(".youtube");
const spotify = document.querySelectorAll(".spotify");
const soundcloud = document.querySelectorAll(".soundcloud");

if(youtube) {
    for (let i = 0; i < youtube.length; i++) {
        const yt = youtube[i];
        let type = yt.classList[1];
        yt.addEventListener("click", () => {
            window.location = `/${type}/${yt.id}`;
        });
    }
}

if(spotify) {
    for (let i = 0; i < spotify.length; i++) {
        const sp = spotify[i];
        let type = sp.classList[1];
        sp.addEventListener("click", () => {
            window.location = `/${type}/${sp.id}`;
        });
    }
}

if(soundcloud) {
    for (let i = 0; i < soundcloud.length; i++) {
        const sc = soundcloud[i];
        let type = sc.classList[1];
        sc.addEventListener("click", () => {
            window.location = `/${type}${sc.id}`;
        });
    }
}