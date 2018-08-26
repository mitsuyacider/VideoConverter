const EventEmitter = require('events')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')

module.exports = class VideoConverter extends EventEmitter {
  constructor(request) {
    super()
  }

  /*
    NOTE: concat video files in order
    @param filePaths : video file paths

  */
  merge(filePaths) {
    const srcFolderPath = path.dirname(filePaths[0])
    const dstFilePath = path.join(srcFolderPath + '/merged.mp4')

    // ffmpeg -i video00.webm -i video01.webm -filter_complex "concat=n=2:v=1:a=1" output.mov
    // NOTE: progress event does not work in this command
    //       Because it cannot get the persentage from the progress callback.
    const command = ffmpeg()
    for (let i = 0; i < filePaths.length; i++) {
      const file = filePaths[i];
      command.input(file)
    }

    const option = ["-filter_complex", 'concat=n=' + filePaths.length + ':v=1:a=1', '-r','24']
    this.executeCommand(command, option, dstFilePath)
  }

  /*
    NOTE: Resize video
    @param filePath : original video file
    @param  w       : width
    @param  h       : height
  */
  resize(filePath, w, h) {
    const srcFolderPath = path.dirname(filePath)
    const dstFilePath = path.join(srcFolderPath, "resized.mov")
    const command = ffmpeg()
    const option = ["-vf", "scale=" + w + ":" + h]

    command.input(filePath)
    this.executeCommand(command, option, dstFilePath)
  }

  /*
    NOTE: Overlay video on a original video
    @param filePath  : original file path
    @param filePath2 : overlay file path
    ※ should use the overlay file with mov because mp4 does not support alpha channel
  */
  overlay(filePath, filePath2) {
    const srcFolderPath = path.dirname(filePath)
    const srcFilePath = filePath
    const overlayFilePath = filePath2
    const dstFilePath = path.join(srcFolderPath, "overlay.mp4")
    const command = ffmpeg()
    const option = ["-filter_complex", "overlay", "-map", "0:0", "-map", "0:1", "-map", "1:0", "-map", "1:1", "-filter_complex", "[0:1][1:1]amerge=inputs=2"]

    command.input(srcFilePath)
    .input(overlayFilePath)
    this.executeCommand(command, option, dstFilePath)
  }
  /*
    NOTE: Overlay video which does not include audio source
    @param filePath  : original file path
    @param filePath2 : overlay file path (no audio source)
  */
  overlayWithNoAudio(filePath, filePath2) {
    const srcFolderPath = path.dirname(filePath)
    const srcFilePath = filePath
    const overlayFilePath = filePath2
    const dstFilePath = path.join(srcFolderPath, "overlay_no_audio.mp4")
    const command = ffmpeg()
    const option = ["-filter_complex", "overlay", "-map", "0:0", "-map", "1:0"]

    command.input(srcFilePath)
    .input(overlayFilePath)
    this.executeCommand(command, option, dstFilePath)
  }


  /*
    NOTE: Create mirror image
    @param filePath : original file
  */
  hflip(filePath) {
    const srcFolderPath = path.dirname(filePath)
    const dstFilePath = path.join(srcFolderPath, "hflip.mp4")
    const command = ffmpeg()
    const option = ["-vf", "hflip"]

    command.input(filePath)
    this.executeCommand(command, option, dstFilePath)
  }

  /*
    NOTE: convert video format from webm to mp4
    @param webmFilePath : webm video file
  */
  webm2mp4(webmFilePath) {
    const srcFolderPath = path.dirname(webmFilePath)
    const dstFilePath = path.join(srcFolderPath, "converted.mp4")
    const command = ffmpeg()
    const option = ["-fflags", "+genpts", '-r','24']

    command.input(webmFilePath)
    this.executeCommand(command, option, dstFilePath)
  }

  executeCommand(command, option, dstFilePath) {
    const self = this;
    command.addOptions(option)
    .on('stderr', function(stderrLine) {
      console.log('Stderr output: ' + stderrLine);
    })
    .on('end', function() {
      self.emit(command);
    })
    .on('error', function(err) {
      console.log('an error happened: ' + err.message);
    })
    .saveToFile(dstFilePath);
  }
}
