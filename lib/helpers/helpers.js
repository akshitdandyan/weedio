"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFile = exports.videoExceedsSizeLimit = exports.isOption = exports.isFeature = exports.handleFeatureReply = exports.getMimeType = exports.formatSecondsIntoHHMMSS = exports.getBitrate = exports.mediaOutputPath = exports.newMediaStoragePath = exports.mediaExtension = void 0;
var crypto_1 = require("crypto");
var fs_1 = require("fs");
var constants_1 = require("../@config/constants");
var mediaExtension = function (filename) {
    return filename.match(/\.[0-9a-z]+$/i)[0];
};
exports.mediaExtension = mediaExtension;
var newMediaStoragePath = function (filename) {
    if (!(0, fs_1.existsSync)("./client-media")) {
        (0, fs_1.mkdirSync)("./client-media");
    }
    return "./client-media/".concat(filename, "@uuid:").concat((0, crypto_1.randomUUID)()).concat((0, exports.mediaExtension)(filename));
};
exports.newMediaStoragePath = newMediaStoragePath;
var mediaOutputPath = function (filename, isAudio) {
    if (isAudio === void 0) { isAudio = false; }
    if (!(0, fs_1.existsSync)("./server-media")) {
        (0, fs_1.mkdirSync)("./server-media");
    }
    if (!isAudio) {
        return "./server-media/".concat(filename);
    }
    return "./server-media/".concat(filename.replace(".mp4", ".mp3"));
};
exports.mediaOutputPath = mediaOutputPath;
var getBitrate = function (bytes) {
    var diff = Math.floor(bytes / 1000000);
    if (diff < 5) {
        return 128;
    }
    return Math.floor(diff * 28 * 1.1);
};
exports.getBitrate = getBitrate;
var formatSecondsIntoHHMMSS = function (seconds) {
    var date = new Date(seconds * 1000);
    var hh = date.getUTCHours();
    var mm = date.getUTCMinutes();
    var ss = date.getSeconds();
    return "".concat(hh, ":").concat(mm, ":").concat(ss);
};
exports.formatSecondsIntoHHMMSS = formatSecondsIntoHHMMSS;
var getMimeType = function (filename) {
    var fileExtension = filename.split('.').pop();
    var mimeType = constants_1.videoMimeTypes[fileExtension];
    return mimeType || 'application/octet-stream';
};
exports.getMimeType = getMimeType;
function handleFeatureReply(command) {
    var replyMessage = "";
    var needReply = false;
    var featureType = "not-choosen";
    switch (command) {
        case constants_1.VIDEO_FEATURES.reduceSize:
            replyMessage = "Okay, send the video whose size is to be reduced 🎦";
            featureType = "video-reduce-size";
            break;
        case constants_1.VIDEO_FEATURES.trimVideo:
            replyMessage =
                "Okay, please type the start and end duration in seconds.\nFor example, if you want to trim a video from 2s to 6s, type 2 6";
            needReply = true;
            featureType = "video-trim";
            break;
        case constants_1.VIDEO_FEATURES.removeAudio:
            replyMessage = "Okay, send the video which needs to be muted 🔇";
            featureType = "remove-audio";
            break;
        case constants_1.VIDEO_FEATURES.extractAudio:
            replyMessage = "Okay, send the video from which you want to extract music 🎵";
            featureType = "extract-music";
            break;
        case constants_1.VIDEO_FEATURES.modifySpeed:
            replyMessage = "Okay, send the video whose playback speed you want to modify ⌛.";
            featureType = "playback-speed";
            needReply = true;
            break;
        default:
            replyMessage = "Woops! Please choose only from given options.";
            break;
    }
    return {
        needReply: needReply,
        replyMessage: replyMessage,
        featureType: featureType,
    };
}
exports.handleFeatureReply = handleFeatureReply;
function isFeature(reply) {
    for (var prop in constants_1.VIDEO_FEATURES) {
        if (constants_1.VIDEO_FEATURES[prop] === reply) {
            return true;
        }
    }
    return false;
}
exports.isFeature = isFeature;
function isOption(reply) {
    try {
        // 1. durations for video trim feature
        var splitted = reply.split(" ");
        if (splitted.length < 2) {
            return {
                success: false,
                message: "🙄Umm, that's not enough to proceed with. Please write both start and end duration in following format: \n\n 5 10",
            };
        }
        var startTime = splitted[0];
        var endTime = splitted[splitted.length - 1];
        if (startTime >= endTime) {
            return {
                success: false,
                message: "Sorry, we cannot produce videos in duration with minus seconds😟",
            };
        }
        return {
            success: true,
            message: "Amazing! Send the video now🤩",
            options: [startTime, endTime]
        };
    }
    catch (error) {
        console.log("[helpers.ts] isOption error", error);
        return {
            success: false,
            message: "Agh!! Something went wrong😟 Please take a snapshot and email it to us so that we can fix it.",
        };
    }
}
exports.isOption = isOption;
var videoExceedsSizeLimit = function (size) {
    return size > 15 * 1024 * 1024;
};
exports.videoExceedsSizeLimit = videoExceedsSizeLimit;
var removeFile = function (path) {
    try {
        if ((0, fs_1.statSync)(path)) {
            (0, fs_1.unlinkSync)(path);
            console.log("🧹File removed");
            return;
        }
        console.log("🧹File not found to remove");
    }
    catch (error) {
        console.log("[helpers.ts] removeFile error:", error);
    }
};
exports.removeFile = removeFile;
