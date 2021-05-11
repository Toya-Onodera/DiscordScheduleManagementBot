import http from "http";
import { discordBot } from "./bot";

class DiscordBotServer {
    private httpServer: http.Server;

    constructor() {
        this.httpServer = http.createServer();

        this.httpServer.on("request", async (_request, response) => {
            discordBot.connectDiscord();
            response.writeHead(200, { "Content-Type": "text/plain" });
            response.end("Discord bot is active now \n");
        });

        this.httpServer.listen(3000);
    }
}

const test = () => {
    new DiscordBotServer();
}

test();
