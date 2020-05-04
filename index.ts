import config from "./config.json";
import { Bot } from "./src/Bot";

const bot = new Bot(config)
bot.start();