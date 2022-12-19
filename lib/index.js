"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = require("path");
// import "./controllers/telegramControllers";
var app = (0, express_1.default)();
var __dirname = (0, path_1.resolve)();
app.use(express_1.default.static(__dirname + "/public"));
app.get("/", function (_req, res) {
    res.sendFile(__dirname + "/public/index.html");
});
var PORT = 3000;
app.listen(PORT, function () {
    console.log("Media converter running on port", PORT);
});
