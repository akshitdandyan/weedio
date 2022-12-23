import { randomUUID } from "crypto";
import { existsSync, mkdirSync, statSync, unlinkSync } from "fs";
import { videoMimeTypes, VIDEO_FEATURES } from "../@config/constants";
import { Feature } from "../controllers/clients";

export const mediaExtension = (filename: string) => {
    return filename.match(/\.[0-9a-z]+$/i)[0];
};

export const newMediaStoragePath = (filename: string) => {
    if (!existsSync("./client-media")) {
        mkdirSync("./client-media");
    }
    return `./client-media/${filename}@uuid:${randomUUID()}${mediaExtension(
        filename
    )}`;
};

export const mediaOutputPath = (filename: string, isAudio = false) => {
    if (!existsSync("./server-media")) {
        mkdirSync("./server-media");
    }
    if (!isAudio) {
        return `./server-media/${filename}`;
    }
    return `./server-media/${filename.replace(".mp4", ".mp3")}`;
};

export const getBitrate = (bytes: number) => {
    const diff = Math.floor(bytes / 1000000);
    if (diff < 5) {
        return 128;
    }
    return Math.floor(diff * 28 * 1.1);
};

export const formatSecondsIntoHHMMSS = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getSeconds();
    return `${hh}:${mm}:${ss}`;
};

export const getMimeType = (filename: string) => {
    const fileExtension = filename.split(".").pop();
    const mimeType = videoMimeTypes[fileExtension];
    return mimeType || "application/octet-stream";
};

export function handleFeatureReply(command: string) {
    let replyMessage = "";
    let needReply = false;
    let featureType: Feature = "not-choosen";
    console.log("[helpers.js] command", command);

    switch (command) {
        case VIDEO_FEATURES.reduceSize:
        case "/reducevideosize":
            replyMessage = "Okay, send the video which needs to be 🤏🏼";
            featureType = "video-reduce-size";
            break;
        case VIDEO_FEATURES.trimVideo:
        case "/trimvideo":
            replyMessage =
                "Okay, please type the start and end duration in seconds.\nFor example, if you want to trim a video from 2s to 6s, type 2 6";
            needReply = true;
            featureType = "video-trim";
            break;
        case VIDEO_FEATURES.removeAudio:
        case "/removeaudio":
            replyMessage = "Okay, send the video which needs to be muted 🔇";
            featureType = "remove-audio";
            break;
        case VIDEO_FEATURES.extractAudio:
        case "/extractaudio":
            replyMessage =
                "Okay, send the video from which you want to extract music 🎵";
            featureType = "extract-music";
            break;
        case VIDEO_FEATURES.modifySpeed:
        case "/modifyspeed":
            replyMessage =
                "Okay, send the video whose playback speed you want to modify ⌛.";
            featureType = "playback-speed";
            needReply = true;
            break;
        default:
            replyMessage = "Woops! Please choose only from given options.";
            break;
    }

    return {
        needReply,
        replyMessage,
        featureType,
    };
}

export function isFeature(reply: string) {
    for (var prop in VIDEO_FEATURES) {
        if (VIDEO_FEATURES[prop] === reply) {
            return true;
        }
    }
    return false;
}

export function isOption(reply: string) {
    try {
        // 1. durations for video trim feature
        const splitted = reply.split(" ");
        if (splitted.length < 2) {
            return {
                success: false,
                message:
                    "🙄Umm, that's not enough to proceed with. Please write both start and end duration in following format: \n\n 5 10",
            };
        }
        const startTime = Number(splitted[0]);
        const endTime = Number(splitted[splitted.length - 1]);
        if (startTime >= endTime) {
            return {
                success: false,
                message:
                    "Sorry, we cannot produce videos in duration with minus seconds😟",
            };
        }
        return {
            success: true,
            message: "Amazing! Send the video now🤩",
            options: [startTime.toString(), endTime.toString()],
        };
    } catch (error) {
        console.log("[helpers.ts] isOption error", error);
        return {
            success: false,
            message:
                "Agh!! Something went wrong😟 Please take a snapshot and email it to us so that we can fix it.",
        };
    }
}

export const videoExceedsSizeLimit = (size: number) => {
    return size > 15 * 1024 * 1024;
};

export const removeFile = (path: string) => {
    try {
        if (statSync(path)) {
            unlinkSync(path);
            console.log("🧹File removed");
            return;
        }
        console.log("🧹File not found to remove");
    } catch (error) {
        console.log("[helpers.ts] removeFile error:", error);
    }
};
