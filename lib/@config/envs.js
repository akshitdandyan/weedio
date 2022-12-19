"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TELEGRAM_BOT_TOKEN = void 0;
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!exports.TELEGRAM_BOT_TOKEN) {
    throw new Error("[@config.ts] Telegram bot token not configured in environment variables.");
}
