let temp_data = {};
let isQueue = false;
let is_join = false;
let isPlaying = false;
let index_loop = 0;
let isRotate = false;

const result = document.getElementById("result");
const search = document.getElementById("query");
const type = document.getElementById("type");
const queue = document.getElementById("queue");
const voice_channel = document.getElementById("voice_channel");
const disconnect = document.getElementById("disconnect");

fetch("/api/session/guilds", {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ guild_id: window.location.pathname.split("/")[3] })
})
.then(res => res.json())
.then(async res => {

    const guild = res.guild;
    for (let channel_id of guild.channels) {

        let channel = await fetch("/api/session/channels", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ channel_id: channel_id })
        })
        .then(res => res.json())
        .then(res => res.channel);

        if(channel.type === "GUILD_VOICE" || channel.type === "GUILD_STAGE_VOICE") {

            const option = document.createElement("option");
            option.value = channel.id;
            option.textContent = channel.name;
            voice_channel.appendChild(option);

        }

    }

});

function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    return (hrs > 0 ? (hrs < 10 ? "0"+hrs : hrs)+":" : "") + (mins < 10 ? "0"+mins : mins) + ':' + (secs < 10 ? "0"+secs : secs);
}

temp_data["query"] = "";
temp_data["type"] = `${type.value}`;
temp_data["voice_channel"] = "placeholder"

voice_channel.addEventListener("change", () => {
    temp_data["voice_channel"] = voice_channel.value;
});

type.addEventListener("change", () => {
    temp_data["type"] = type.value;
    console.log(temp_data);
});

/* Disconnect from voice channel */

disconnect.addEventListener("click", disconnect_channel);

function disconnect_channel() {
    fetch("/api/queue/connection/leave", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ guild_id: window.location.pathname.split("/")[3] })
    })
}

/* Search for track */

search.addEventListener("change", async() => {
    temp_data["query"] = search.value;
    let query = temp_data['query'];
    let type = temp_data['type'];
    let interval;

    if(result.children.length) {

        interval = setInterval(remove, 750);

        function remove() {
            for (let i = 0; i < result.children.length; i++) {
                const child = result.children[i];
                child.remove();
            }
        }

    }

    if(query.length) {

        let data = {
            query: query,
            type: type
        }

        let results = await fetch("/api/v1/search", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json());

        if(results.error) return;
        if(results.track.length) {

            for (let track of results.track.splice(0, 5)) {
                
                const song_container = document.createElement("div");
                song_container.setAttribute("class", "songs");

                const thumbnail = document.createElement("img");
                thumbnail.src = track.thumbnails[0].url;
                song_container.appendChild(thumbnail);

                const info_container = document.createElement("div");
                info_container.setAttribute("class", "info");

                const h1 = document.createElement("h1");
                h1.textContent = track.title.length > 15 ? `${track.title.substr(0, 15)}...` : track.title;
                info_container.appendChild(h1);

                const p = document.createElement("p");
                p.textContent = track.author.name.length > 12 ? `${track.author.name.substr(0, 12)}...` : track.author.name;
                info_container.appendChild(p);

                const button = document.createElement("button");
                button.setAttribute("class", "plus-btn-red");
                button.setAttribute("id", track.id);
                button.setAttribute("value", type);
                button.setAttribute("onclick", `add_queue('${track.id}');`)
                
                info_container.appendChild(button);
                song_container.appendChild(info_container)
                result.appendChild(song_container);

            }

            clearInterval(interval);

        } else {

            clearInterval(interval);

        }
    } else {

        clearInterval(interval);

    }
});

/* Checking query */

setInterval(() => {

    if(!temp_data['query'].length) {
        
        if(result.children.length) {

            for (let i = 0; i < result.children.length; i++) {
                const child = result.children[i];
                child.remove();
            }

        }

    }

}, 750);

/* Checking Queue & Connection */

setInterval(() => {

    let id = window.location.pathname.split("/")[3];
    fetch("/api/queue", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ guild_id: id })
    })
    .then(res => res.json())
    .then(res => {

        if(!res.isQueue) {

            isQueue = false;
            isPlaying = false;
            document.querySelector('.playpauseTrack').src = "/storage/image/play-button-icon-vector-illustration.png";

            for (let i = 0; i < queue.children.length; i++) {
                const child = queue.children[i];
                child.remove();
            }

        } else {

            isQueue = true;

            if(res.queue.loop.track && !res.queue.loop.queue) {

                index_loop = 3;
                document.querySelector(".loop").setAttribute("style", "opacity: 60%;");

            }

            if(!res.queue.loop.track && res.queue.loop.queue) {

                index_loop = 2;
                document.querySelector(".loop").setAttribute("style", "opacity: 80%;");

            }
            
            if(!res.queue.loop.track && !res.queue.loop.queue) {

                index_loop = 1;
                document.querySelector(".loop").setAttribute("style", "opacity: 100%;");

            }

            if(res.queue.playing) {
                isPlaying = true;
                document.querySelector('.playpauseTrack').src = "/storage/image/pause-circle-fill.svg";
            } else {
                isPlaying = false;
                document.querySelector('.playpauseTrack').src = "/storage/image/play-button-icon-vector-illustration.png";
            }

        }

    });

    fetch("/api/queue/connection", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ guild_id: id })
    })
    .then(res => res.json())
    .then(res => {

        if(res.is_join) {
            is_join = true;
            voice_channel.disabled = true;
            disconnect.disabled = false;
        }
        else {

            is_join = false;
            disconnect.disabled = true;
            voice_channel.disabled = false;

        }

    });

}, 750);

/* Add song to queue */

async function add_queue(id) {
    if(!is_join && temp_data["voice_channel"] === "placeholder") return alert("You must choose voice channel first!");

    let url = "";
    if(temp_data["type"] === "youtube") url += `https://youtube.com/watch?v=${id}`;
    if(temp_data["type"] === "spotify") url += `https://open.spotify.com/track/${id}`;

    let data = {
        guild_id: window.location.pathname.split("/")[3],
        track_url: url,
        voiceChannel_id: temp_data["voice_channel"]
    }

    fetch("/api/queue/manage", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {

        if(!document.querySelector(".current")) {

            let song = res[0];
            let current = document.createElement("div");
            current.setAttribute("class", "current");
    
            let h1 = document.createElement("h1");
            h1.textContent = "Current Playing";
            current.appendChild(h1);
    
            const playlist_container = document.createElement("div");
            playlist_container.setAttribute("class", "playlist-container current-track");
            playlist_container.id = song.request_id;
    
            const item_left = document.createElement("div");
            item_left.setAttribute("class", "item-left");
    
            const thumbnail = document.createElement("img");
            thumbnail.setAttribute("class", "playlist-img curr_track");
            thumbnail.src = song.thumbnails[0].url;
            
            item_left.appendChild(thumbnail);
            playlist_container.appendChild(item_left);
    
            const line1 = document.createElement("span");
            line1.setAttribute("class", "line");
            playlist_container.appendChild(line1);
    
            const item_middle = document.createElement("div");
            item_middle.setAttribute("class", "item-middle");
    
            const p1 = document.createElement("p");
            p1.setAttribute("class", "judul curr_track");
            p1.textContent = song.title.length > 20 ? `${song.title.substr(0, 20)}...` : song.title;
            
            item_middle.appendChild(p1);
            playlist_container.appendChild(item_middle);
    
            const line2 = document.createElement("span");
            line2.setAttribute("class", "line");
            playlist_container.appendChild(line2);
    
            const item_right = document.createElement("div");
            item_right.setAttribute("class", "item-right");
    
            const time = document.createElement("p");
            time.setAttribute("class", "time curr_track");
            time.textContent = msToTime(song.duration);
    
            item_right.appendChild(time);
            playlist_container.appendChild(item_right);
            current.appendChild(playlist_container);
            queue.appendChild(current);

        } else {

            let song = res[res.length - 1];
            let queue_songs;
            if(document.querySelector(".queue")) queue_songs = document.querySelector(".queue");
            else {
                queue_songs = document.createElement("div");
                queue_songs.setAttribute("class", "queue");
            }

            if(!document.querySelector(".queue-header")) {
                let h1 = document.createElement("h1");
                h1.setAttribute("class", "queue-header");
                h1.textContent = "Queue";
                queue_songs.appendChild(h1);
            }
    
    
            const playlist_container = document.createElement("div");
            playlist_container.setAttribute("class", "playlist-container");
            playlist_container.id = song.request_id;
    
            const item_left = document.createElement("div");
            item_left.setAttribute("class", "item-left");
    
            const thumbnail = document.createElement("img");
            thumbnail.setAttribute("class", "playlist-img");
            thumbnail.src = song.thumbnails[0].url;
            
            item_left.appendChild(thumbnail);
            playlist_container.appendChild(item_left);
    
            const line1 = document.createElement("span");
            line1.setAttribute("class", "line");
            playlist_container.appendChild(line1);
    
            const item_middle = document.createElement("div");
            item_middle.setAttribute("class", "item-middle");
    
            const p1 = document.createElement("p");
            p1.setAttribute("class", "judul");
            p1.textContent = song.title.length > 20 ? `${song.title.substr(0, 20)}...` : song.title;
            
            item_middle.appendChild(p1);
            playlist_container.appendChild(item_middle);
    
            const line2 = document.createElement("span");
            line2.setAttribute("class", "line");
            playlist_container.appendChild(line2);
    
            const item_right = document.createElement("div");
            item_right.setAttribute("class", "item-right");
    
            const time = document.createElement("p");
            time.setAttribute("class", "time");
            time.textContent = msToTime(song.duration);
            
            item_right.appendChild(time);
            playlist_container.appendChild(item_right);

            const delete_container = document.createElement("div");
            delete_container.setAttribute("class", "delete");

            const button = document.createElement("button");
            button.setAttribute("class", "delete-btn");
            button.setAttribute("onclick", `remove_queue('${song.request_id}');`);
            button.id = song.request_id;
            button.type = "button";

            delete_container.appendChild(button);
            playlist_container.appendChild(delete_container);

            queue_songs.appendChild(playlist_container);
            queue.appendChild(queue_songs);

        }

    });

}

/* Remove song */

function remove_queue(id) {

    fetch(`/api/queue/remove/${id}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ guild_id: window.location.pathname.split("/")[3] })
    })
    .then(res => res.json())
    .then(res => {

        let playlists = document.querySelectorAll('.playlist-container');
        playlists.item(res.index).remove();
        if(res.queue.length == 1) document.querySelector(".queue").remove();
        
    });
}

/* Automatic change queue */

setInterval(() => {

    let data = {
        guild_id: window.location.pathname.split("/")[3]
    }

    fetch("/api/queue", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {

        if(res.isQueue) {

            let serverQueue = res.queue;
            if(!document.querySelector(".current")) {

                let song = serverQueue.songs[0];
                let current = document.createElement("div");
                current.setAttribute("class", "current");
        
                let h1 = document.createElement("h1");
                h1.textContent = "Current Playing";
                current.appendChild(h1);
        
                const playlist_container = document.createElement("div");
                playlist_container.setAttribute("class", "playlist-container current-track");
                playlist_container.id = song.request_id;
        
                const item_left = document.createElement("div");
                item_left.setAttribute("class", "item-left");
        
                const thumbnail = document.createElement("img");
                thumbnail.setAttribute("class", "playlist-img curr_track");
                thumbnail.src = song.thumbnails[0].url;
                
                item_left.appendChild(thumbnail);
                playlist_container.appendChild(item_left);
        
                const line1 = document.createElement("span");
                line1.setAttribute("class", "line");
                playlist_container.appendChild(line1);
        
                const item_middle = document.createElement("div");
                item_middle.setAttribute("class", "item-middle");
        
                const p1 = document.createElement("p");
                p1.setAttribute("class", "judul curr_track");
                p1.textContent = song.title.length > 20 ? `${song.title.substr(0, 20)}...` : song.title;
                
                item_middle.appendChild(p1);
                playlist_container.appendChild(item_middle);
        
                const line2 = document.createElement("span");
                line2.setAttribute("class", "line");
                playlist_container.appendChild(line2);
        
                const item_right = document.createElement("div");
                item_right.setAttribute("class", "item-right");
        
                const time = document.createElement("p");
                time.setAttribute("class", "time curr_track");
                time.textContent = msToTime(song.duration);
        
                item_right.appendChild(time);
                playlist_container.appendChild(item_right);
                current.appendChild(playlist_container);
                queue.appendChild(current);

            }

            if(serverQueue.songs.length > document.querySelectorAll(".playlist-container").length && document.querySelectorAll(".playlist-container").length > 1) {

                let song = serverQueue.songs[serverQueue.songs.length - 1];
                let queue_songs;
                if(document.querySelector(".queue")) queue_songs = document.querySelector(".queue");
                else {
                    queue_songs = document.createElement("div");
                    queue_songs.setAttribute("class", "queue");
                }
    
                if(!document.querySelector(".queue-header")) {
                    let h1 = document.createElement("h1");
                    h1.setAttribute("class", "queue-header");
                    h1.textContent = "Queue";
                    queue_songs.appendChild(h1);
                }
        
        
                const playlist_container = document.createElement("div");
                playlist_container.setAttribute("class", "playlist-container");
                playlist_container.id = song.request_id;
        
                const item_left = document.createElement("div");
                item_left.setAttribute("class", "item-left");
        
                const thumbnail = document.createElement("img");
                thumbnail.setAttribute("class", "playlist-img");
                thumbnail.src = song.thumbnails[0].url;
                
                item_left.appendChild(thumbnail);
                playlist_container.appendChild(item_left);
        
                const line1 = document.createElement("span");
                line1.setAttribute("class", "line");
                playlist_container.appendChild(line1);
        
                const item_middle = document.createElement("div");
                item_middle.setAttribute("class", "item-middle");
        
                const p1 = document.createElement("p");
                p1.setAttribute("class", "judul");
                p1.textContent = song.title.length > 20 ? `${song.title.substr(0, 20)}...` : song.title;
                
                item_middle.appendChild(p1);
                playlist_container.appendChild(item_middle);
        
                const line2 = document.createElement("span");
                line2.setAttribute("class", "line");
                playlist_container.appendChild(line2);
        
                const item_right = document.createElement("div");
                item_right.setAttribute("class", "item-right");
        
                const time = document.createElement("p");
                time.setAttribute("class", "time");
                time.textContent = msToTime(song.duration);
                
                item_right.appendChild(time);
                playlist_container.appendChild(item_right);
    
                const delete_container = document.createElement("div");
                delete_container.setAttribute("class", "delete");
    
                const button = document.createElement("button");
                button.setAttribute("class", "delete-btn");
                button.setAttribute("onclick", `remove_queue('${song.request_id}');`);
                button.id = song.request_id;
                button.type = "button";
    
                delete_container.appendChild(button);
                playlist_container.appendChild(delete_container);
    
                queue_songs.appendChild(playlist_container);
                queue.appendChild(queue_songs);

            }

            if(serverQueue.loop.track && !serverQueue.loop.queue) return;
            else {

                let curr_track = serverQueue.songs[0];
                let last_track = document.querySelector(".current-track");
                let playlists = document.querySelectorAll(".playlist-container");
    
                if(curr_track.request_id !== last_track.id) {
    
                    last_track.id = curr_track.request_id;
    
                    const elements = document.querySelectorAll(".curr_track");
                    elements[0].src = curr_track.thumbnails[0].url;
                    elements[1].textContent = curr_track.title.length > 20 ? `${curr_track.title.substr(0, 20)}...` : curr_track.title;
                    elements[2].textContent = msToTime(curr_track.duration);

                    if(document.querySelectorAll(".playlist-container").length > 1) {

                        let playlist_container = document.querySelectorAll(".playlist-container");
                        for (let i = 1; i < serverQueue.songs.length; i++) {

                            let song = serverQueue.songs[i];
                            let playlist = playlist_container[i];

                            playlist.children[0].children[0].src = song.thumbnails[0].url;
                            playlist.children[2].children[0].textContent = song.title.length > 20 ? `${song.title.substr(0, 20)}...` : song.title;
                            playlist.children[4].children[0].textContent = msToTime(song.duration);
                            playlist.children[5].children[0].id = song.request_id;
                    
                        }

                        if(playlist_container.length > serverQueue.songs.length) {

                            let index_queue = (playlist_container.length - (playlist_container.length - serverQueue.songs.length));
                            for (let index = index_queue; index < playlist_container.length; index++) {
                                playlist_container[index].remove();
                            }

                        }

                    } else {

                        const queue_container = document.querySelector('.queue');
                        queue_container.remove();

                    }
    
                }

                if(playlists.length == 1) {
                    if(document.querySelector('.queue')) document.querySelector('.queue').remove();
                }

            }
        } else {

            for (let i = 0; i < queue.children.length; i++) {
                const child = queue.children[i];
                child.remove();
            }

        }

    });

}, 750);

const popup_container = document.getElementById("popup");
const playlist = document.getElementById("playlist");
playlist.addEventListener("click", popup);

function popup() {
    playlist.disabled = true;
    popup_container.setAttribute("class", "popup");
    tl.fromTo(".popup", { opacity: 0 }, { opacity: 1 });
    
    let box = document.createElement("div");
    box.setAttribute("class", "popup-content popup-box");

    let h1 = document.createElement("h1");
    h1.setAttribute("class", "popup-content");
    h1.textContent = "Add Playlist to Queue...";
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
    if(!is_join && temp_data["voice_channel"] === "placeholder") return alert("You must choose voice channel first!");

    let data = {
        guild_id: window.location.pathname.split("/")[3],
        voiceChannel_id: temp_data['voice_channel']
    }

    fetch(`/api/queue/playlist/${playlist_id}/add`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(() => {

        const box = document.querySelector(".popup-box");
        const popup_container = document.getElementById("popup");

        playlist.disabled = false;
        tl.fromTo(".popup-box", { scale: 1 }, { scale: 0 });

        setTimeout(() => {

            box.remove();
            tl.fromTo(".popup", { opacity: 1 }, { opacity: 0 });

            setTimeout(() => {

                alert(`Successfully add all tracks!`);
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