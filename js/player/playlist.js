let index = 0;
let isLoad = false;
let updateTimer;

let isRotate = false;
let isPlaying = false;
let isShuffle = false;
let isLoop = false;

const audio = document.getElementById("audio");
const playpauseButton = document.querySelector(".playpauseTrack");
const playpauseButton_2 = document.querySelector(".play-btn");
const loop_control = document.querySelector(".loop");
const shuffle = document.querySelector(".shuffle");

const skip_control = document.querySelector(".next");
const prev_control = document.querySelector(".previous");
const imagePlayer = document.getElementById("image-player");

const durationTime = document.querySelector(".duration-time");
const durationTotal = document.querySelector(".duration-total");
const slider_bar = document.getElementById("progress");
const volume = document.getElementById("volume");

playpauseButton.addEventListener("click", playpauseTrack);
playpauseButton_2.addEventListener("click", playpauseTrack);
loop_control.addEventListener("click", loopTrack);
shuffle.addEventListener("click", shuffleTrack);

skip_control.addEventListener("click", nextTrack);
prev_control.addEventListener("click", prevTrack);

slider_bar.addEventListener("change", seekTo);
volume.addEventListener("change", setVolume);

async function playpauseTrack() {
    if(!isLoad) {

        isPlaying = true;
        return await loadTrack(index);

    }

    if(isPlaying) pauseTrack();
    else playTrack();
}

async function loadTrack(track_index) {

    let data = await fetch("/api/playlist/start", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: window.location.pathname.split("/")[3] })
    }).then(res => res.json());

    if(!data.items.length) return;
    for (let i = 0; i < data.items.length; i++) {
        const item = data.items[i];
        tracks.push(item);
    }

    let songs = data.items;
    for (let i = songs.length - 1; i > 0; i--) {
      let j = 0 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    
    for (let i = 0; i < songs.length; i++) {
        let song = songs[i];
        shuffle_array.push(song);
    }

    let track = null;
    if(isShuffle) track = shuffle_array[track_index];
    else track = tracks[track_index];

    imagePlayer.src = track.track.thumbnails[0].url;

    let stream = await fetch("/api/playlist/download", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: track.track.url, request_id: track.request_id })
    }).then(res => res.json());

    isLoad = true;
    setTimeout(() => {

        audio.src = `${window.location.origin}/${stream.path}/${stream.filename}`;
        audio.load();
        if(isPlaying) playTrack();

    }, 2000);

}

function seekTo() {
    let seekto = audio.duration * (slider_bar.value / 100);
    audio.currentTime = seekto;
}
  
function setVolume() {
    audio.volume = volume.value / 100;
}
  
function seekUpdate() {
    let seekPosition = 0;
    
    if (!isNaN(audio.duration)) {
        seekPosition = audio.currentTime * (100 / audio.duration);
        slider_bar.value = seekPosition;
    
        let currentMinutes = Math.floor(audio.currentTime / 60);
        let currentSeconds = Math.floor(audio.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(audio.duration / 60);
        let durationSeconds = Math.floor(audio.duration - durationMinutes * 60);
    
        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
        if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }
    
        durationTime.textContent = currentMinutes + ":" + currentSeconds;
        durationTotal.textContent = durationMinutes + ":" + durationSeconds;
    }
}

function loopTrack() {

    if(isLoop) {

        isLoop = false;
        loop_control.setAttribute("style", "opacity: 100%;");

    } else {

        isLoop = true;
        loop_control.setAttribute("style", "opacity: 85%;");

    }

}

function shuffleTrack() {

    if(isShuffle) {

        isShuffle = false;
        shuffle.setAttribute("style", "opacity: 100%;");

    } else {

        isShuffle = true;
        shuffle.setAttribute("style", "opacity: 85%;");

    }

}

async function nextTrack() {

    if(index == (tracks.length - 1)) index = 0;
    else index += 1;
    
    await loadTrack(index);

}

async function prevTrack() {

    if(index == 0) index = (tracks.length - 1);
    else index -= 1;

    await loadTrack(index);

}


const playTrack = () => audio.play();
const pauseTrack = () => audio.pause();

audio.addEventListener("play", () => {
    
    isPlaying = true;
    if(!updateTimer) updateTimer = setInterval(seekUpdate, 750);

    playpauseButton.src = `${window.location.origin}/storage/image/pause-circle-fill.svg`;
    playpauseButton_2.setAttribute("style", "background-image: url('/storage/image/pause.png');");
    if(!isRotate) rotateAnimation("image-player", 50);

});

audio.addEventListener("pause", () => {

    isPlaying = false;
    isRotate = false;

    playpauseButton.src = `${window.location.origin}/storage/image/play-button-icon-vector-illustration.png`;
    playpauseButton_2.setAttribute("style", "background-image: url('/storage/image/play.png');");

});

audio.addEventListener("ended", async() => {

    let prev_index = index;
    if(index == (tracks.length - 1)) index = 0;
    else index += 1;

    if(prev_index == (tracks.length - 1)) {

        if(isLoop) {

            isPlaying = true;
            await loadTrack(index);

        }
        else {

            isPlaying = false;
            await loadTrack(index);

        }

    } else {

        isPlaying = true;
        await loadTrack(index);

    }
});

let looper;
let degrees = 0;

function rotateAnimation(el,speed){
    if(!isPlaying) return;
    if(!isRotate) isRotate = true;

	var elem = document.getElementById(el);
	if(navigator.userAgent.match("Chrome")){
		elem.style.WebkitTransform = "rotate("+degrees+"deg)";
	} else if(navigator.userAgent.match("Firefox")){
		elem.style.MozTransform = "rotate("+degrees+"deg)";
	} else if(navigator.userAgent.match("MSIE")){
		elem.style.msTransform = "rotate("+degrees+"deg)";
	} else if(navigator.userAgent.match("Opera")){
		elem.style.OTransform = "rotate("+degrees+"deg)";
	} else {
		elem.style.transform = "rotate("+degrees+"deg)";
	}
	looper = setTimeout('rotateAnimation(\''+el+'\','+speed+')',speed);
	degrees++;
	if(degrees > 359){
		degrees = 1;
	}
}
