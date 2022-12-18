import { createWriteStream, createReadStream } from "fs";
import teleBot from "../@config/telegram";
import { handleFeatureReply, isFeature, isOption, newMediaStoragePath } from "../helpers/helpers";
import { reduceSize, trimVideo } from "../ffmpeg/ffmpeg";
import { VIDEO_FEATURES } from "../@config/constants";


teleBot.on("message", (message) => {
  if (message.text === "/start") {
    teleBot.setMyCommands([
      { command: "/start", description: "Start with us" },
    ]);
    teleBot.sendMessage(
      message.chat.id,
      `Hello ${message.chat.first_name}🌟\nI can perform following tasks as of now. Please choose one.`,
      {
        reply_to_message_id: message.message_id,
        reply_markup: {
          force_reply: true,
          resize_keyboard: true,
          remove_keyboard: true,
          one_time_keyboard: true,
          keyboard: [
            [
              {
                text: VIDEO_FEATURES.trimVideo,
              },
              {
                text: VIDEO_FEATURES.reduceSize,
              },
            ],
          ],
        },
      }
    );
  }else if(isFeature(message.text)){
    const {replyMessage} = handleFeatureReply(message.text);
    teleBot.sendMessage(message.chat.id, replyMessage);
  }
  const optionRes = isOption(message.text);
  if(optionRes.success){
    //TODO: run ffmpeg processes
  }
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
      // const outputPath = await reduceSize(
      //   mediaStoragePath,
      //   fileName,
      //   res.video.file_size
      // );
      const outputPath = await trimVideo({
        fileLocation: mediaStoragePath,
        fileName: fileName,
        startTime: 0,
        endTime: 4,
      });
      console.log("⬆️Sending output to client...");
      const outputStream = createReadStream(outputPath);
      // teleBot.sendVideo(res.chat.id, outputStream, {
      //   caption: "✅ Video size reduced",
      // });
      teleBot.sendVideo(res.chat.id, outputStream, {
        caption: "✅ Video Trimmed",
      });
    });

    fileStream.on("error", () => {
      console.log("Error in file saving");
    });

    fileStream.pipe(createWriteStream(mediaStoragePath));
  }
});
