"use strict";

var _require = require("node-fetch"),
    Body = _require.Body;

var startBtn = document.getElementById("startBtn");
var video = document.getElementById("preview");
var stream;
var recorder;
var videoFile;

var handleDownload = function handleDownload() {
  var a = document.createElement("a");
  a.href = videoFile;
  a.download = "MyRecording.webm";
  document.body.appendChild(a);
  a.click();
};

var handleStop = function handleStop() {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);
  recorder.stop();
};

var handleStart = function handleStart() {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);
  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = function (event) {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.play();
  };

  recorder.start();
};

var init = function init() {
  return regeneratorRuntime.async(function init$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true
          }));

        case 2:
          stream = _context.sent;
          video.srcObject = stream;
          video.play();

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};

init();
startBtn.addEventListener("click", handleStart);