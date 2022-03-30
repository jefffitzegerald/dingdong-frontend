const video = document.getElementById("frame");
const playpause_track = document.querySelector(".playpauseTrack");
const durationTime = document.querySelector(".duration-time");
const total_duration = document.querySelector(".total-duration");
const slider = document.getElementById("progress");
const volume = document.getElementById("volume");

let isPlaying = true;
let updateTimer = setInterval(seekUpdate, 500);

let src = video.src;
video.src = src;

slider.addEventListener("change", seekTo);
volume.addEventListener("change", setVolume);

playpause_track.addEventListener("click", playpauseTrack);
video.addEventListener("ended", () => {

    isPlaying = false;
    playpause_track.src = `${window.location.origin}/storage/image/play-button-icon-vector-illustration.png`;

    // Update slider
    durationTime.textContent = "00:00";
    slider.value = 0;

    clearInterval(updateTimer);
    updateTimer = null;

});

video.addEventListener("pause", () => {
    isPlaying = false;
    playpause_track.src = `${window.location.origin}/storage/image/play-button-icon-vector-illustration.png`;
});
  
video.addEventListener("play", () => {
    isPlaying = true;
    playpause_track.src = `${window.location.origin}/storage/image/pause-circle-fill.svg`;
});

function playpauseTrack() {
    if(!updateTimer) updateTimer = setInterval(seekUpdate, 500);
    if(isPlaying) video.pause();
    else video.play();
}

function seekUpdate() {
    let seekPosition = 0;
  
    // Check if the current track duration is a legible number
    if (!isNaN(video.duration)) {
        seekPosition = video.currentTime * (100 / video.duration);
        slider.value = seekPosition;
    
        // Calculate the time left and the total duration
        let currentMinutes = Math.floor(video.currentTime / 60);
        let currentSeconds = Math.floor(video.currentTime - currentMinutes * 60);
    
        // Add a zero to the single digit time values
        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    
        // Display the updated duration
        durationTime.textContent = currentMinutes + ":" + currentSeconds;
    }
}

function seekTo() {
  let seekto = video.duration * (slider.value / 100);
  video.currentTime = seekto;
}
  
function setVolume() {
    video.volume = volume.value / 100;
}

function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    return (hrs > 0 ? (hrs < 10 ? "0"+hrs : hrs)+":" : "") + (mins < 10 ? "0"+mins : mins) + ':' + (secs < 10 ? "0"+secs : secs);
}

function openFullscreen() {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) { /* Safari */
        video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) { /* IE11 */
        video.msRequestFullscreen();
    }
}