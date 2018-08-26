
const childProcess = require('child_process')
const VideoConverter = require("./VideoConverter.js")
const path = require('path')

// Create video converter
const videoConverter = new VideoConverter()

const originalFilePath = __dirname + "/../assets/video/original.mp4"
const overlayFilePath = __dirname + "/../assets/video/overlay.mov"
const overlayNoAudioFilePath = __dirname + "/../assets/video/overlay_no_audio.mov"
const webmFilePath = __dirname + "/../assets/video/convert.webm"

const mergeFilePaths = []
for(let i = 0; i < 5; i++) {
  const path = __dirname + '/../assets/video/video0' + i +  '.mp4'
  mergeFilePaths.push(path)
}

videoConverter.on("complete", onVideoConverterComplete);

// NOTE: These are tests command
//       Comment out one by one
// videoConverter.merge(mergeFilePaths);
// videoConverter.resize(originalFilePath, 1280, 720);
// videoConverter.hflip(originalFilePath);
// videoConverter.overlay(originalFilePath, overlayFilePath);
videoConverter.overlayWithNoAudio(originalFilePath, overlayNoAudioFilePath);
// videoConverter.webm2mp4(webmFilePath);

/*
  Callback from VideoConverter
  @param folderName : saved folder name
  @param command : execute command name
*/
function onVideoConverterComplete() {
  console.log("onVideoConverterComplete");
}
