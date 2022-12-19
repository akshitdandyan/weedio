"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
require("./controllers/telegramControllers");
var app = (0, express_1.default)();
app.get("/", function (_req, res) {
    res.status(200).send("COOL").end();
});
var PORT = 3000;
app.listen(PORT, function () {
    console.log("Media converter running on port", PORT);
});
