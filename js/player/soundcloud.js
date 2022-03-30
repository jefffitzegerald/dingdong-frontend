const playpauseTrack_button = document.querySelector(".playpauseTrack");
const loop = document.querySelector(".loop");

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

  playpauseTrack_button.src = `${window.location.origin}/storage/image/pause-circle-fill.svg`;
  updateTimer = setInterval(seekUpdate, 750);
  rotateAnimation("image-player", 50);
}

autoPlay();

let src = audio.src;
audio.src = src;

audio.addEventListener("ended", () => {
  isPlaying = false;

  slider.value = 0;
  durationTime.textContent = "00:00";
  audio.currentTime = 0;

  playpauseTrack_button.src = `${window.location.origin}/storage/image/play-button-icon-vector-illustration.png`;
  clearInterval(updateTimer);
  updateTimer = null;
});

audio.addEventListener("pause", () => {
  isPlaying = false;
  playpauseTrack_button.src = `${window.location.origin}/storage/image/play-button-icon-vector-illustration.png`;
});

audio.addEventListener("play", () => {
  isPlaying = true;
  playpauseTrack_button.src = `${window.location.origin}/storage/image/pause-circle-fill.svg`;
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