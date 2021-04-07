import {Client} from "discord.js";
import dotenv from "dotenv";
import dayjs from "dayjs";
import "dayjs/locale/ja";

const client = new Client({disableEveryone: true});
dotenv.config();
dayjs.locale("ja");

const toNextWeekends = () => {
    const japanNowDate = dayjs();
    const weekends = [6, 7];

    return weekends.map((d, n) => {
        // 日曜日だったら次の週末を提示する
        const diffDay = d - japanNowDate.day();
        const targetDate = japanNowDate.add(diffDay, "day");

        return `${n + 1}: ${targetDate.format("YYYY/MM/DD(ddd)")}`;
    }).join("\n");
};

if (process.env.DISCORD_BOT_TOKEN === undefined) {
    console.log("DISCORD_BOT_TOKEN does not exist.");
    process.exit(0);
}

client.on("ready", () => {
    console.log("This bot is running...");

    // Bot オンラインであれば、「Bot をプレイ中と表示される」
    client.user.setPresence({activity: {name: "Bot"}});
});

client.on("message", async (message) => {
    // 自分のメッセージには反応しないようにする
    if (message.author.bot) {
        return;
    }

    // メンションされる & @everyone や @here ではない & 単独メンションのときに動作する
    if ((message.mentions.users.find((e) => e.username === client.user.username) && message.mentions.users.array().length === 1)
        || (message.mentions.roles.find((e) => e.name === client.user.username) && message.mentions.roles.array().length === 1)) {
        const sentMessage = await message.channel.send(`@everyone \n${toNextWeekends()}`);
        try {
            await sentMessage.react("1️⃣");
            await sentMessage.react("2️⃣");
            await sentMessage.react("❌");
        } catch (err) {
            console.error(err);
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);