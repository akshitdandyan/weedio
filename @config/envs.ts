import { config } from "dotenv";
config();

export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if(!TELEGRAM_BOT_TOKEN){
    throw new Error("[@config.ts] Telegram bot token not configured in environment variables.")
}