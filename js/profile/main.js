const discordConnect = document.getElementById("discord-connect");
if(discordConnect) {
    discordConnect.addEventListener("click", () => {
        window.location = "/login/connection/discord";
    });
}

const discordDisconnect = document.getElementById("discord-disconnect");
if(discordDisconnect) {
    discordDisconnect.addEventListener("click", () => {
        window.location = "/login/connection/discord/disconnect";
    });
}

const spotifyConnect = document.getElementById("spotify-connect");
if(spotifyConnect) {
    spotifyConnect.addEventListener("click", () => {
        window.location = "/login/connection/spotify";
    });
}

const spotifyDisconnect = document.getElementById("spotify-disconnect");
if(spotifyDisconnect) {
    spotifyDisconnect.addEventListener("click", () => {
        window.location = "/login/connection/spotify/disconnect";
    });
}

const playlist = document.getElementById("playlist");
playlist.addEventListener("click", () => {
    window.location = "/me/playlist";
});

const edit = document.getElementById("edit");
edit.addEventListener("click", () => {
    window.location = "/me/settings";
});

const manage = document.getElementById("manage-server");
manage.addEventListener("click", () => {
    window.location = "/me/servers";
});