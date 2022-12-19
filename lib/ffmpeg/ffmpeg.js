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
exports.modifySpeed = exports.extractAudio = exports.removeAudio = exports.trimVideo = exports.reduceSize = exports.addText = exports.addSubtitles = exports.getSS = void 0;
var axios_1 = __importDefault(require("axios"));
var fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
var fs_1 = __importDefault(require("fs"));
var helpers_1 = require("../helpers/helpers");
function saveVideo() {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1.default.get("https://samplelib.com/lib/preview/mp4/sample-5s.mp4", {
                        responseType: "stream",
                    })];
                case 1:
                    res = _a.sent();
                    res.data.pipe(fs_1.default.createWriteStream("video.mp4"));
                    return [2 /*return*/];
            }
        });
    });
}
function getSS() {
    return __awaiter(this, void 0, void 0, function () {
        var process;
        return __generator(this, function (_a) {
            try {
                process = (0, fluent_ffmpeg_1.default)("./video.mp4").takeScreenshots({
                    count: 1,
                    timemarks: ["4"], // number of seconds
                }, "./ss.png");
                console.log("\nDone with processing...");
            }
            catch (error) {
                console.log("[getSS] error:", error);
            }
            return [2 /*return*/];
        });
    });
}
exports.getSS = getSS;
function addSubtitles() {
    return __awaiter(this, void 0, void 0, function () {
        var process;
        return __generator(this, function (_a) {
            try {
                process = (0, fluent_ffmpeg_1.default)("./video.mp4")
                    .outputOptions("-vf subtitles=subtitles.srt")
                    .on("error", function (err) {
                    console.log("Error: " + err.message);
                })
                    .save("test.mp4");
            }
            catch (error) {
                console.log("[addSubtitles] error:", error);
            }
            return [2 /*return*/];
        });
    });
}
exports.addSubtitles = addSubtitles;
function addText() {
    return __awaiter(this, void 0, void 0, function () {
        var process;
        return __generator(this, function (_a) {
            process = (0, fluent_ffmpeg_1.default)("./video.mp4")
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
            return [2 /*return*/];
        });
    });
}
exports.addText = addText;
function reduceSize(fileLocation, fileName, size) {
    return __awaiter(this, void 0, void 0, function () {
        var bitrate, outputPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[ffmpeg] reduceSize: fileLocation:", fileLocation);
                    console.log("[ffmpeg] reduceSize: size:", size);
                    bitrate = (0, helpers_1.getBitrate)(size);
                    outputPath = (0, helpers_1.mediaOutputPath)(fileName);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            (0, fluent_ffmpeg_1.default)(fileLocation)
                                .outputOptions([
                                "-c:v libx264",
                                "-b:v ".concat(bitrate, "k"),
                                "-c:a aac",
                                "-b:a 58k",
                            ])
                                .output(outputPath)
                                .on("start", function (cmd) {
                                console.log("[ffmpeg] cmd:", cmd);
                            })
                                .on("error", function (error) { return reject(error); })
                                .on("end", function () { return resolve("Done"); })
                                .run();
                        })];
                case 1:
                    _a.sent();
                    console.log("[ffmpeg.ts] ✅ Done with reducing size");
                    return [2 /*return*/, outputPath];
            }
        });
    });
}
exports.reduceSize = reduceSize;
function trimVideo(payload) {
    return __awaiter(this, void 0, void 0, function () {
        var outputPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[ffmpeg.ts] trimVideo: payload:", payload);
                    outputPath = (0, helpers_1.mediaOutputPath)(payload.fileName);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            (0, fluent_ffmpeg_1.default)(payload.fileLocation)
                                .setStartTime(payload.startTime)
                                .setDuration(payload.endTime)
                                .on("start", function () { return console.log("➡️ video trimming started..."); })
                                .on("end", function () { return resolve("✅ Video trimmed"); })
                                .on("error", function () { return reject("❌ Error in video trimming"); })
                                .save(outputPath);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, outputPath];
            }
        });
    });
}
exports.trimVideo = trimVideo;
function removeAudio(payload) {
    return __awaiter(this, void 0, void 0, function () {
        var outputPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[ffmpeg.ts] removeAudio: payload:", payload);
                    outputPath = (0, helpers_1.mediaOutputPath)(payload.fileName);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            (0, fluent_ffmpeg_1.default)(payload.fileLocation)
                                .noAudio()
                                .on("start", function () { return console.log("➡️ removing audio started..."); })
                                .on("end", function () { return resolve("✅ Audio removed"); })
                                .on("error", function () { return reject("❌ Error in removing audio"); })
                                .save(outputPath);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, outputPath];
            }
        });
    });
}
exports.removeAudio = removeAudio;
function extractAudio(payload) {
    return __awaiter(this, void 0, void 0, function () {
        var outputPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[ffmpeg.ts] removeAudio: payload:", payload);
                    outputPath = (0, helpers_1.mediaOutputPath)(payload.fileName, true);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            (0, fluent_ffmpeg_1.default)(payload.fileLocation)
                                .noVideo()
                                .format('mp3')
                                .on("start", function () { return console.log("➡️ extracting audio started..."); })
                                .on("end", function () { return resolve("✅ Audio extracted"); })
                                .on("error", function () { return reject("❌ Error in extracting audio"); })
                                .save(outputPath);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, outputPath];
            }
        });
    });
}
exports.extractAudio = extractAudio;
function modifySpeed(payload) {
    return __awaiter(this, void 0, void 0, function () {
        var outputPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[ffmpeg] modifySpeed: fileLocation:", payload.fileLocation);
                    outputPath = (0, helpers_1.mediaOutputPath)(payload.fileName);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            (0, fluent_ffmpeg_1.default)(payload.fileLocation)
                                .outputOptions([
                                "-filter:v",
                                "setpts=".concat(payload.pts, "*PTS")
                            ])
                                .on("error", function (error) { return reject(error); })
                                .on("end", function () { return resolve("Done"); })
                                .save(outputPath);
                        })];
                case 1:
                    _a.sent();
                    console.log("[ffmpeg.ts] ✅ Done with reducing size");
                    return [2 /*return*/, outputPath];
            }
        });
    });
}
exports.modifySpeed = modifySpeed;
