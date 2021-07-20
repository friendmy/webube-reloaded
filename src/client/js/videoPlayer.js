const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

console.log(videoContainer.dataset);

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
    // if hte video is playing, pause it
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    //playBtn.innerText = video.paused ? "Play" : "Pause";
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
    // else play the video
};
const handleMute = (e) => {
    if (video.muted) {
        video.muted = false;
    } else {
        volumeValue = volumeRange.value;
        video.muted = true;
    }
    //muteBtn.innerText = video.muted ? "Unmute" : "Mute";
    muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
    volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (e) => {
    const {
        target: { value },
    } = e;
    if (video.muted) {
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
    volumeValue = value;
    video.volumeValue = value;
};

const formatTime = (seconds) => {
    //new Date(seconds * 1000).toISOString().substr(11, 8);
    return new Date(seconds * 1000).toISOString().substr(14, 5);
};

const handleLoadedMetadata = (e) => {
    //console.log(totalTime);
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = (e) => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
};

const handleTimeLineChange = (e) => {
    const {
        target: { value },
    } = e;
    video.currentTime = value;
};

const handleFullScreen = (e) => {
    const fullscreen = document.fullscreenElement;
    if (fullscreen) {
        document.exitFullscreen();
        //fullScreenBtn.innerText = "Enter Full Screen";
        fullScreenIcon.classList = "fas fa-expand";
    } else {
        videoContainer.requestFullscreen();
        //fullScreenBtn.innerText = "Exit Full Screen";
        fullScreenIcon.classList = "fas fa-compress";
    }
};

const hideControls = () => {
    videoControls.classList.remove("showing");
};

const handleMouseMove = () => {
    //console.log("handleMouseMove");
    //console.log(controlsTimeout);
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if (controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    controlsMovementTimeout = videoControls.classList.add("showing");
    setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
    //console.log("handleMouseLeave");
    controlsTimeout = setTimeout(hideControls, 3000);
};

const handleVideoClick = (e) => {
    console.log("handleVideoClick");
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
};

const handleEnded = () => {
    const { id } = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`, { method: "POST" });
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
//video.addEventListener("loadeddata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);

videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimeLineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
//video.addEventListener("click", handleVideoClick);
