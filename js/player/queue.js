/* Player Control */

const loop = document.querySelector(".loop");
const play_pause = document.querySelector(".playpauseTrack");
const previous = document.querySelector(".previous");
const next = document.querySelector(".next");

const progress = document.getElementById("progress");
const seek = document.querySelector(".duration-time");
const full_duration = document.querySelector(".full-duration");  
const volume = document.getElementById("volume");

loop.addEventListener("click", loop_schema);
play_pause.addEventListener("click", playpauseTrack);
previous.addEventListener("click", previous_schema);
next.addEventListener("click", next_schema)
volume.addEventListener("change", setVolume);

async function setVolume() {

    if(!isQueue) return;
    let volume_change = volume.value;

    await fetch("/api/queue/volume", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ guild_id: window.location.pathname.split("/")[3], value: volume_change })
    });

}

async function loop_schema() {
    if(!isQueue) return;

    if(index_loop == 3) index_loop = 1;
    else index_loop += 1;

    let type = "";
    if(index_loop == 1) {

        type += "off";
        loop.setAttribute("style", "opacity: 100%;");

    }
    if(index_loop == 2) {

        type += "queue";
        loop.setAttribute("style", "opacity: 80%;");

    }
    if(index_loop == 3) {

        type += "track";
        loop.setAttribute("style", "opacity: 60%;");

    }

    await fetch("/api/queue/loop", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ guild_id: window.location.pathname.split("/")[3], type })
    });
}

function playpauseTrack() {
    if(!isQueue) return;
    if(isPlaying) pauseTrack();
    else playTrack();
}

async function playTrack() {
    isPlaying = true;
    play_pause.setAttribute("src", "/storage/image/pause-circle-fill.svg");
    await fetch("/api/queue/resume", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ guild_id: window.location.pathname.split("/")[3] })
    });

}

async function pauseTrack() {
    isPlaying = false
    play_pause.setAttribute("src", "/storage/image/play-button-icon-vector-illustration.png");
    await fetch("/api/queue/pause", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ guild_id: window.location.pathname.split("/")[3] })
    });

}

async function previous_schema() {
    if(index_loop !== 2) return;

    await fetch("/api/queue/prev", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ guild_id: window.location.pathname.split("/")[3] })
    });
}

async function next_schema() {
    if(index_loop == 3) return;
    await fetch("/api/queue/skip", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ guild_id: window.location.pathname.split("/")[3] })
    });
}


async function seekTo() {
    let playback = await fetch("/api/queue/playback", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ guild_id: window.location.pathname.split("/")[3] })
    })
    .then(res => res.json());
    if(playback.resource) {

        let seekto_number = playback.duration * (progress.value / 100);
        fetch("/api/queue/playback/set", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ guild_id: window.location.pathname.split("/")[3], value: seekto_number })
        });

    }
}

setInterval(() => {

    if(isQueue) {

        fetch("/api/queue/playback", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ guild_id: window.location.pathname.split("/")[3] })
        })
        .then(res => res.json())
        .then(res => {

            if(res.resource) {

                let seekPosition = 0;
                let { duration, current_time } = res;
                
                seekPosition = current_time * (100 / duration);
                progress.value = seekPosition;
                seek.textContent = msToTime(current_time);
                full_duration.textContent = msToTime(duration);

            } else {

                let duration = res.duration
                full_duration.textContent = msToTime(duration);

            }
            
        });

    } else {

        progress.value = 0;
        seek.textContent = "00:00";
        full_duration.textContent = "00:00";

    }

}, 750);