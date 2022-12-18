import TelegramBot from "node-telegram-bot-api";
import { TELEGRAM_BOT_TOKEN } from "./envs";

const teleBot = new TelegramBot(TELEGRAM_BOT_TOKEN,{
    polling:true
});

teleBot.on('polling_error',(err) => {
    console.log("[telegram.js] polling_error", err)
})

export default teleBot;