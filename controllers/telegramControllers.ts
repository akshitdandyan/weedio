import { createWriteStream } from "fs";
import { randomUUID } from "crypto";
import teleBot from "../@config/telegram";

teleBot.on("message", (message) => {
  console.log("[telegramControllers.js] message", message);
});

teleBot.on("video", async (res) => {
  console.log("[telegramControllers.js] video", res);

  if (res.video && res.video.file_id) {

    const fileStream = teleBot.getFileStream(res.video.file_id);

    fileStream.on("end", () => {
      console.log("File saved");
    });

    fileStream.on("error", () => {
      console.log("Error in file saving");
    });

    fileStream.pipe(createWriteStream("answer.mp4"));

  }

});