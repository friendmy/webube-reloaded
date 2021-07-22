"use strict";

var _ffmpeg = require("@ffmpeg/ffmpeg");

var actionBtn = document.getElementById("actionBtn");
var video = document.getElementById("preview");
var stream;
var recorder;
var videoFile;
var files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg"
};

var downloadFile = function downloadFile(fileUrl, fileName) {
  var a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

var handleDownload = function handleDownload() {
  var ffmpeg, mp4File, thumbFile, mp4Blob, thumbBlob, mp4Url, thumbUrl;
  return regeneratorRuntime.async(function handleDownload$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          actionBtn.removeEventListener("click", handleDownload);
          actionBtn.innerText = "Transcoding...";
          actionBtn.disabled = true;
          ffmpeg = (0, _ffmpeg.createFFmpeg)({
            corePath: "/static/ffmpeg-core.js",
            log: true
          });
          _context.next = 6;
          return regeneratorRuntime.awrap(ffmpeg.load());

        case 6:
          _context.t0 = ffmpeg;
          _context.t1 = files.input;
          _context.next = 10;
          return regeneratorRuntime.awrap((0, _ffmpeg.fetchFile)(videoFile));

        case 10:
          _context.t2 = _context.sent;

          _context.t0.FS.call(_context.t0, "writeFile", _context.t1, _context.t2);

          _context.next = 14;
          return regeneratorRuntime.awrap(ffmpeg.run("-i", files.input, "-r", "60", files.output));

        case 14:
          _context.next = 16;
          return regeneratorRuntime.awrap(ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumb));

        case 16:
          mp4File = ffmpeg.FS("readFile", files.output);
          thumbFile = ffmpeg.FS("readFile", files.thumb);
          mp4Blob = new Blob([mp4File.buffer], {
            type: "video/mp4"
          });
          thumbBlob = new Blob([thumbFile.buffer], {
            type: "image/jpg"
          });
          mp4Url = URL.createObjectURL(mp4Blob);
          thumbUrl = URL.createObjectURL(thumbBlob);
          downloadFile(mp4Url, "MyRecording.mp4");
          downloadFile(thumbUrl, "MyThumbnail.jpg");
          ffmpeg.FS("unlink", files.input);
          ffmpeg.FS("unlink", files.output);
          ffmpeg.FS("unlink", files.thumb);
          URL.revokeObjectURL(mp4Url);
          URL.revokeObjectURL(thumbUrl);
          URL.revokeObjectURL(videoFile);
          actionBtn.disabled = false;
          actionBtn.innerText = "Record Again";
          actionBtn.addEventListener("click", handleStart);

        case 33:
        case "end":
          return _context.stop();
      }
    }
  });
};

var handleStart = function handleStart() {
  actionBtn.innerText = "Recording";
  actionBtn.disabled = true;
  actionBtn.removeEventListener("click", handleStart);
  recorder = new MediaRecorder(stream, {
    mimeType: "video/webm"
  });

  recorder.ondataavailable = function (event) {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
    actionBtn.innerText = "Download";
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handleDownload);
  };

  recorder.start();
  setTimeout(function () {
    recorder.stop();
  }, 5000);
};

var init = function init() {
  return regeneratorRuntime.async(function init$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              width: 1024,
              height: 576
            }
          }));

        case 2:
          stream = _context2.sent;
          video.srcObject = stream;
          video.play();

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
};

init();
actionBtn.addEventListener("click", handleStart);