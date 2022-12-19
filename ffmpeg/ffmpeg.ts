import axios from "axios";
import ffmpeg from "fluent-ffmpeg";
import {path} from '@ffmpeg-installer/ffmpeg';
import fs from "fs";
import { formatSecondsIntoHHMMSS, getBitrate, mediaOutputPath } from "../helpers/helpers";

ffmpeg.setFfmpegPath(path);

async function saveVideo() {
  const res = await axios.get(
    "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    {
      responseType: "stream",
    }
  );

  res.data.pipe(fs.createWriteStream("video.mp4"));
}

export async function getSS() {
  try {
    const process = ffmpeg("./video.mp4").takeScreenshots(
      {
        count: 1,
        timemarks: ["4"], // number of seconds
      },
      "./ss.png"
    );
    console.log("\nDone with processing...");
  } catch (error) {
    console.log("[getSS] error:", error);
  }
}

export async function addSubtitles() {
  try {
    const process = ffmpeg("./video.mp4")
      .outputOptions("-vf subtitles=subtitles.srt")
      .on("error", function (err) {
        console.log("Error: " + err.message);
      })
      .save("test.mp4");
  } catch (error) {
    console.log("[addSubtitles] error:", error);
  }
}

export async function addText() {
  const process = ffmpeg("./video.mp4")
    .videoFilters([
      {
        filter: "drawtext",
        options: {
          fontfile: "font.ttf",
          text: "FROM WEEDIO",
          fontsize: 50,
          fontcolor: "white",
          x: "(main_w/2-text_w/2)",
          y: 100,
          shadowcolor: "black",
          shadowx: 2,
          shadowy: 2,
          enable: "between(t,2,4)",
        },
      },
    ])
    .on("end", function () {
      console.log("file has been converted succesfully");
    })
    .on("error", function (err) {
      console.log("an error happened: " + err.message);
    })
    // save to file
    .save("./withText.mp4");
}

export async function reduceSize(
  fileLocation: string,
  fileName: string,
  size: number
) {
  console.log("[ffmpeg] reduceSize: fileLocation:", fileLocation);
  console.log("[ffmpeg] reduceSize: size:", size);
  const bitrate = getBitrate(size);
  const outputPath = mediaOutputPath(fileName);
  await new Promise((resolve, reject) => {
    ffmpeg(fileLocation)
      .outputOptions([
        "-c:v libx264",
        `-b:v ${bitrate}k`,
        "-c:a aac",
        "-b:a 58k",
      ])
      .output(outputPath)
      .on("start", (cmd) => {
        console.log("[ffmpeg] cmd:", cmd);
      })
      .on("error", (error) =>{
        console.log("[ffmpeg.ts] reduceSize error", error)
        reject("❌ Error in reducing size")
      })      .on("end", () => resolve("Done"))
      .run();
  });
  console.log("[ffmpeg.ts] ✅ Done with reducing size");
  return outputPath;
}

export async function trimVideo(payload: {
  fileLocation: string;
  fileName: string;
  startTime: number;
  endTime: number;
}) {
  console.log("[ffmpeg.ts] trimVideo: payload:", payload);
  const outputPath = mediaOutputPath(payload.fileName);

  await new Promise((resolve, reject) => {
    ffmpeg(payload.fileLocation)
      .setStartTime(formatSecondsIntoHHMMSS(payload.startTime))
      .setDuration(payload.endTime - payload.startTime)
      .on("start", () => console.log("➡️ video trimming started..."))
      .on("end", () => resolve("✅ Video trimmed"))
      .on("error", (error) =>{
        console.log("[ffmpeg.ts] trimVideo error", error)
        reject("❌ Error in trimming video")
      })      .save(outputPath);
  });

  return outputPath;
}

export async function removeAudio(payload: {
  fileLocation: string;
  fileName: string;
}) {
  console.log("[ffmpeg.ts] removeAudio: payload:", payload);
  const outputPath = mediaOutputPath(payload.fileName);

  await new Promise((resolve, reject) => {
    ffmpeg(payload.fileLocation)
      .noAudio()
      .on("start", () => console.log("➡️ removing audio started..."))
      .on("end", () => resolve("✅ Audio removed"))
      .on("error", (error) =>{
        console.log("[ffmpeg.ts] removeAudio error", error)
        reject("❌ Error in removing audio")
      })      .save(outputPath);
  });

  return outputPath;
}


export async function extractAudio(payload: {
  fileLocation: string;
  fileName: string;
}) {
  console.log("[ffmpeg.ts] removeAudio: payload:", payload);
  const outputPath = mediaOutputPath(payload.fileName,true);

  await new Promise((resolve, reject) => {
    ffmpeg(payload.fileLocation)
      .noVideo()
      .format('mp3')
      .on("start", () => console.log("➡️ extracting audio started..."))
      .on("end", () => resolve("✅ Audio extracted"))
      .on("error", (error) =>{
        console.log("[ffmpeg.ts] extractAudio error", error)
        reject("❌ Error in extracting audio")
      })
      .save(outputPath);
  });

  return outputPath;
}

export async function modifySpeed(
  payload:{fileLocation: string,
  fileName: string,
  pts:"0.5"|"0.25"|"0.25"|"2"}
) {
  console.log("[ffmpeg] modifySpeed: fileLocation:", payload.fileLocation);
  const outputPath = mediaOutputPath(payload.fileName);

  await new Promise((resolve, reject) => {
    ffmpeg(payload.fileLocation)
      .outputOptions([
        "-filter:v", `setpts=${payload.pts}*PTS`
      ])
      .on("error", (error) => {
        console.log('[ffmpeg.ts] modifySpeed error', error)
        reject(error)
      })
      .on("end", () => resolve("Done"))
      .save(outputPath);
  });
  console.log("[ffmpeg.ts] ✅ Done with reducing size");
  return outputPath;
}
