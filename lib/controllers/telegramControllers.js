"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var crypto_1 = require("crypto");
var telegram_1 = __importDefault(require("../@config/telegram"));
var helpers_1 = require("../helpers/helpers");
var ffmpeg_1 = require("../ffmpeg/ffmpeg");
var constants_1 = require("../@config/constants");
var clients_1 = __importDefault(require("./clients"));
telegram_1.default.on("message", function (message) {
    console.log("[telegramControllers.js] Recieved message:", message.text);
    if (!message.text) {
        return;
    }
    if (message.text === "/start") {
        telegram_1.default.setMyCommands([
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
        telegram_1.default.sendMessage(message.chat.id, "Hello ".concat(message.chat.first_name, "\uD83C\uDF1F\nI can perform following tasks as of now. Please choose one."), {
            reply_to_message_id: message.message_id,
            reply_markup: {
                force_reply: true,
                resize_keyboard: true,
                remove_keyboard: true,
                one_time_keyboard: true,
                keyboard: [
                    [
                        {
                            text: constants_1.VIDEO_FEATURES.trimVideo,
                        },
                        {
                            text: constants_1.VIDEO_FEATURES.reduceSize,
                        },
                    ],
                    [
                        {
                            text: constants_1.VIDEO_FEATURES.removeAudio,
                        },
                        {
                            text: constants_1.VIDEO_FEATURES.extractAudio,
                        },
                    ],
                    [
                        {
                            text: constants_1.VIDEO_FEATURES.modifySpeed,
                        },
                    ],
                ],
            },
        });
    }
    else if ((0, helpers_1.isFeature)(message.text) || message.text.startsWith("/")) {
        console.log("[telegramControllers.js] client sent feature details");
        var _a = (0, helpers_1.handleFeatureReply)(message.text), replyMessage = _a.replyMessage, featureType = _a.featureType;
        clients_1.default.add({
            firstName: message.chat.first_name,
            id: (0, crypto_1.randomUUID)(),
            feature: featureType,
            status: "joined",
            teleId: message.chat.id,
            username: message.chat.username,
        });
        telegram_1.default.sendMessage(message.chat.id, replyMessage);
    }
    else {
        console.log("[telegramControllers.js] client may have sent options");
        var optionRes = (0, helpers_1.isOption)(message.text);
        telegram_1.default.sendMessage(message.chat.id, optionRes.message);
        if (optionRes.success) {
            clients_1.default.attachOptions(message.chat.username, optionRes.options);
        }
    }
});
telegram_1.default.on("video", function (res) { return __awaiter(void 0, void 0, void 0, function () {
    var client_1, fileStream, fileName_1, mediaStoragePath_1;
    return __generator(this, function (_a) {
        console.log("[telegramControllers.js] video", res);
        if (res.video && res.video.file_id) {
            if ((0, helpers_1.videoExceedsSizeLimit)(res.video.file_size)) {
                telegram_1.default.sendMessage(res.chat.id, "We are at very early stage, cannot afford to process files larger than 15 MB in size as of now.😶‍🌫️");
                return [2 /*return*/];
            }
            client_1 = clients_1.default.get(res.chat.username);
            if (!client_1) {
                console.log("[telegramControllers.js] client not found");
                // TODO: add logic: if user directly sends media, send feature options again
                return [2 /*return*/];
            }
            fileStream = telegram_1.default.getFileStream(res.video.file_id);
            fileName_1 = res.video["file_name"]
                ? res.video["file_name"]
                : "untitled-69-"
                    .concat(new Date().getTime().toString())
                    .concat(".mp4");
            mediaStoragePath_1 = (0, helpers_1.newMediaStoragePath)(fileName_1);
            clients_1.default.attachMedia(res.chat.username, {
                duration: res.video.duration,
                fileId: res.video.file_id,
                fileUniqueId: res.video.file_unique_id,
                fileName: fileName_1,
                inputLocation: mediaStoragePath_1,
                mime: (0, helpers_1.getMimeType)(fileName_1),
                size: res.video.file_size,
                type: "video",
            });
            fileStream.on("end", function () { return __awaiter(void 0, void 0, void 0, function () {
                var outputPath, caption, outputStream;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log("File saved");
                            outputPath = "";
                            caption = "";
                            if (!(client_1.feature === "video-reduce-size")) return [3 /*break*/, 2];
                            return [4 /*yield*/, (0, ffmpeg_1.reduceSize)(mediaStoragePath_1, fileName_1, res.video.file_size)];
                        case 1:
                            outputPath = _a.sent();
                            caption = "✅ Video size reduced";
                            return [3 /*break*/, 11];
                        case 2:
                            if (!(client_1.feature === "video-trim" &&
                                client_1.options.length === 2)) return [3 /*break*/, 4];
                            return [4 /*yield*/, (0, ffmpeg_1.trimVideo)({
                                    fileLocation: mediaStoragePath_1,
                                    fileName: fileName_1,
                                    startTime: Number(client_1.options[0]),
                                    endTime: Number(client_1.options[1]),
                                })];
                        case 3:
                            outputPath = _a.sent();
                            caption = "✅ Video Trimmed";
                            return [3 /*break*/, 11];
                        case 4:
                            if (!(client_1.feature === "remove-audio")) return [3 /*break*/, 6];
                            return [4 /*yield*/, (0, ffmpeg_1.removeAudio)({
                                    fileLocation: mediaStoragePath_1,
                                    fileName: fileName_1,
                                })];
                        case 5:
                            outputPath = _a.sent();
                            caption = "✅ Audio Removed";
                            return [3 /*break*/, 11];
                        case 6:
                            if (!(client_1.feature === "extract-music")) return [3 /*break*/, 8];
                            return [4 /*yield*/, (0, ffmpeg_1.extractAudio)({
                                    fileLocation: mediaStoragePath_1,
                                    fileName: fileName_1,
                                })];
                        case 7:
                            outputPath = _a.sent();
                            caption = "✅ Music extracted";
                            return [3 /*break*/, 11];
                        case 8:
                            if (!(client_1.feature === "playback-speed")) return [3 /*break*/, 10];
                            return [4 /*yield*/, (0, ffmpeg_1.modifySpeed)({
                                    fileLocation: mediaStoragePath_1,
                                    fileName: fileName_1,
                                    pts: "0.25",
                                })];
                        case 9:
                            outputPath = _a.sent();
                            caption = "✅ Playback speed modified";
                            return [3 /*break*/, 11];
                        case 10: 
                        // TODO: handle if feature not chosen
                        return [2 /*return*/];
                        case 11:
                            clients_1.default.attachOutputLocation(res.chat.username, outputPath);
                            console.log("⬆️Sending output to client...");
                            outputStream = (0, fs_1.createReadStream)(outputPath);
                            if (!outputPath.includes("mp3")) return [3 /*break*/, 13];
                            return [4 /*yield*/, telegram_1.default.sendAudio(res.chat.id, outputStream, {
                                    caption: caption,
                                })];
                        case 12:
                            _a.sent();
                            return [3 /*break*/, 15];
                        case 13: return [4 /*yield*/, telegram_1.default.sendVideo(res.chat.id, outputStream, {
                                caption: caption,
                            })];
                        case 14:
                            _a.sent();
                            _a.label = 15;
                        case 15:
                            console.log("✅ Processed file sent to client");
                            clients_1.default.remove(client_1.username);
                            (0, helpers_1.removeFile)(client_1.media.inputLocation);
                            (0, helpers_1.removeFile)(client_1.media.outputLocation);
                            return [2 /*return*/];
                    }
                });
            }); });
            fileStream.on("error", function () {
                console.log("Error in file saving");
            });
            fileStream.pipe((0, fs_1.createWriteStream)(mediaStoragePath_1));
        }
        return [2 /*return*/];
    });
}); });
