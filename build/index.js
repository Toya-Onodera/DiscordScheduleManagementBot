"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const bot_1 = require("./bot");
class DiscordBotServer {
    constructor() {
        this.httpServer = http_1.default.createServer();
        this.httpServer.on("request", async (_request, response) => {
            bot_1.discordBot.connectDiscord();
            response.writeHead(200, { "Content-Type": "text/plain" });
            response.end("Discord bot is active now \n");
        });
        this.httpServer.listen(3000);
    }
}
const test = () => {
    new DiscordBotServer();
};
test();
