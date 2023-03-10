import { createWriteStream, createReadStream } from "fs";
import { randomUUID } from "crypto";
import teleBot from "../@config/telegram";
import {
    getMimeType,
    handleFeatureReply,
    isFeature,
    isOption,
    newMediaStoragePath,
    removeFile,
    videoExceedsSizeLimit,
} from "../helpers/helpers";
import {
    extractAudio,
    modifySpeed,
    reduceSize,
    removeAudio,
    trimVideo,
} from "../ffmpeg/ffmpeg";
import { VIDEO_FEATURES } from "../@config/constants";
import clients from "./clients";

teleBot.on("message", (message) => {
    console.log("[telegramControllers.js] Recieved message:", message.text);
    if (!message.text) {
        return;
    }
    if (message.text === "/start") {
        teleBot.setMyCommands([
            { command: "/start", description: "Start with us" },
            {
                command: "/reducevideosize",
                description: "Reduce video file size with ulta compression",
            },
            {
                command: "/trimvideo",
                description: "Trim video within a time range",
            },
            {
                command: "/removeaudio",
                description: "Remove audio from video",
            },
            {
                command: "/extractmusic",
                description: "Get music from video",
            },
            {
                command: "/modifyspeed",
                description: "Modify payback speed of video",
            },
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
                        [
                            {
                                text: VIDEO_FEATURES.removeAudio,
                            },
                            {
                                text: VIDEO_FEATURES.extractAudio,
                            },
                        ],
                        [
                            {
                                text: VIDEO_FEATURES.modifySpeed,
                            },
                        ],
                    ],
                },
            }
        );
    } else if (isFeature(message.text) || message.text.startsWith("/")) {
        console.log("[telegramControllers.js] client sent feature details");
        const { replyMessage, featureType } = handleFeatureReply(message.text);

        clients.add({
            firstName: message.chat.first_name,
            id: randomUUID(),
            feature: featureType,
            status: "joined",
            teleId: message.chat.id,
            username: message.chat.username,
        });

        teleBot.sendMessage(message.chat.id, replyMessage);
    } else {
        console.log("[telegramControllers.js] client may have sent options");
        const optionRes = isOption(message.text);
        teleBot.sendMessage(message.chat.id, optionRes.message);
        if (optionRes.success) {
            clients.attachOptions(message.chat.username, optionRes.options);
        }
    }
});

teleBot.on("video", async (res) => {
    console.log("[telegramControllers.js] video", res);

    if (res.video && res.video.file_id) {
        if (videoExceedsSizeLimit(res.video.file_size)) {
            teleBot.sendMessage(
                res.chat.id,
                "We are at very early stage, cannot afford to process files larger than 15 MB in size as of now.😶‍🌫️"
            );
            return;
        }
        const client = clients.get(res.chat.username);

        if (!client) {
            console.log("[telegramControllers.js] client not found");
            // TODO: add logic: if user directly sends media, send feature options again
            return;
        }

        const fileStream = teleBot.getFileStream(res.video.file_id);

        const fileName = res.video["file_name"]
            ? res.video["file_name"]
            : "untitled-69-"
                  .concat(new Date().getTime().toString())
                  .concat(".mp4");

        const mediaStoragePath = newMediaStoragePath(fileName);

        clients.attachMedia(res.chat.username, {
            duration: res.video.duration,
            fileId: res.video.file_id,
            fileUniqueId: res.video.file_unique_id,
            fileName: fileName,
            inputLocation: mediaStoragePath,
            mime: getMimeType(fileName),
            size: res.video.file_size,
            type: "video",
        });

        fileStream.on("end", async () => {
            console.log("File saved");
            let outputPath = "";
            let caption = "";
            if (client.feature === "video-reduce-size") {
                outputPath = await reduceSize(
                    mediaStoragePath,
                    fileName,
                    res.video.file_size
                );
                caption = "✅ Video size reduced";
            } else if (
                client.feature === "video-trim" &&
                client.options.length === 2
            ) {
                outputPath = await trimVideo({
                    fileLocation: mediaStoragePath,
                    fileName: fileName,
                    startTime: Number(client.options[0]),
                    endTime: Number(client.options[1]),
                });
                caption = "✅ Video Trimmed";
            } else if (client.feature === "remove-audio") {
                outputPath = await removeAudio({
                    fileLocation: mediaStoragePath,
                    fileName: fileName,
                });
                caption = "✅ Audio Removed";
            } else if (client.feature === "extract-music") {
                outputPath = await extractAudio({
                    fileLocation: mediaStoragePath,
                    fileName: fileName,
                });
                caption = "✅ Music extracted";
            } else if (client.feature === "playback-speed") {
                outputPath = await modifySpeed({
                    fileLocation: mediaStoragePath,
                    fileName: fileName,
                    pts: "0.25",
                });
                caption = "✅ Playback speed modified";
            } else {
                // TODO: handle if feature not chosen
                return;
            }

            clients.attachOutputLocation(res.chat.username, outputPath);

            console.log("⬆️Sending output to client...");
            const outputStream = createReadStream(outputPath);
            if (outputPath.includes("mp3")) {
                await teleBot.sendAudio(res.chat.id, outputStream, {
                    caption,
                });
            } else {
                await teleBot.sendVideo(res.chat.id, outputStream, {
                    caption,
                });
            }

            console.log("✅ Processed file sent to client");
            clients.remove(client.username);
            removeFile(client.media.inputLocation);
            removeFile(client.media.outputLocation);
        });

        fileStream.on("error", () => {
            console.log("Error in file saving");
        });

        fileStream.pipe(createWriteStream(mediaStoragePath));
    }
});
