"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.discordBot = void 0;
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const dayjs_1 = __importDefault(require("dayjs"));
require("dayjs/locale/ja");
class DiscordBot {
    constructor() {
        const clientOptions = {
            disableEveryone: true
        };
        this.client = new discord_js_1.Client(clientOptions);
        dotenv_1.default.config();
        dayjs_1.default.locale("ja");
        if (process.env.DISCORD_BOT_TOKEN === undefined) {
            console.log("DISCORD_BOT_TOKEN does not exist.");
            process.exit(0);
        }
        else {
            this.connectDiscord();
        }
        this.initialize();
    }
    initialize() {
        this.client.once("ready", () => {
            console.log("This bot is running...");
            this.client.user.setPresence({ activity: { name: "Bot" } });
        });
        this.client.on("message", async (message) => {
            if (message.author.bot) {
                return;
            }
            if ((message.mentions.users.find((e) => e.username === this.client.user.username) && message.mentions.users.array().length === 1) || (message.mentions.roles.find((e) => e.name === this.client.user.username) && message.mentions.roles.array().length === 1)) {
                const sentMessage = await message.channel.send(`@everyone \n${this.toNextWeekends()}`);
                try {
                    await sentMessage.react("1️⃣");
                    await sentMessage.react("2️⃣");
                    await sentMessage.react("3️⃣");
                    await sentMessage.react("❌");
                }
                catch (err) {
                    console.error(err);
                }
            }
        });
    }
    connectDiscord() {
        this.client.login(process.env.DISCORD_BOT_TOKEN);
    }
    toNextWeekends() {
        const japanNowDate = dayjs_1.default();
        const weekends = [5, 6, 7];
        return weekends.map((d, n) => {
            const diffDay = d - japanNowDate.day();
            const targetDate = japanNowDate.add(diffDay, "day");
            return `${n + 1}: ${targetDate.format("YYYY/MM/DD(ddd)")}`;
        }).join("\n");
    }
}
exports.discordBot = new DiscordBot();
