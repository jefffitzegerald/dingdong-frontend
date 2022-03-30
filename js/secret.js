let isPlay = true;
const container = document.querySelector(".container");
const audio = document.createElement("audio");
audio.src = "/storage/audio/secret.mp3";
audio.load();
audio.autoplay = true;

let databese = {};
const code = document.getElementById("code");
code.addEventListener("change", async() => {
    databese["code"] = code.value;
});

const button = document.getElementById("confirm");
button.addEventListener("click", async() => {
    button.innerHTML = '<i class="fa-li fa fa-spinner fa-spin">';

    let data = await fetch("/api/session").then(res => res.json());
    if(!databese["code"] || databese["code"] !== data.id) {
        alert("Wrong code! Try again!");
        button.innerHTML = '<i class="bi bi-x-circle"></i>';

        setTimeout(() => {
            button.innerHTML = '<i class="bi bi-check-circle"></i>';
        }, 5000);
    } else {
        if(isPlay) audio.pause();

        code.remove();
        button.remove();
        document.getElementById("header").remove();

        const video = document.createElement("video");
        video.setAttribute("src", `${window.location.origin}/storage/video/secret.mp4`);
        video.setAttribute("width", "1280");
        video.setAttribute("height", "720");

        video.loop = true;
        video.autoplay = true;
        video.controls = false;
        container.appendChild(video);

        fetch("/api/session/promotions", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ number: 1 })
        });
    }
});