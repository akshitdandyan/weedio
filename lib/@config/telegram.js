"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
var envs_1 = require("./envs");
var teleBot = new node_telegram_bot_api_1.default(envs_1.TELEGRAM_BOT_TOKEN, {
    polling: true
});
teleBot.on('polling_error', function (err) {
    console.log("[telegram.js] polling_error", err);
});
exports.default = teleBot;
