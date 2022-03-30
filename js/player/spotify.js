const playpauseTrack_button = document.querySelector(".playpauseTrack");
const previous = document.querySelector(".previous");
const next = document.querySelector(".next");

let volume = document.getElementById("volume");
let slider = document.getElementById("progress");
let durationTime = document.querySelector(".duration-time");

let audio = document.getElementById("audio");
let isBlock = false;
let isPlaying = false;
let updateTimer; 

let looper;
let degrees = 0;

function autoPlay() {
  isPlaying = true;
  audio.autoplay = true;

  playpauseTrack_button.src = "/storage/image/pause-circle-fill.svg";
  updateTimer = setInterval(seekUpdate, 750);
  rotateAnimation("image-player", 50);
}

autoPlay();

let src = audio.src;
audio.src = src;

audio.addEventListener("ended" , () => {
  isPlaying = false;

  slider.value = 0;
  durationTime.textContent = "00:00";
  audio.currentTime = 0;

  playpauseTrack_button.src = "/storage/image/play-button-icon-vector-illustration.png";
  clearInterval(updateTimer);
  updateTimer = null;
});

audio.addEventListener("pause", () => {
  isPlaying = false;
  playpauseTrack_button.src = "/storage/image/play-button-icon-vector-illustration.png";
});

audio.addEventListener("play", () => {
  isPlaying = true;
  playpauseTrack_button.src = "/storage/image/pause-circle-fill.svg";
  rotateAnimation("image-player", 50);
});

function seekTo() {
  let seekto = audio.duration * (slider.value / 100);
  audio.currentTime = seekto;
}
  
function setVolume() {
  audio.volume = volume.value / 100;
}
  
function seekUpdate() {
  let seekPosition = 0;
  
  // Check if the current track duration is a legible number
  if (!isNaN(audio.duration)) {
    seekPosition = audio.currentTime * (100 / audio.duration);
    slider.value = seekPosition;
  
    // Calculate the time left and the total duration
    let currentMinutes = Math.floor(audio.currentTime / 60);
    let currentSeconds = Math.floor(audio.currentTime - currentMinutes * 60);
  
    // Add a zero to the single digit time values
    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
  
    // Display the updated duration
    durationTime.textContent = currentMinutes + ":" + currentSeconds;
  }
}

function playpauseTrack() {
  if(!updateTimer) updateTimer = setInterval(seekUpdate, 750);
  if (!isPlaying) audio.play();
  else audio.pause();
}

function nextTrack() {

    let id = window.location.pathname.split("/")[2];
    let data = {
        type: "track",
        id: id
    }
    fetch("/api/v1/spotify", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {

        let tracks = res.track.albums.tracks;
        if((index + 1) == tracks.length) {

          let track = tracks[0];
          window.location = `/spotify/${track.id}`;

        } else {

          let track = tracks[index + 1];
          window.location = `/spotify/${track.id}`;

        }

    });

}

function prevTrack() {

    let id = window.location.pathname.split("/")[2];
    let data = {
        type: "track",
        id: id
    }
    fetch("/api/v1/spotify", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {

        let tracks = res.track.albums.tracks;
        if(index == 0) {

          let track = tracks[tracks.length - 1];
          window.location = `/spotify/${track.id}`;

        } else {

          let track = tracks[index - 1];
          window.location = `/spotify/${track.id}`;

        }

    });

}

function rotateAnimation(el,speed){
  if(!isPlaying) return;

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

volume.addEventListener("change", setVolume);
slider.addEventListener("change", seekTo);

playpauseTrack_button.addEventListener("click", playpauseTrack);
next.addEventListener("click", nextTrack);
previous.addEventListener("click", prevTrack);

let json_track = {
  type: "track",
  id: window.location.pathname.split("/")[2]
}
fetch("/api/v1/spotify", {
  method: "POST",
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(json_track)
})
.then(res => res.json())
.then(res => {

  let album_tracks = res.track.albums.tracks;
  let index = album_tracks.map(i => { return i.id }).indexOf(window.location.pathname.split("/")[2]);
  let songs_container = document.querySelectorAll(".song-title");

  songs_container[index].classList.add("current-song");
  songs_container[index].setAttribute("style", "background-color: #332828;");

});

let album_songs = document.querySelectorAll(".song-title");
for (let i = 0; i < album_songs.length; i++) {
  const song = album_songs[i];
  if(song.id !== window.location.pathname.split("/")[2]) {

    song.addEventListener("click", () => {
      window.location = `/spotify/${song.id}`;
    });

  }
}