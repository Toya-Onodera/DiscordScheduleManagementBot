import {Client} from "discord.js";
import dotenv from "dotenv";
import dayjs from "dayjs";
import "dayjs/locale/ja";

type ClientOptions = {
    disableEveryone: boolean
}

class DiscordBot {
    private readonly client: Client;

    constructor() {
        const clientOptions: ClientOptions = {
            disableEveryone: true
        };

        // @ts-ignore
        this.client = new Client(clientOptions);

        dotenv.config();
        dayjs.locale("ja");

        if (process.env.DISCORD_BOT_TOKEN === undefined) {
            console.log("DISCORD_BOT_TOKEN does not exist.");
            process.exit(0);
        } else {
            this.connectDiscord();
        }

        this.initialize();
    }

    initialize(): void {
        this.client.once("ready", () => {
            console.log("This bot is running...");

            // Bot オンラインであれば、「Bot をプレイ中と表示される」
            // @ts-ignore
            this.client.user.setPresence({activity: {name: "Bot"}});
        });

        this.client.on("message", async (message) => {
            // 自分のメッセージには反応しないようにする
            if (message.author.bot) {
                return;
            }

            // メンションされる & @everyone や @here ではない & 単独メンションのときに動作する
            // @ts-ignore
            if ((message.mentions.users.find((e) => e.username === this.client.user.username) && message.mentions.users.array().length === 1) || (message.mentions.roles.find((e) => e.name === this.client.user.username) && message.mentions.roles.array().length === 1)) {
                const sentMessage = await message.channel.send(`@everyone \n${this.createNextSchedules(message.content)}`);
                try {
                    await sentMessage.react("1️⃣");
                    await sentMessage.react("2️⃣");
                    await sentMessage.react("3️⃣");
                    await sentMessage.react("❌");
                } catch (err) {
                    console.error(err);
                }
            }
        });
    }

    connectDiscord(): void {
        this.client.login(process.env.DISCORD_BOT_TOKEN);
    }

    createNextSchedules(content: string): string {
        // やりたいことが明記されていたら文章を作成する
        // メンションは「<@![数桁の半角数字]*> コメント」で構成される
        const removeMentionsContent = content.replace(/<@![0-9]*>/g, "").trim();

        // 週末の文字列を作成する
        const japanNowDate = dayjs();
        const weekends = [5, 6, 7];

        const weekendsText =  weekends.map((d, n) => {
            // 日曜日だったら次の週末を提示する
            const diffDay = d - japanNowDate.day();
            const targetDate = japanNowDate.add(diffDay, "day");

            return `${n + 1}: ${targetDate.format("YYYY/MM/DD(ddd)")}`;
        }).join("\n");

        return (removeMentionsContent.length)
            ? `やりたいこと**「${removeMentionsContent}」**\n${weekendsText}`
            : weekendsText;
    }
}

export const discordBot = new DiscordBot();