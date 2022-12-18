import { createWriteStream, createReadStream } from "fs";
import { randomUUID } from "crypto";
import teleBot from "../@config/telegram";
import { newMediaStoragePath } from "../helpers/helpers";
import { reduceSize } from "../ffmpeg/ffmpeg";

teleBot.on("message", (message) => {
  console.log("[telegramControllers.js] message", message);
});

teleBot.on("video", async (res) => {
  console.log("[telegramControllers.js] video", res);

  if (res.video && res.video.file_id) {
    const fileStream = teleBot.getFileStream(res.video.file_id);

    const fileName = res.video["file_name"]
      ? res.video["file_name"]
      : "untitled-69-".concat(new Date().getTime().toString()).concat(".mp4");

    const mediaStoragePath = newMediaStoragePath(fileName);

    fileStream.on("end", async () => {
      console.log("File saved");
      const outputPath = await reduceSize(
        mediaStoragePath,
        fileName,
        res.video.file_size
      );
      console.log("⬆️Sending output to client...");
      const outputStream = createReadStream(outputPath);
      teleBot.sendVideo(res.chat.id, outputStream, {
        caption: "✅ Video size reduced",
      });
    });

    fileStream.on("error", () => {
      console.log("Error in file saving");
    });

    fileStream.pipe(createWriteStream(mediaStoragePath));
  }
});
